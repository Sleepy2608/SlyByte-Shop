package com.example.ecommerce.wishlist.service;

import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.product.entity.Product;
import com.example.ecommerce.product.repository.ProductRepository;
import com.example.ecommerce.user.entity.User;
import com.example.ecommerce.user.repository.UserRepository;
import com.example.ecommerce.wishlist.dto.WishlistItemResponse;
import com.example.ecommerce.wishlist.entity.WishlistItem;
import com.example.ecommerce.wishlist.repository.WishlistItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WishlistServiceTest {

    @Mock
    private WishlistItemRepository wishlistRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private WishlistServiceImpl wishlistService;

    private User user;
    private Product product;
    private WishlistItem wishlistItem;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("user@gmail.com")
                .fullName("Test User")
                .build();

        product = Product.builder()
                .id(100L)
                .name("Sony WH-1000XM5")
                .slug("sony-wh-1000xm5")
                .salePrice(BigDecimal.valueOf(8490000))
                .originalPrice(BigDecimal.valueOf(9490000))
                .stockQuantity(15)
                .thumbnail("sony.png")
                .build();

        wishlistItem = WishlistItem.builder()
                .id(200L)
                .user(user)
                .product(product)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("getWishlist - Returns list of wishlist item responses")
    void getWishlist_success() {
        when(userRepository.findByEmail("user@gmail.com")).thenReturn(Optional.of(user));
        when(wishlistRepository.findByUserIdWithProduct(1L)).thenReturn(List.of(wishlistItem));

        List<WishlistItemResponse> result = wishlistService.getWishlist("user@gmail.com");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProductId()).isEqualTo(100L);
        assertThat(result.get(0).getProductName()).isEqualTo("Sony WH-1000XM5");
    }

    @Test
    @DisplayName("addToWishlist - New item added successfully")
    void addToWishlist_new_success() {
        when(userRepository.findByEmail("user@gmail.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));
        when(wishlistRepository.findByUserIdAndProductId(1L, 100L)).thenReturn(Optional.empty());
        when(wishlistRepository.save(any(WishlistItem.class))).thenReturn(wishlistItem);

        WishlistItemResponse response = wishlistService.addToWishlist("user@gmail.com", 100L);

        assertThat(response).isNotNull();
        assertThat(response.getProductId()).isEqualTo(100L);
        verify(wishlistRepository, times(1)).save(any(WishlistItem.class));
    }

    @Test
    @DisplayName("addToWishlist - Already exists returns existing item")
    void addToWishlist_alreadyExists() {
        when(userRepository.findByEmail("user@gmail.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));
        when(wishlistRepository.findByUserIdAndProductId(1L, 100L)).thenReturn(Optional.of(wishlistItem));

        WishlistItemResponse response = wishlistService.addToWishlist("user@gmail.com", 100L);

        assertThat(response).isNotNull();
        assertThat(response.getProductId()).isEqualTo(100L);
        verify(wishlistRepository, never()).save(any(WishlistItem.class));
    }

    @Test
    @DisplayName("removeFromWishlist - Calls repository delete")
    void removeFromWishlist_success() {
        when(userRepository.findByEmail("user@gmail.com")).thenReturn(Optional.of(user));

        wishlistService.removeFromWishlist("user@gmail.com", 100L);

        verify(wishlistRepository, times(1)).deleteByUserIdAndProductId(1L, 100L);
    }

    @Test
    @DisplayName("isInWishlist - Returns true when item exists")
    void isInWishlist_true() {
        when(userRepository.findByEmail("user@gmail.com")).thenReturn(Optional.of(user));
        when(wishlistRepository.existsByUserIdAndProductId(1L, 100L)).thenReturn(true);

        boolean exists = wishlistService.isInWishlist("user@gmail.com", 100L);

        assertThat(exists).isTrue();
    }
}
