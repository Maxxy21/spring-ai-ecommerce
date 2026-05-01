package com.maxwell.ecommerce.service;

import com.maxwell.ecommerce.dto.request.OrderRequest;
import com.maxwell.ecommerce.dto.response.OrderResponse;
import com.maxwell.ecommerce.exception.CartNotFoundException;
import com.maxwell.ecommerce.exception.InsufficientStockException;
import com.maxwell.ecommerce.exception.ResourceNotFoundException;
import com.maxwell.ecommerce.model.*;
import com.maxwell.ecommerce.repository.OrderRepository;
import com.maxwell.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    public OrderResponse findById(Long id) {
        return orderRepository.findByIdWithItems(id)
                .map(OrderResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    public Page<OrderResponse> findByUser(String userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable).map(OrderResponse::from);
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        List<CartItem> cartItems = cartService.getCartItems(request.getUserId());
        if (cartItems.isEmpty()) {
            throw new CartNotFoundException(request.getUserId());
        }

        Order order = Order.builder()
                .userId(request.getUserId())
                .shippingAddress(request.getShippingAddress())
                .notes(request.getNotes())
                .status(OrderStatus.PENDING)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", cartItem.getProductId()));

            if (!product.hasStock(cartItem.getQuantity())) {
                throw new InsufficientStockException(product.getName(), cartItem.getQuantity(), product.getStockQuantity());
            }

            product.decrementStock(cartItem.getQuantity());
            productRepository.save(product);

            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .totalPrice(cartItem.getTotalPrice())
                    .build();
            order.addItem(item);
            total = total.add(cartItem.getTotalPrice());
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        cartService.clearCart(request.getUserId());

        log.info("Placed order id={} for user={} total={}", saved.getId(), saved.getUserId(), saved.getTotalAmount());
        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        validateStatusTransition(order.getStatus(), newStatus);
        OrderStatus previousStatus = order.getStatus();
        order.setStatus(newStatus);

        log.info("Updated order id={} status {} -> {}", id, previousStatus, newStatus);
        return OrderResponse.from(orderRepository.save(order));
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        if (current == OrderStatus.DELIVERED || current == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException(
                    "Cannot transition order from " + current + " to " + next);
        }
    }
}
