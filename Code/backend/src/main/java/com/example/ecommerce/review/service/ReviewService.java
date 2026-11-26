package com.example.ecommerce.review.service;

import com.example.ecommerce.review.dto.CreateReviewRequest;
import com.example.ecommerce.review.dto.ProductReviewResponse;
import com.example.ecommerce.review.dto.ProductReviewSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {

    ProductReviewResponse createReview(String userEmail, Long productId, CreateReviewRequest request);

    Page<ProductReviewResponse> getProductReviews(Long productId, Pageable pageable);

    ProductReviewSummary getProductReviewSummary(Long productId);
}
