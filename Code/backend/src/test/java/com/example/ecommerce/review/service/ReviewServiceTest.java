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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ProductReviewRepository reviewRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private User user;
    private Product product;
    private ProductReview review;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("buyer@gmail.com")
                .fullName("Nguyen Van A")
                .avatarUrl("avatar.png")
                .build();

        product = Product.builder()
                .id(100L)
                .name("MacBook Pro M3 Max")
                .salePrice(BigDecimal.valueOf(79990000))
                .originalPrice(BigDecimal.valueOf(84990000))
                .build();

        review = ProductReview.builder()
                .id(500L)
                .product(product)
                .user(user)
                .rating(5)
                .comment("May chay rat muot va mat!")
                .isVerifiedPurchase(true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("createReview - Successful new verified review")
    void createReview_success_newVerified() {
        CreateReviewRequest request = CreateReviewRequest.builder()
                .rating(5)
                .comment("May chay rat muot va mat!")
                .build();

        when(userRepository.findByEmail("buyer@gmail.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));
        when(reviewRepository.findByProductIdAndUserId(100L, 1L)).thenReturn(Optional.empty());
        when(orderItemRepository.hasUserPurchasedProduct(1L, 100L, OrderStatus.DELIVERED)).thenReturn(true);
        when(reviewRepository.save(any(ProductReview.class))).thenReturn(review);

        ProductReviewResponse response = reviewService.createReview("buyer@gmail.com", 100L, request);

        assertThat(response).isNotNull();
        assertThat(response.getRating()).isEqualTo(5);
        assertThat(response.getComment()).isEqualTo("May chay rat muot va mat!");
        assertThat(response.getIsVerifiedPurchase()).isTrue();
        assertThat(response.getUserName()).isEqualTo("Nguyen Van A");
    }

    @Test
    @DisplayName("createReview - Update existing review")
    void createReview_updateExisting() {
        CreateReviewRequest request = CreateReviewRequest.builder()
                .rating(4)
                .comment("Sau 1 thang su dung thay pin tot")
                .build();

        when(userRepository.findByEmail("buyer@gmail.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));
        when(reviewRepository.findByProductIdAndUserId(100L, 1L)).thenReturn(Optional.of(review));
        when(orderItemRepository.hasUserPurchasedProduct(1L, 100L, OrderStatus.DELIVERED)).thenReturn(true);
        when(reviewRepository.save(any(ProductReview.class))).thenReturn(review);

        ProductReviewResponse response = reviewService.createReview("buyer@gmail.com", 100L, request);

        assertThat(response).isNotNull();
        assertThat(review.getRating()).isEqualTo(4);
        assertThat(review.getComment()).isEqualTo("Sau 1 thang su dung thay pin tot");
    }

    @Test
    @DisplayName("createReview - Throws exception when user not found")
    void createReview_userNotFound() {
        CreateReviewRequest request = CreateReviewRequest.builder().rating(5).comment("tot").build();
        when(userRepository.findByEmail("notfound@gmail.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reviewService.createReview("notfound@gmail.com", 100L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Người dùng không tồn tại");
    }

    @Test
    @DisplayName("getProductReviews - Paginated reviews")
    void getProductReviews_success() {
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.existsById(100L)).thenReturn(true);
        when(reviewRepository.findByProductIdWithUser(100L, pageable))
                .thenReturn(new PageImpl<>(List.of(review), pageable, 1));

        Page<ProductReviewResponse> page = reviewService.getProductReviews(100L, pageable);

        assertThat(page.getTotalElements()).isEqualTo(1);
        assertThat(page.getContent().get(0).getId()).isEqualTo(500L);
    }

    @Test
    @DisplayName("getProductReviewSummary - Computes average and distribution")
    void getProductReviewSummary_success() {
        when(productRepository.existsById(100L)).thenReturn(true);
        when(reviewRepository.countByProductId(100L)).thenReturn(10L);
        when(reviewRepository.getAverageRatingByProductId(100L)).thenReturn(4.7);

        List<Object[]> distribution = new ArrayList<>();
        distribution.add(new Object[]{5, 8L});
        distribution.add(new Object[]{4, 1L});
        distribution.add(new Object[]{3, 1L});
        when(reviewRepository.getRatingDistributionByProductId(100L)).thenReturn(distribution);

        ProductReviewSummary summary = reviewService.getProductReviewSummary(100L);

        assertThat(summary.getTotalReviews()).isEqualTo(10L);
        assertThat(summary.getAverageRating()).isEqualTo(4.7);
        assertThat(summary.getRatingCounts().get(5)).isEqualTo(8L);
        assertThat(summary.getRatingCounts().get(4)).isEqualTo(1L);
        assertThat(summary.getRatingCounts().get(3)).isEqualTo(1L);
        assertThat(summary.getRatingCounts().get(2)).isEqualTo(0L);
    }
}
