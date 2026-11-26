package com.example.ecommerce.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewSummary {

    private Double averageRating;
    private Long totalReviews;
    private Map<Integer, Long> ratingCounts;
}
