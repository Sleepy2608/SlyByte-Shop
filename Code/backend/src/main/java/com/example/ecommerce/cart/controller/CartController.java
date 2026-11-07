package com.example.ecommerce.cart.controller;

import com.example.ecommerce.cart.dto.AddToCartRequest;
import com.example.ecommerce.cart.dto.CartResponse;
import com.example.ecommerce.cart.dto.UpdateCartItemRequest;
import com.example.ecommerce.cart.service.CartService;
import com.example.ecommerce.common.exception.BadRequestException;
import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.user.entity.User;
import com.example.ecommerce.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart") // Với context-path = /api, URL thực tế là /api/cart
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request
    ) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartResponse> updateCartItem(
            Authentication authentication,
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(cartService.updateCartItem(userId, id, request));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<CartResponse> removeCartItem(
            Authentication authentication,
            @PathVariable("id") Long id
    ) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(cartService.removeCartItem(userId, id));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    private Long getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Yêu cầu đăng nhập để thao tác với giỏ hàng!");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin tài khoản: " + email));
        return user.getId();
    }
}

