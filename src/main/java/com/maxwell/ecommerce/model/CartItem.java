package com.maxwell.ecommerce.model;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem implements Serializable {

    private Long productId;
    private String productName;
    private BigDecimal unitPrice;
    private Integer quantity;

    public BigDecimal getTotalPrice() {
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    public void incrementQuantity(int amount) {
        this.quantity += amount;
    }
}
