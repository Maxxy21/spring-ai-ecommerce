package com.maxwell.ecommerce.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maxwell.ecommerce.dto.request.ProductRequest;
import com.maxwell.ecommerce.dto.response.ProductResponse;
import com.maxwell.ecommerce.exception.GlobalExceptionHandler;
import com.maxwell.ecommerce.exception.ResourceNotFoundException;
import com.maxwell.ecommerce.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@Import(GlobalExceptionHandler.class)
@WithMockUser
class ProductControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean ProductService productService;

    private ProductResponse sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = ProductResponse.builder()
                .id(1L)
                .name("Mechanical Keyboard")
                .price(new BigDecimal("129.99"))
                .stockQuantity(20)
                .inStock(true)
                .categoryName("Peripherals")
                .build();
    }

    @Test
    void getAll_returns200WithPage() throws Exception {
        when(productService.findAll(any())).thenReturn(new PageImpl<>(List.of(sampleProduct)));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Mechanical Keyboard"))
                .andExpect(jsonPath("$.content[0].price").value(129.99));
    }

    @Test
    void getById_returns200_whenFound() throws Exception {
        when(productService.findById(1L)).thenReturn(sampleProduct);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Mechanical Keyboard"));
    }

    @Test
    void getById_returns404_whenNotFound() throws Exception {
        when(productService.findById(99L)).thenThrow(new ResourceNotFoundException("Product", 99L));

        mockMvc.perform(get("/api/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void create_returns201_withValidRequest() throws Exception {
        ProductRequest request = new ProductRequest();
        request.setName("Gaming Mouse");
        request.setPrice(new BigDecimal("59.99"));
        request.setStockQuantity(100);

        when(productService.create(any())).thenReturn(sampleProduct);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void create_returns400_whenNameMissing() throws Exception {
        ProductRequest request = new ProductRequest();
        request.setPrice(new BigDecimal("59.99"));  // name is missing

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.name").exists());
    }

    @Test
    void delete_returns204_whenFound() throws Exception {
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());
    }
}
