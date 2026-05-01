package com.maxwell.ecommerce.service;

import com.maxwell.ecommerce.dto.request.ProductRequest;
import com.maxwell.ecommerce.dto.response.ProductResponse;
import com.maxwell.ecommerce.exception.ResourceNotFoundException;
import com.maxwell.ecommerce.model.Category;
import com.maxwell.ecommerce.model.Product;
import com.maxwell.ecommerce.repository.CategoryRepository;
import com.maxwell.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Cacheable(value = "products", key = "#id")
    public ProductResponse findById(Long id) {
        return productRepository.findById(id)
                .map(ProductResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    public Page<ProductResponse> findAll(Pageable pageable) {
        return productRepository.findAll(pageable).map(ProductResponse::from);
    }

    public Page<ProductResponse> search(String keyword, Long categoryId,
                                        BigDecimal minPrice, BigDecimal maxPrice,
                                        Pageable pageable) {
        return productRepository.search(keyword, categoryId, minPrice, maxPrice, pageable)
                .map(ProductResponse::from);
    }

    public Page<ProductResponse> findByCategory(Long categoryId, Pageable pageable) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", categoryId);
        }
        return productRepository.findByCategoryId(categoryId, pageable).map(ProductResponse::from);
    }

    public List<ProductResponse> findLatest() {
        return productRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(ProductResponse::from)
                .toList();
    }

    public List<ProductResponse> findByKeyword(String keyword) {
        return productRepository.findByKeyword(keyword).stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
            product.setCategory(category);
        }

        Product saved = productRepository.save(product);
        log.info("Created product id={} name={}", saved.getId(), saved.getName());
        return ProductResponse.from(saved);
    }

    @Transactional
    @CacheEvict(value = "products", key = "#id")
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    @CacheEvict(value = "products", key = "#id")
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", id);
        }
        productRepository.deleteById(id);
        log.info("Deleted product id={}", id);
    }

    public Product getProductEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }
}
