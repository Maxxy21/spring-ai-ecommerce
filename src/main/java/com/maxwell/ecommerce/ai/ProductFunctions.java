package com.maxwell.ecommerce.ai;

import com.maxwell.ecommerce.dto.response.ProductResponse;
import com.maxwell.ecommerce.repository.ProductRepository;
import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.List;
import java.util.function.Function;

@Configuration
@Slf4j
public class ProductFunctions {

    @JsonClassDescription("Request to search for products by keyword")
    public record ProductSearchRequest(
            @JsonPropertyDescription("Search keyword to find products by name or description")
            String keyword
    ) {}

    @JsonClassDescription("Request to get product details by ID")
    public record ProductDetailRequest(
            @JsonPropertyDescription("The product ID to retrieve")
            Long productId
    ) {}

    @JsonClassDescription("Result when a product is not found")
    public record ProductNotFound(String message) {}

    @JsonClassDescription("Summary of a product")
    public record ProductSummary(
            Long id,
            String name,
            String description,
            String price,
            int stockQuantity,
            boolean inStock,
            String category
    ) {
        public static ProductSummary from(ProductResponse p) {
            return new ProductSummary(
                    p.getId(),
                    p.getName(),
                    p.getDescription(),
                    "$" + p.getPrice(),
                    p.getStockQuantity(),
                    p.isInStock(),
                    p.getCategoryName()
            );
        }
    }

    @Bean
    @Description("Search for products by keyword. Returns a list of matching products with name, price, and availability.")
    public Function<ProductSearchRequest, List<ProductSummary>> searchProducts(ProductRepository productRepository) {
        return request -> {
            String keyword = request.keyword();
            if (keyword == null || keyword.isBlank() || keyword.length() > 100) {
                return List.of();
            }
            log.info("AI function: searchProducts keyword='{}'", keyword);
            return productRepository.findByKeyword(keyword).stream()
                    .map(ProductResponse::from)
                    .map(ProductSummary::from)
                    .toList();
        };
    }

    @Bean
    @Description("Get detailed information about a specific product by its ID.")
    public Function<ProductDetailRequest, Object> getProductDetails(ProductRepository productRepository) {
        return request -> {
            log.info("AI function: getProductDetails productId={}", request.productId());
            return productRepository.findById(request.productId())
                    .map(ProductResponse::from)
                    .map(ProductSummary::from)
                    .<Object>map(s -> s)
                    .orElse(new ProductNotFound("No product found with id: " + request.productId()));
        };
    }
}
