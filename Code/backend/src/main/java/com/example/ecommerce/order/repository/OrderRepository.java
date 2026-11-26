package com.example.ecommerce.order.repository;

import com.example.ecommerce.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Optional<Order> findByOrderCode(String orderCode);

    Optional<Order> findByOrderCodeAndUserId(String orderCode, Long userId);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.orderCode = :orderCode AND o.user.id = :userId")
    Optional<Order> findByOrderCodeAndUserIdWithItems(@Param("orderCode") String orderCode, @Param("userId") Long userId);

    @Query(value = "SELECT o FROM Order o LEFT JOIN FETCH o.items ORDER BY o.createdAt DESC",
           countQuery = "SELECT COUNT(o) FROM Order o")
    Page<Order> findAllWithItems(Pageable pageable);

    @Query(value = "SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.orderStatus = :status ORDER BY o.createdAt DESC",
           countQuery = "SELECT COUNT(o) FROM Order o WHERE o.orderStatus = :status")
    Page<Order> findByOrderStatusWithItems(@Param("status") com.example.ecommerce.order.entity.OrderStatus status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderStatus != :cancelledStatus")
    java.math.BigDecimal sumTotalRevenueExcludingStatus(@Param("cancelledStatus") com.example.ecommerce.order.entity.OrderStatus cancelledStatus);

    long countByOrderStatus(com.example.ecommerce.order.entity.OrderStatus orderStatus);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);
}

