package com.example.ecommerce.review.service;

import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.order.entity.OrderStatus;
import com.example.ecommerce.order.repository.OrderItemRepository;
import com.example.ecommerce.product.entity.Product;
import com.example.ecommerce.product.repository.ProductRepository;
import com.example.ecommerce.review.dto.CreateReviewRequest;
import com.example.ecommerce.review.dto.ProductReviewResponse;
import com.example.ecommerce.review.dto.ProductReviewSummary;
import com.example.ecommerce.review.entity.ProductReview;
import com.example.ecommerce.review.repository.ProductReviewRepository;
import com.example.ecommerce.user.entity.User;
import com.example.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public ProductReviewResponse createReview(String userEmail, Long productId, CreateReviewRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        // Check if user already reviewed this product
        ProductReview review = reviewRepository.findByProductIdAndUserId(productId, user.getId())
                .orElse(null);

        boolean isVerified = orderItemRepository.hasUserPurchasedProduct(user.getId(), productId, OrderStatus.DELIVERED);

        if (review != null) {
            // Update existing review
            review.setRating(request.getRating());
            review.setComment(request.getComment());
            if (isVerified) {
                review.setIsVerifiedPurchase(true);
            }
        } else {
            // Create new review
            review = ProductReview.builder()
                    .product(product)
                    .user(user)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .isVerifiedPurchase(isVerified)
                    .build();
        }

        ProductReview saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Sản phẩm không tồn tại");
        }
        return reviewRepository.findByProductIdWithUser(productId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductReviewSummary getProductReviewSummary(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Sản phẩm không tồn tại");
        }

        long totalReviews = reviewRepository.countByProductId(productId);
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        double roundedAvg = avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0;

        Map<Integer, Long> ratingCounts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingCounts.put(i, 0L);
        }

        List<Object[]> distribution = reviewRepository.getRatingDistributionByProductId(productId);
        for (Object[] row : distribution) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            ratingCounts.put(rating, count);
        }

        return ProductReviewSummary.builder()
                .averageRating(roundedAvg)
                .totalReviews(totalReviews)
                .ratingCounts(ratingCounts)
                .build();
    }

    private ProductReviewResponse mapToResponse(ProductReview review) {
        return ProductReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullName())
                .userAvatar(review.getUser().getAvatarUrl())
                .rating(review.getRating())
                .comment(review.getComment())
                .isVerifiedPurchase(review.getIsVerifiedPurchase())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
