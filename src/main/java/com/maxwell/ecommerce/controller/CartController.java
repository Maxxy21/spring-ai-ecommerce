package com.maxwell.ecommerce.controller;

import com.maxwell.ecommerce.config.SecurityUtils;
import com.maxwell.ecommerce.dto.request.CartItemRequest;
import com.maxwell.ecommerce.dto.response.CartResponse;
import com.maxwell.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Validated
@Tag(name = "Cart", description = "Shopping cart management (Redis-backed)")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    @Operation(summary = "Get cart for a user")
    public ResponseEntity<CartResponse> getCart(@PathVariable String userId) {
        SecurityUtils.requireSelf(userId);
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/{userId}/items")
    @Operation(summary = "Add an item to the cart")
    public ResponseEntity<CartResponse> addItem(@PathVariable String userId,
                                                 @Valid @RequestBody CartItemRequest request) {
        SecurityUtils.requireSelf(userId);
        return ResponseEntity.ok(cartService.addItem(userId, request));
    }

    @PutMapping("/{userId}/items/{productId}")
    @Operation(summary = "Update item quantity in cart (0 removes it)")
    public ResponseEntity<CartResponse> updateItem(@PathVariable String userId,
                                                    @PathVariable Long productId,
                                                    @RequestParam @Min(0) int quantity) {
        SecurityUtils.requireSelf(userId);
        return ResponseEntity.ok(cartService.updateItem(userId, productId, quantity));
    }

    @DeleteMapping("/{userId}/items/{productId}")
    @Operation(summary = "Remove an item from the cart")
    public ResponseEntity<CartResponse> removeItem(@PathVariable String userId,
                                                    @PathVariable Long productId) {
        SecurityUtils.requireSelf(userId);
        return ResponseEntity.ok(cartService.removeItem(userId, productId));
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Clear the entire cart")
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        SecurityUtils.requireSelf(userId);
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
