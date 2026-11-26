package com.example.ecommerce.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewResponse {

    private Long id;
    private Long productId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Integer rating;
    private String comment;
    private Boolean isVerifiedPurchase;
    private LocalDateTime createdAt;
}
