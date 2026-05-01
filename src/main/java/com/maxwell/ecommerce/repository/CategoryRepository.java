package com.maxwell.ecommerce.repository;

import com.maxwell.ecommerce.dto.response.CategoryResponse;
import com.maxwell.ecommerce.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT new com.maxwell.ecommerce.dto.response.CategoryResponse(c.id, c.name, c.description, c.createdAt, COUNT(p.id)) FROM Category c LEFT JOIN c.products p GROUP BY c.id, c.name, c.description, c.createdAt")
    List<CategoryResponse> findAllWithProductCount();
}
