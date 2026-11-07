package com.example.ecommerce.cart.dto;

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
public class CartItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productSlug;
    private String productThumbnail;
    private String brandName;
    private String categoryName;
    private BigDecimal price;
    private BigDecimal currentPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private Integer stockQuantity;
    private ProductStatus status;
}

