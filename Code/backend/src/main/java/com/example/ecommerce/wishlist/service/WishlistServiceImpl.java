package com.example.ecommerce.wishlist.service;

import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.product.entity.Product;
import com.example.ecommerce.product.repository.ProductRepository;
import com.example.ecommerce.user.entity.User;
import com.example.ecommerce.user.repository.UserRepository;
import com.example.ecommerce.wishlist.dto.WishlistItemResponse;
import com.example.ecommerce.wishlist.entity.WishlistItem;
import com.example.ecommerce.wishlist.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<WishlistItemResponse> getWishlist(String userEmail) {
        User user = getUser(userEmail);
        return wishlistRepository.findByUserIdWithProduct(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public WishlistItemResponse addToWishlist(String userEmail, Long productId) {
        User user = getUser(userEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        // If already in wishlist, return existing
        WishlistItem existing = wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElse(null);

        if (existing != null) {
            return mapToResponse(existing);
        }

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        WishlistItem saved = wishlistRepository.save(item);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void removeFromWishlist(String userEmail, Long productId) {
        User user = getUser(userEmail);
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isInWishlist(String userEmail, Long productId) {
        User user = getUser(userEmail);
        return wishlistRepository.existsByUserIdAndProductId(user.getId(), productId);
    }

    private User getUser(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));
    }

    private WishlistItemResponse mapToResponse(WishlistItem item) {
        Product p = item.getProduct();
        return WishlistItemResponse.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productSlug(p.getSlug())
                .salePrice(p.getSalePrice())
                .originalPrice(p.getOriginalPrice())
                .stockQuantity(p.getStockQuantity())
                .thumbnail(p.getThumbnail())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
