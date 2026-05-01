package com.maxwell.ecommerce.controller;

import com.maxwell.ecommerce.config.SecurityUtils;
import com.maxwell.ecommerce.dto.request.OrderRequest;
import com.maxwell.ecommerce.dto.response.OrderResponse;
import com.maxwell.ecommerce.model.OrderStatus;
import com.maxwell.ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order placement and management")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Place an order from the authenticated user's cart")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(userId, request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<OrderResponse> getById(@PathVariable Long id) {
        String userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(orderService.findById(id, userId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all orders for a user")
    public ResponseEntity<Page<OrderResponse>> getByUser(
            @PathVariable String userId,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        SecurityUtils.requireSelf(userId);
        return ResponseEntity.ok(orderService.findByUser(userId, pageable));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id,
                                                       @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
