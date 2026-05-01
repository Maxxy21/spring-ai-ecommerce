package com.maxwell.ecommerce.repository;

import com.maxwell.ecommerce.model.Order;
import com.maxwell.ecommerce.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUserId(String userId, Pageable pageable);

    Page<Order> findByUserIdAndStatus(String userId, OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM Order o JOIN FETCH o.items i JOIN FETCH i.product WHERE o.id = :id")
    java.util.Optional<Order> findByIdWithItems(@Param("id") Long id);
}
