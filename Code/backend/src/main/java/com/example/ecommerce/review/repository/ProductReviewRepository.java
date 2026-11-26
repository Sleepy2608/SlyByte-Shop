package com.example.ecommerce.review.repository;

import com.example.ecommerce.review.entity.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    @Query("SELECT r FROM ProductReview r JOIN FETCH r.user WHERE r.product.id = :productId ORDER BY r.createdAt DESC")
    Page<ProductReview> findByProductIdWithUser(@Param("productId") Long productId, Pageable pageable);

    Optional<ProductReview> findByProductIdAndUserId(Long productId, Long userId);

    boolean existsByProductIdAndUserId(Long productId, Long userId);

    long countByProductId(Long productId);

    @Query("SELECT AVG(CAST(r.rating as double)) FROM ProductReview r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT r.rating, COUNT(r) FROM ProductReview r WHERE r.product.id = :productId GROUP BY r.rating")
    List<Object[]> getRatingDistributionByProductId(@Param("productId") Long productId);
}
