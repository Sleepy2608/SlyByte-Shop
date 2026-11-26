package com.example.ecommerce.review.controller;

import com.example.ecommerce.common.dto.PageResponse;
import com.example.ecommerce.review.dto.CreateReviewRequest;
import com.example.ecommerce.review.dto.ProductReviewResponse;
import com.example.ecommerce.review.dto.ProductReviewSummary;
import com.example.ecommerce.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<PageResponse<ProductReviewResponse>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ProductReviewResponse> reviewPage = reviewService.getProductReviews(
                productId,
                PageRequest.of(page, size)
        );

        PageResponse<ProductReviewResponse> response = PageResponse.<ProductReviewResponse>builder()
                .items(reviewPage.getContent())
                .page(reviewPage.getNumber())
                .size(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .last(reviewPage.isLast())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<ProductReviewSummary> getProductReviewSummary(
            @PathVariable Long productId
    ) {
        ProductReviewSummary summary = reviewService.getProductReviewSummary(productId);
        return ResponseEntity.ok(summary);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductReviewResponse> createReview(
            @PathVariable Long productId,
            Authentication authentication,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        String userEmail = authentication.getName();
        ProductReviewResponse response = reviewService.createReview(userEmail, productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
