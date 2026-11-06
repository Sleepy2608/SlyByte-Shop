package com.example.ecommerce.product.dto;

import com.example.ecommerce.product.entity.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryResponse {
    private Long id;
    private String name;
    private String slug;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer discountPercentage;
    private Integer stockQuantity;
    private String thumbnail;
    private ProductStatus status;
    private Long categoryId;
    private String categoryName;
    private Long brandId;
    private String brandName;
}
