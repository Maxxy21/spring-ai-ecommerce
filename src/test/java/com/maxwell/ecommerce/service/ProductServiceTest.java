package com.maxwell.ecommerce.service;

import com.maxwell.ecommerce.dto.request.ProductRequest;
import com.maxwell.ecommerce.dto.response.ProductResponse;
import com.maxwell.ecommerce.exception.ResourceNotFoundException;
import com.maxwell.ecommerce.model.Category;
import com.maxwell.ecommerce.model.Product;
import com.maxwell.ecommerce.repository.CategoryRepository;
import com.maxwell.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock ProductRepository productRepository;
    @Mock CategoryRepository categoryRepository;

    @InjectMocks ProductService productService;

    private Product product;
    private Category category;

    @BeforeEach
    void setUp() {
        category = Category.builder().id(1L).name("Electronics").build();
        product = Product.builder()
                .id(1L)
                .name("Wireless Headphones")
                .description("High-quality wireless headphones")
                .price(new BigDecimal("79.99"))
                .stockQuantity(50)
                .category(category)
                .build();
    }

    @Test
    void findById_returnsProduct_whenExists() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponse response = productService.findById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Wireless Headphones");
        assertThat(response.getPrice()).isEqualByComparingTo("79.99");
        assertThat(response.isInStock()).isTrue();
    }

    @Test
    void findById_throwsNotFound_whenMissing() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void findAll_returnsPaginatedResults() {
        Page<Product> page = new PageImpl<>(List.of(product));
        when(productRepository.findAll(any(PageRequest.class))).thenReturn(page);

        Page<ProductResponse> result = productService.findAll(PageRequest.of(0, 20));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Wireless Headphones");
    }

    @Test
    void create_savesAndReturnsProduct() {
        ProductRequest request = new ProductRequest();
        request.setName("Smart Watch");
        request.setPrice(new BigDecimal("199.99"));
        request.setStockQuantity(30);
        request.setCategoryId(1L);

        Product saved = Product.builder().id(2L).name("Smart Watch")
                .price(new BigDecimal("199.99")).stockQuantity(30).category(category).build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(saved);

        ProductResponse response = productService.create(request);

        assertThat(response.getName()).isEqualTo("Smart Watch");
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void create_throwsNotFound_whenCategoryMissing() {
        ProductRequest request = new ProductRequest();
        request.setName("Widget");
        request.setPrice(BigDecimal.TEN);
        request.setCategoryId(999L);

        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.create(request))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(productRepository, never()).save(any());
    }

    @Test
    void delete_removesProduct_whenExists() {
        when(productRepository.existsById(1L)).thenReturn(true);

        productService.delete(1L);

        verify(productRepository).deleteById(1L);
    }

    @Test
    void delete_throwsNotFound_whenMissing() {
        when(productRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> productService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(productRepository, never()).deleteById(any());
    }
}
