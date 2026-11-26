package com.example.ecommerce.wishlist.service;

import com.example.ecommerce.wishlist.dto.WishlistItemResponse;

import java.util.List;

public interface WishlistService {

    List<WishlistItemResponse> getWishlist(String userEmail);

    WishlistItemResponse addToWishlist(String userEmail, Long productId);

    void removeFromWishlist(String userEmail, Long productId);

    boolean isInWishlist(String userEmail, Long productId);
}
