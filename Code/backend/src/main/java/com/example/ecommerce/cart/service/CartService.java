package com.example.ecommerce.cart.service;

import com.example.ecommerce.cart.dto.AddToCartRequest;
import com.example.ecommerce.cart.dto.CartResponse;
import com.example.ecommerce.cart.dto.UpdateCartItemRequest;

public interface CartService {

    /**
     * Lấy thông tin giỏ hàng của người dùng (tự động tạo mới nếu chưa tồn tại)
     */
    CartResponse getCart(Long userId);

    /**
     * Thêm sản phẩm vào giỏ hàng hoặc cộng dồn nếu đã có
     */
    CartResponse addToCart(Long userId, AddToCartRequest request);

    /**
     * Cập nhật số lượng sản phẩm trong giỏ (nếu quantity <= 0 thì tự xóa)
     */
    CartResponse updateCartItem(Long userId, Long cartItemId, UpdateCartItemRequest request);

    /**
     * Xóa một sản phẩm cụ thể khỏi giỏ hàng
     */
    CartResponse removeCartItem(Long userId, Long cartItemId);

    /**
     * Xóa toàn bộ sản phẩm trong giỏ hàng
     */
    void clearCart(Long userId);
}

