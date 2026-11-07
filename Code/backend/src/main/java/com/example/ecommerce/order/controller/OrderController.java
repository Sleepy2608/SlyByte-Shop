package com.example.ecommerce.order.controller;

import com.example.ecommerce.common.dto.PageResponse;
import com.example.ecommerce.common.exception.BadRequestException;
import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.order.dto.CheckoutRequest;
import com.example.ecommerce.order.dto.OrderDetailResponse;
import com.example.ecommerce.order.dto.OrderSummaryResponse;
import com.example.ecommerce.order.service.OrderService;
import com.example.ecommerce.user.entity.User;
import com.example.ecommerce.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders") // URL thực tế là /api/orders vì context-path = /api
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    /**
     * Tiến hành đặt hàng từ giỏ hàng hiện tại (Checkout)
     */
    @PostMapping("/checkout")
    public ResponseEntity<OrderDetailResponse> checkout(
            Authentication authentication,
            @Valid @RequestBody CheckoutRequest request
    ) {
        Long userId = getCurrentUserId(authentication);
        OrderDetailResponse response = orderService.checkout(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Lấy lịch sử đơn hàng của người dùng đang đăng nhập (có phân trang)
     */
    @GetMapping
    public ResponseEntity<PageResponse<OrderSummaryResponse>> getUserOrders(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long userId = getCurrentUserId(authentication);
        PageResponse<OrderSummaryResponse> response = orderService.getUserOrders(userId, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Xem thông tin chi tiết một đơn hàng theo mã đơn
     */
    @GetMapping("/{orderCode}")
    public ResponseEntity<OrderDetailResponse> getOrderDetail(
            Authentication authentication,
            @PathVariable("orderCode") String orderCode
    ) {
        Long userId = getCurrentUserId(authentication);
        OrderDetailResponse response = orderService.getOrderDetail(userId, orderCode);
        return ResponseEntity.ok(response);
    }

    /**
     * Hủy đơn hàng khi đang ở trạng thái Chờ duyệt (PENDING)
     */
    @PostMapping("/{orderCode}/cancel")
    public ResponseEntity<OrderDetailResponse> cancelOrder(
            Authentication authentication,
            @PathVariable("orderCode") String orderCode
    ) {
        Long userId = getCurrentUserId(authentication);
        OrderDetailResponse response = orderService.cancelOrder(userId, orderCode);
        return ResponseEntity.ok(response);
    }

    private Long getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Yêu cầu đăng nhập để truy cập đơn hàng!");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản người dùng: " + email));
        return user.getId();
    }
}

