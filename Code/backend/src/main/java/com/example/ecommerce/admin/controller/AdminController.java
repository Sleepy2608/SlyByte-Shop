package com.example.ecommerce.admin.controller;

import com.example.ecommerce.admin.dto.AdminProductRequest;
import com.example.ecommerce.admin.dto.AdminUpdateOrderStatusRequest;
import com.example.ecommerce.admin.dto.DashboardStatsResponse;
import com.example.ecommerce.admin.service.AdminService;
import com.example.ecommerce.common.dto.PageResponse;
import com.example.ecommerce.order.dto.OrderDetailResponse;
import com.example.ecommerce.order.entity.OrderStatus;
import com.example.ecommerce.product.dto.ProductDetailResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    /**
     * Thống kê tổng quan Dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    /**
     * Quản lý đơn hàng hệ thống (phân trang và lọc trạng thái)
     */
    @GetMapping("/orders")
    public ResponseEntity<PageResponse<OrderDetailResponse>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) OrderStatus status
    ) {
        return ResponseEntity.ok(adminService.getOrders(page, size, status));
    }

    /**
     * Cập nhật trạng thái xử lý đơn hàng
     */
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDetailResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(adminService.updateOrderStatus(id, request));
    }

    /**
     * Tạo mới thiết bị công nghệ
     */
    @PostMapping("/products")
    public ResponseEntity<ProductDetailResponse> createProduct(
            @Valid @RequestBody AdminProductRequest request
    ) {
        ProductDetailResponse response = adminService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Cập nhật thông tin thiết bị công nghệ
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDetailResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody AdminProductRequest request
    ) {
        return ResponseEntity.ok(adminService.updateProduct(id, request));
    }

    /**
     * Ẩn/xóa mềm thiết bị công nghệ
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
