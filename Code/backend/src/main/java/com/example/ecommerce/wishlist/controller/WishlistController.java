package com.example.ecommerce.wishlist.controller;

import com.example.ecommerce.wishlist.dto.WishlistItemResponse;
import com.example.ecommerce.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItemResponse>> getWishlist(Authentication authentication) {
        String userEmail = authentication.getName();
        List<WishlistItemResponse> wishlist = wishlistService.getWishlist(userEmail);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<WishlistItemResponse> addToWishlist(
            @PathVariable Long productId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        WishlistItemResponse item = wishlistService.addToWishlist(userEmail, productId);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long productId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        wishlistService.removeFromWishlist(userEmail, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(
            @PathVariable Long productId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        boolean inWishlist = wishlistService.isInWishlist(userEmail, productId);
        return ResponseEntity.ok(Map.of("inWishlist", inWishlist));
    }
}
