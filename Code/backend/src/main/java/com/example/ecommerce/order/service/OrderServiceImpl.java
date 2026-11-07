package com.example.ecommerce.order.service;

import com.example.ecommerce.cart.entity.Cart;
import com.example.ecommerce.cart.entity.CartItem;
import com.example.ecommerce.cart.repository.CartItemRepository;
import com.example.ecommerce.cart.repository.CartRepository;
import com.example.ecommerce.common.dto.PageResponse;
import com.example.ecommerce.common.exception.BadRequestException;
import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.order.dto.CheckoutRequest;
import com.example.ecommerce.order.dto.OrderDetailResponse;
import com.example.ecommerce.order.dto.OrderItemResponse;
import com.example.ecommerce.order.dto.OrderSummaryResponse;
import com.example.ecommerce.order.entity.*;
import com.example.ecommerce.order.repository.OrderItemRepository;
import com.example.ecommerce.order.repository.OrderRepository;
import com.example.ecommerce.order.repository.PaymentRepository;
import com.example.ecommerce.product.entity.Product;
import com.example.ecommerce.product.entity.ProductStatus;
import com.example.ecommerce.product.repository.ProductRepository;
import com.example.ecommerce.user.entity.User;
import com.example.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderDetailResponse checkout(Long userId, CheckoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new BadRequestException("Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán."));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.");
        }

        // 1. Kiểm tra trạng thái và tồn kho của từng sản phẩm, sau đó trừ tồn kho
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStatus() != ProductStatus.ACTIVE) {
                throw new BadRequestException("Sản phẩm '" + product.getName() + "' hiện không mở bán.");
            }

            if (cartItem.getQuantity() > product.getStockQuantity()) {
                throw new BadRequestException("Sản phẩm '" + product.getName() + "' không đủ số lượng trong kho (Còn: " + product.getStockQuantity() + ").");
            }

            // Trừ số lượng tồn kho của sản phẩm
            int newStock = product.getStockQuantity() - cartItem.getQuantity();
            product.setStockQuantity(newStock);
            if (newStock == 0) {
                product.setStatus(ProductStatus.OUT_OF_STOCK);
            }
            productRepository.save(product);

            BigDecimal itemTotal = cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .productThumb(product.getThumbnail())
                    .price(cartItem.getPrice())
                    .quantity(cartItem.getQuantity())
                    .totalPrice(itemTotal)
                    .build();

            orderItems.add(orderItem);
        }

        // 2. Sinh mã đơn hàng duy nhất
        String orderCode = "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        // 3. Khởi tạo đối tượng Order
        Order order = Order.builder()
                .user(user)
                .orderCode(orderCode)
                .totalAmount(totalAmount)
                .recipientName(request.getRecipientName().trim())
                .phone(request.getPhone().trim())
                .shippingAddress(request.getShippingAddress().trim())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.UNPAID)
                .orderStatus(OrderStatus.PENDING)
                .notes(request.getNotes() != null ? request.getNotes().trim() : null)
                .items(new ArrayList<>())
                .build();

        for (OrderItem oi : orderItems) {
            order.addItem(oi);
        }

        Order savedOrder = orderRepository.save(order);

        // 4. Tạo bản ghi Payment
        Payment payment = Payment.builder()
                .order(savedOrder)
                .amount(totalAmount)
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentTransactionStatus.PENDING)
                .build();

        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        // 5. Dọn sạch giỏ hàng sau khi đặt hàng thành công
        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();

        return mapToOrderDetailResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderSummaryResponse> getUserOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<OrderSummaryResponse> content = orderPage.getContent().stream().map(order -> {
            int totalItems = order.getItems() != null
                    ? order.getItems().stream().mapToInt(OrderItem::getQuantity).sum()
                    : 0;

            return OrderSummaryResponse.builder()
                    .id(order.getId())
                    .orderCode(order.getOrderCode())
                    .recipientName(order.getRecipientName())
                    .totalAmount(order.getTotalAmount())
                    .paymentMethod(order.getPaymentMethod())
                    .paymentStatus(order.getPaymentStatus())
                    .orderStatus(order.getOrderStatus())
                    .totalItems(totalItems)
                    .createdAt(order.getCreatedAt())
                    .build();
        }).toList();

        return PageResponse.<OrderSummaryResponse>builder()
                .items(content)
                .page(orderPage.getNumber())
                .size(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderDetail(Long userId, String orderCode) {
        Order order = orderRepository.findByOrderCodeAndUserIdWithItems(orderCode, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với mã: " + orderCode));

        return mapToOrderDetailResponse(order);
    }

    @Override
    @Transactional
    public OrderDetailResponse cancelOrder(Long userId, String orderCode) {
        Order order = orderRepository.findByOrderCodeAndUserIdWithItems(orderCode, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với mã: " + orderCode));

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể hủy đơn hàng khi đơn đang ở trạng thái 'Chờ duyệt' (PENDING)!");
        }

        // Hoàn trả lại số lượng tồn kho cho các sản phẩm
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() != null) {
                    Product product = item.getProduct();
                    int restoredStock = product.getStockQuantity() + item.getQuantity();
                    product.setStockQuantity(restoredStock);
                    if (product.getStatus() == ProductStatus.OUT_OF_STOCK && restoredStock > 0) {
                        product.setStatus(ProductStatus.ACTIVE);
                    }
                    productRepository.save(product);
                }
            }
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);

        return mapToOrderDetailResponse(updatedOrder);
    }

    private OrderDetailResponse mapToOrderDetailResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems() != null
                ? order.getItems().stream().map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .productName(item.getProductName())
                        .productThumb(item.getProductThumb())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .totalPrice(item.getTotalPrice())
                        .build()).toList()
                : new ArrayList<>();

        return OrderDetailResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .recipientName(order.getRecipientName())
                .phone(order.getPhone())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .notes(order.getNotes())
                .totalAmount(order.getTotalAmount())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}

