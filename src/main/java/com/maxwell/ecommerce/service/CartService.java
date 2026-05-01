package com.maxwell.ecommerce.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maxwell.ecommerce.dto.request.CartItemRequest;
import com.maxwell.ecommerce.dto.response.CartResponse;
import com.maxwell.ecommerce.exception.InsufficientStockException;
import com.maxwell.ecommerce.exception.ResourceNotFoundException;
import com.maxwell.ecommerce.model.CartItem;
import com.maxwell.ecommerce.model.Product;
import com.maxwell.ecommerce.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CartService {

    private static final String CART_KEY_PREFIX = "cart:";
    private static final long CART_TTL_HOURS = 24;

    private final RedisTemplate<String, Object> redisTemplate;
    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    public CartService(RedisTemplate<String, Object> redisTemplate,
                       ProductRepository productRepository,
                       ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
    }

    private String cartKey(String userId) {
        return CART_KEY_PREFIX + userId;
    }

    public CartResponse getCart(String userId) {
        return CartResponse.of(userId, getCartItems(userId));
    }

    public CartResponse addItem(String userId, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        if (!product.hasStock(request.getQuantity())) {
            throw new InsufficientStockException(product.getName(), request.getQuantity(), product.getStockQuantity());
        }

        List<CartItem> items = getCartItems(userId);

        items.stream()
                .filter(i -> i.getProductId().equals(request.getProductId()))
                .findFirst()
                .ifPresentOrElse(
                        existing -> existing.incrementQuantity(request.getQuantity()),
                        () -> items.add(CartItem.builder()
                                .productId(product.getId())
                                .productName(product.getName())
                                .unitPrice(product.getPrice())
                                .quantity(request.getQuantity())
                                .build())
                );

        saveCartItems(userId, items);
        log.debug("Added item productId={} qty={} to cart user={}", request.getProductId(), request.getQuantity(), userId);
        return CartResponse.of(userId, items);
    }

    public CartResponse updateItem(String userId, Long productId, int quantity) {
        List<CartItem> items = getCartItems(userId);

        if (quantity <= 0) {
            items.removeIf(i -> i.getProductId().equals(productId));
        } else {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
            if (!product.hasStock(quantity)) {
                throw new InsufficientStockException(product.getName(), quantity, product.getStockQuantity());
            }
            items.stream()
                    .filter(i -> i.getProductId().equals(productId))
                    .findFirst()
                    .ifPresent(i -> i.setQuantity(quantity));
        }

        saveCartItems(userId, items);
        return CartResponse.of(userId, items);
    }

    public CartResponse removeItem(String userId, Long productId) {
        List<CartItem> items = getCartItems(userId);
        items.removeIf(i -> i.getProductId().equals(productId));
        saveCartItems(userId, items);
        return CartResponse.of(userId, items);
    }

    public void clearCart(String userId) {
        redisTemplate.delete(cartKey(userId));
        log.debug("Cleared cart for user={}", userId);
    }

    public List<CartItem> getCartItems(String userId) {
        Object raw = redisTemplate.opsForValue().get(cartKey(userId));
        if (!(raw instanceof List<?> list) || list.isEmpty()) {
            return new ArrayList<>();
        }
        // Safely convert each element — Jackson may deserialize as LinkedHashMap
        // when generic type info is absent; convertValue handles both cases.
        return list.stream()
                .map(item -> objectMapper.convertValue(item, CartItem.class))
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private void saveCartItems(String userId, List<CartItem> items) {
        redisTemplate.opsForValue().set(cartKey(userId), items, CART_TTL_HOURS, TimeUnit.HOURS);
    }
}
