package com.maxwell.ecommerce.service;

import com.maxwell.ecommerce.dto.request.OrderRequest;
import com.maxwell.ecommerce.dto.response.OrderResponse;
import com.maxwell.ecommerce.exception.CartNotFoundException;
import com.maxwell.ecommerce.exception.InsufficientStockException;
import com.maxwell.ecommerce.model.*;
import com.maxwell.ecommerce.repository.OrderRepository;
import com.maxwell.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository orderRepository;
    @Mock ProductRepository productRepository;
    @Mock CartService cartService;

    @InjectMocks OrderService orderService;

    private Product product;
    private CartItem cartItem;
    private OrderRequest orderRequest;

    @BeforeEach
    void setUp() {
        product = Product.builder()
                .id(1L).name("Headphones")
                .price(new BigDecimal("49.99")).stockQuantity(5)
                .build();

        cartItem = CartItem.builder()
                .productId(1L).productName("Headphones")
                .unitPrice(new BigDecimal("49.99")).quantity(2)
                .build();

        orderRequest = new OrderRequest();
        orderRequest.setShippingAddress("123 Main St, Berlin");
    }

    @Test
    void placeOrder_createsOrderAndClearsCart() {
        when(cartService.getCartItems("user42")).thenReturn(List.of(cartItem));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Order saved = Order.builder()
                .id(10L).userId("user42")
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("99.98"))
                .shippingAddress("123 Main St, Berlin")
                .items(List.of())
                .build();
        when(orderRepository.save(any(Order.class))).thenReturn(saved);

        OrderResponse response = orderService.placeOrder("user42", orderRequest);

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getStatus()).isEqualTo(OrderStatus.PENDING);
        verify(productRepository).save(product);  // stock decremented
        verify(cartService).clearCart("user42");
    }

    @Test
    void placeOrder_throwsCartNotFound_whenCartIsEmpty() {
        when(cartService.getCartItems("user42")).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> orderService.placeOrder("user42", orderRequest))
                .isInstanceOf(CartNotFoundException.class);

        verify(orderRepository, never()).save(any());
    }

    @Test
    void placeOrder_throwsInsufficientStock_whenProductLowStock() {
        product.setStockQuantity(1);
        when(cartService.getCartItems("user42")).thenReturn(List.of(cartItem));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> orderService.placeOrder("user42", orderRequest))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("Headphones");

        verify(orderRepository, never()).save(any());
        verify(cartService, never()).clearCart(any());
    }

    @Test
    void updateStatus_transitionsStatus_whenValid() {
        Order order = Order.builder().id(1L).status(OrderStatus.PENDING).userId("user42")
                .totalAmount(BigDecimal.TEN).items(List.of()).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        orderService.updateStatus(1L, OrderStatus.CONFIRMED);

        assertThat(order.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
    }

    @Test
    void updateStatus_throws_whenOrderAlreadyDelivered() {
        Order order = Order.builder().id(1L).status(OrderStatus.DELIVERED).userId("user42")
                .totalAmount(BigDecimal.TEN).items(List.of()).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.updateStatus(1L, OrderStatus.CANCELLED))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
