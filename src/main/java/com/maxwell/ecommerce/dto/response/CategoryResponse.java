package com.maxwell.ecommerce.dto.response;

import com.maxwell.ecommerce.model.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private int productCount;

    /** Constructor used by JPQL constructor expression in CategoryRepository. */
    public CategoryResponse(Long id, String name, String description, LocalDateTime createdAt, Long productCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.productCount = productCount != null ? productCount.intValue() : 0;
    }

    public static CategoryResponse from(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .productCount(category.getProducts().size())
                .createdAt(category.getCreatedAt())
                .build();
    }
}
