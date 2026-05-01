package com.maxwell.ecommerce.dto.response;

import com.maxwell.ecommerce.model.CartItem;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponse {

    private String userId;
    private List<CartItem> items;
    private int totalItems;
    private BigDecimal totalAmount;

    public static CartResponse of(String userId, List<CartItem> items) {
        BigDecimal total = items.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalQty = items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return CartResponse.builder()
                .userId(userId)
                .items(items)
                .totalItems(totalQty)
                .totalAmount(total)
                .build();
    }
}
