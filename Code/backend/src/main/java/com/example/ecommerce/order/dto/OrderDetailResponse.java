package com.example.ecommerce.order.dto;

import com.example.ecommerce.order.entity.OrderStatus;
import com.example.ecommerce.order.entity.PaymentMethod;
import com.example.ecommerce.order.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailResponse {

    private Long id;
    private String orderCode;
    private Long userId;
    private String recipientName;
    private String phone;
    private String shippingAddress;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private String notes;
    private BigDecimal totalAmount;

    @Builder.Default
    private List<OrderItemResponse> items = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

