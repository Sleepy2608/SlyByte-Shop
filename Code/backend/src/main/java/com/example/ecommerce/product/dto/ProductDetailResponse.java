package com.example.ecommerce.product.dto;

import com.example.ecommerce.product.entity.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer discountPercentage;
    private Integer stockQuantity;
    private String thumbnail;
    private ProductStatus status;
    private LocalDateTime createdAt;
    private CategoryResponse category;
    private BrandResponse brand;
    private List<ProductImageResponse> images;
    private List<ProductSpecResponse> specs;
}
