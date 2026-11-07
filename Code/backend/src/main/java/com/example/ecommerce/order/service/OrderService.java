package com.example.ecommerce.order.service;

import com.example.ecommerce.common.dto.PageResponse;
import com.example.ecommerce.order.dto.CheckoutRequest;
import com.example.ecommerce.order.dto.OrderDetailResponse;
import com.example.ecommerce.order.dto.OrderSummaryResponse;

public interface OrderService {

    /**
     * Tạo đơn hàng mới từ các sản phẩm trong giỏ hàng (Checkout)
     */
    OrderDetailResponse checkout(Long userId, CheckoutRequest request);

    /**
     * Lấy danh sách lịch sử đơn hàng của người dùng (có phân trang)
     */
    PageResponse<OrderSummaryResponse> getUserOrders(Long userId, int page, int size);

    /**
     * Xem chi tiết một đơn hàng theo mã đơn
     */
    OrderDetailResponse getOrderDetail(Long userId, String orderCode);

    /**
     * Hủy đơn hàng (nếu đang ở trạng thái PENDING) và hoàn trả tồn kho
     */
    OrderDetailResponse cancelOrder(Long userId, String orderCode);
}

