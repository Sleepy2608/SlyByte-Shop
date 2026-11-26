package com.example.ecommerce.wishlist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productSlug;
    private BigDecimal salePrice;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String thumbnail;
    private LocalDateTime createdAt;
}
