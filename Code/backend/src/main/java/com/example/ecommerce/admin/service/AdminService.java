package com.example.ecommerce.admin.service;

import com.example.ecommerce.admin.dto.AdminProductRequest;
import com.example.ecommerce.admin.dto.AdminUpdateOrderStatusRequest;
import com.example.ecommerce.admin.dto.DashboardStatsResponse;
import com.example.ecommerce.common.dto.PageResponse;
import com.example.ecommerce.order.dto.OrderDetailResponse;
import com.example.ecommerce.order.entity.OrderStatus;
import com.example.ecommerce.product.dto.ProductDetailResponse;

public interface AdminService {

    /**
     * Thống kê tổng quan Dashboard (Doanh thu, số lượng đơn hàng, khách hàng, sản phẩm)
     */
    DashboardStatsResponse getDashboardStats();

    /**
     * Lấy danh sách toàn bộ đơn hàng trong hệ thống có phân trang và lọc trạng thái
     */
    PageResponse<OrderDetailResponse> getOrders(int page, int size, OrderStatus status);

    /**
     * Cập nhật trạng thái xử lý đơn hàng
     */
    OrderDetailResponse updateOrderStatus(Long orderId, AdminUpdateOrderStatusRequest request);

    /**
     * Tạo thiết bị công nghệ mới vào danh mục
     */
    ProductDetailResponse createProduct(AdminProductRequest request);

    /**
     * Cập nhật thông tin, giá bán và cấu hình thiết bị
     */
    ProductDetailResponse updateProduct(Long productId, AdminProductRequest request);

    /**
     * Ẩn/xóa mềm sản phẩm (chuyển sang INACTIVE)
     */
    void deleteProduct(Long productId);
}
