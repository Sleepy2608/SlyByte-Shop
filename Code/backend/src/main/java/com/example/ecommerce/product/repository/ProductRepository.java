package com.example.ecommerce.product.repository;

import com.example.ecommerce.product.entity.Product;
import com.example.ecommerce.product.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.brand WHERE p.id = :id")
    Optional<Product> findByIdWithCategoryAndBrand(@Param("id") Long id);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.brand WHERE p.slug = :slug")
    Optional<Product> findBySlugWithCategoryAndBrand(@Param("slug") String slug);

    List<Product> findTop8ByStatusOrderByCreatedAtDesc(ProductStatus status);

    List<Product> findTop4ByCategoryIdAndIdNotAndStatus(Long categoryId, Long id, ProductStatus status);

    @Query("SELECT p FROM Product p WHERE p.status = :status " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId OR p.category.parentId = :categoryId) " +
           "AND (:brandId IS NULL OR p.brand.id = :brandId) " +
           "AND (:minPrice IS NULL OR p.salePrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.salePrice <= :maxPrice) " +
           "AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> filterProducts(
            @Param("status") ProductStatus status,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
