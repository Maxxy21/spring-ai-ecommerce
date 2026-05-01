package com.maxwell.ecommerce.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maxwell.ecommerce.dto.request.CartItemRequest;
import com.maxwell.ecommerce.dto.response.CartResponse;
import com.maxwell.ecommerce.exception.InsufficientStockException;
import com.maxwell.ecommerce.exception.ResourceNotFoundException;
import com.maxwell.ecommerce.model.CartItem;
import com.maxwell.ecommerce.model.Product;
import com.maxwell.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock RedisTemplate<String, Object> redisTemplate;
    @Mock ValueOperations<String, Object> valueOps;
    @Mock ProductRepository productRepository;

    CartService cartService;

    private Product product;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
        cartService = new CartService(redisTemplate, productRepository, new ObjectMapper());

        product = Product.builder()
                .id(1L)
                .name("Laptop")
                .price(new BigDecimal("999.00"))
                .stockQuantity(10)
                .build();
    }

    @Test
    void getCart_returnsEmptyCart_whenNoItemsInRedis() {
        when(valueOps.get("cart:user1")).thenReturn(null);

        CartResponse cart = cartService.getCart("user1");

        assertThat(cart.getItems()).isEmpty();
        assertThat(cart.getTotalAmount()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void addItem_addsNewProduct_toEmptyCart() {
        when(valueOps.get("cart:user1")).thenReturn(null);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(2);

        CartResponse cart = cartService.addItem("user1", request);

        assertThat(cart.getItems()).hasSize(1);
        assertThat(cart.getItems().get(0).getQuantity()).isEqualTo(2);
        assertThat(cart.getTotalAmount()).isEqualByComparingTo("1998.00");
        verify(valueOps).set(eq("cart:user1"), any(), anyLong(), any());
    }

    @Test
    void addItem_incrementsQuantity_forExistingProduct() {
        CartItem existing = CartItem.builder()
                .productId(1L).productName("Laptop")
                .unitPrice(new BigDecimal("999.00")).quantity(1).build();
        when(valueOps.get("cart:user1")).thenReturn(new ArrayList<>(List.of(existing)));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(2);

        CartResponse cart = cartService.addItem("user1", request);

        assertThat(cart.getItems().get(0).getQuantity()).isEqualTo(3);
    }

    @Test
    void addItem_throwsInsufficientStock_whenNotEnoughStock() {
        product.setStockQuantity(1);
        when(valueOps.get("cart:user1")).thenReturn(null);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(5);

        assertThatThrownBy(() -> cartService.addItem("user1", request))
                .isInstanceOf(InsufficientStockException.class);
    }

    @Test
    void addItem_throwsNotFound_whenProductMissing() {
        when(valueOps.get("cart:user1")).thenReturn(null);
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        CartItemRequest request = new CartItemRequest();
        request.setProductId(99L);
        request.setQuantity(1);

        assertThatThrownBy(() -> cartService.addItem("user1", request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void removeItem_removesProductFromCart() {
        CartItem item = CartItem.builder()
                .productId(1L).productName("Laptop")
                .unitPrice(new BigDecimal("999.00")).quantity(1).build();
        when(valueOps.get("cart:user1")).thenReturn(new ArrayList<>(List.of(item)));

        CartResponse cart = cartService.removeItem("user1", 1L);

        assertThat(cart.getItems()).isEmpty();
    }

    @Test
    void clearCart_deletesRedisKey() {
        cartService.clearCart("user1");

        verify(redisTemplate).delete("cart:user1");
    }
}
