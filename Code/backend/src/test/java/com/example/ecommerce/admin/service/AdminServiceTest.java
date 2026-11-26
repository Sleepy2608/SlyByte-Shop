package com.example.ecommerce.admin.service;

import com.example.ecommerce.admin.dto.AdminProductRequest;
import com.example.ecommerce.admin.dto.AdminUpdateOrderStatusRequest;
import com.example.ecommerce.admin.dto.DashboardStatsResponse;
import com.example.ecommerce.common.dto.PageResponse;
import com.example.ecommerce.order.dto.OrderDetailResponse;
import com.example.ecommerce.order.entity.Order;
import com.example.ecommerce.order.entity.OrderItem;
import com.example.ecommerce.order.entity.OrderStatus;
import com.example.ecommerce.order.entity.Payment;
import com.example.ecommerce.order.entity.PaymentStatus;
import com.example.ecommerce.order.entity.PaymentTransactionStatus;
import com.example.ecommerce.order.repository.OrderRepository;
import com.example.ecommerce.order.service.OrderService;
import com.example.ecommerce.product.dto.ProductDetailResponse;
import com.example.ecommerce.product.entity.Brand;
import com.example.ecommerce.product.entity.Category;
import com.example.ecommerce.product.entity.Product;
import com.example.ecommerce.product.entity.ProductStatus;
import com.example.ecommerce.product.repository.BrandRepository;
import com.example.ecommerce.product.repository.CategoryRepository;
import com.example.ecommerce.product.repository.ProductRepository;
import com.example.ecommerce.product.service.ProductService;
import com.example.ecommerce.user.entity.Role;
import com.example.ecommerce.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private OrderService orderService;

    @Mock
    private ProductService productService;

    @InjectMocks
    private AdminServiceImpl adminService;

    private Category sampleCategory;
    private Brand sampleBrand;
    private Product sampleProduct;
    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        sampleCategory = Category.builder().id(1L).name("Laptop").slug("laptop").build();
        sampleBrand = Brand.builder().id(1L).name("Apple").slug("apple").build();

        sampleProduct = Product.builder()
                .id(1L)
                .name("MacBook Pro 16")
                .slug("macbook-pro-16")
                .category(sampleCategory)
                .brand(sampleBrand)
                .originalPrice(new BigDecimal("50000000"))
                .salePrice(new BigDecimal("48000000"))
                .stockQuantity(10)
                .status(ProductStatus.ACTIVE)
                .specs(new ArrayList<>())
                .images(new ArrayList<>())
                .build();

        OrderItem orderItem = OrderItem.builder()
                .id(1L)
                .product(sampleProduct)
                .productName(sampleProduct.getName())
                .price(sampleProduct.getSalePrice())
                .quantity(2)
                .totalPrice(new BigDecimal("96000000"))
                .build();

        Payment payment = Payment.builder()
                .id(1L)
                .amount(new BigDecimal("96000000"))
                .status(PaymentTransactionStatus.PENDING)
                .build();

        sampleOrder = Order.builder()
                .id(1L)
                .orderCode("ORD-12345")
                .orderStatus(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.UNPAID)
                .totalAmount(new BigDecimal("96000000"))
                .payment(payment)
                .items(new ArrayList<>(List.of(orderItem)))
                .build();
    }

    @Test
    @DisplayName("Lấy thống kê tổng quan Dashboard thành công")
    void testGetDashboardStats_Success() {
        when(orderRepository.sumTotalRevenueExcludingStatus(OrderStatus.CANCELLED)).thenReturn(new BigDecimal("284950000"));
        when(orderRepository.count()).thenReturn(18L);
        when(userRepository.countByRole(Role.USER)).thenReturn(24L);
        when(productRepository.countByStatus(ProductStatus.ACTIVE)).thenReturn(8L);
        when(orderRepository.countByOrderStatus(OrderStatus.PENDING)).thenReturn(4L);
        when(productRepository.countByStatusAndOutOfStock(ProductStatus.ACTIVE)).thenReturn(1L);
        when(productRepository.countByStatus(ProductStatus.OUT_OF_STOCK)).thenReturn(0L);

        DashboardStatsResponse stats = adminService.getDashboardStats();

        assertNotNull(stats);
        assertEquals(new BigDecimal("284950000"), stats.getTotalRevenue());
        assertEquals(18L, stats.getTotalOrders());
        assertEquals(24L, stats.getTotalCustomers());
        assertEquals(8L, stats.getTotalProducts());
        assertEquals(4L, stats.getPendingOrders());
        assertEquals(1L, stats.getOutOfStockProducts());
    }

    @Test
    @DisplayName("Lấy danh sách đơn hàng không lọc trạng thái thành công")
    void testGetOrders_WithoutStatus() {
        Page<Order> page = new PageImpl<>(List.of(sampleOrder));
        when(orderRepository.findAllWithItems(any(Pageable.class))).thenReturn(page);
        when(orderService.mapToOrderDetailResponse(sampleOrder)).thenReturn(
                OrderDetailResponse.builder().id(1L).orderCode("ORD-12345").build()
        );

        PageResponse<OrderDetailResponse> response = adminService.getOrders(0, 10, null);

        assertNotNull(response);
        assertEquals(1, response.getItems().size());
        assertEquals("ORD-12345", response.getItems().get(0).getOrderCode());
        verify(orderRepository).findAllWithItems(any(Pageable.class));
    }

    @Test
    @DisplayName("Lấy danh sách đơn hàng có lọc trạng thái thành công")
    void testGetOrders_WithStatus() {
        Page<Order> page = new PageImpl<>(List.of(sampleOrder));
        when(orderRepository.findByOrderStatusWithItems(eq(OrderStatus.PENDING), any(Pageable.class))).thenReturn(page);
        when(orderService.mapToOrderDetailResponse(sampleOrder)).thenReturn(
                OrderDetailResponse.builder().id(1L).orderCode("ORD-12345").build()
        );

        PageResponse<OrderDetailResponse> response = adminService.getOrders(0, 10, OrderStatus.PENDING);

        assertNotNull(response);
        assertEquals(1, response.getItems().size());
        verify(orderRepository).findByOrderStatusWithItems(eq(OrderStatus.PENDING), any(Pageable.class));
    }

    @Test
    @DisplayName("Cập nhật trạng thái đơn hàng sang CANCELLED và hoàn trả tồn kho sản phẩm")
    void testUpdateOrderStatus_Cancelled_RestoresStock() {
        when(orderRepository.findByIdWithItems(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderService.mapToOrderDetailResponse(any(Order.class))).thenReturn(
                OrderDetailResponse.builder().id(1L).orderStatus(OrderStatus.CANCELLED).build()
        );

        AdminUpdateOrderStatusRequest request = new AdminUpdateOrderStatusRequest(OrderStatus.CANCELLED);
        OrderDetailResponse response = adminService.updateOrderStatus(1L, request);

        assertNotNull(response);
        assertEquals(OrderStatus.CANCELLED, response.getOrderStatus());
        // Tồn kho ban đầu là 10, đơn hàng có số lượng 2 -> hoàn trả thành 12
        assertEquals(12, sampleProduct.getStockQuantity());
        verify(productRepository).save(sampleProduct);
        verify(orderRepository).save(sampleOrder);
    }

    @Test
    @DisplayName("Cập nhật trạng thái đơn hàng sang DELIVERED và cập nhật thanh toán thành PAID")
    void testUpdateOrderStatus_Delivered_SetsPaid() {
        when(orderRepository.findByIdWithItems(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderService.mapToOrderDetailResponse(any(Order.class))).thenReturn(
                OrderDetailResponse.builder().id(1L).orderStatus(OrderStatus.DELIVERED).paymentStatus(PaymentStatus.PAID).build()
        );

        AdminUpdateOrderStatusRequest request = new AdminUpdateOrderStatusRequest(OrderStatus.DELIVERED);
        OrderDetailResponse response = adminService.updateOrderStatus(1L, request);

        assertNotNull(response);
        assertEquals(OrderStatus.DELIVERED, response.getOrderStatus());
        assertEquals(PaymentStatus.PAID, sampleOrder.getPaymentStatus());
        assertEquals(PaymentTransactionStatus.SUCCESS, sampleOrder.getPayment().getStatus());
        verify(orderRepository).save(sampleOrder);
    }

    @Test
    @DisplayName("Tạo sản phẩm mới thành công")
    void testCreateProduct_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(brandRepository.findById(1L)).thenReturn(Optional.of(sampleBrand));
        when(productRepository.existsBySlug(anyString())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setId(2L);
            return p;
        });
        when(productService.mapToDetail(any(Product.class))).thenReturn(
                ProductDetailResponse.builder().id(2L).name("Dell XPS 15").slug("dell-xps-15").build()
        );

        AdminProductRequest request = AdminProductRequest.builder()
                .name("Dell XPS 15")
                .categoryId(1L)
                .brandId(1L)
                .originalPrice(new BigDecimal("45000000"))
                .salePrice(new BigDecimal("42000000"))
                .stockQuantity(5)
                .thumbnail("https://example.com/dell.jpg")
                .description("Ultrabook cao cấp")
                .build();

        ProductDetailResponse response = adminService.createProduct(request);

        assertNotNull(response);
        assertEquals(2L, response.getId());
        assertEquals("Dell XPS 15", response.getName());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Cập nhật sản phẩm thành công")
    void testUpdateProduct_Success() {
        when(productRepository.findByIdWithCategoryAndBrand(1L)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(productService.mapToDetail(any(Product.class))).thenReturn(
                ProductDetailResponse.builder().id(1L).name("MacBook Pro 16 M3 Max").build()
        );

        AdminProductRequest request = AdminProductRequest.builder()
                .name("MacBook Pro 16 M3 Max")
                .categoryId(1L)
                .brandId(1L)
                .originalPrice(new BigDecimal("60000000"))
                .salePrice(new BigDecimal("57000000"))
                .stockQuantity(8)
                .build();

        ProductDetailResponse response = adminService.updateProduct(1L, request);

        assertNotNull(response);
        assertEquals("MacBook Pro 16 M3 Max", response.getName());
        assertEquals(new BigDecimal("60000000"), sampleProduct.getOriginalPrice());
        assertEquals(8, sampleProduct.getStockQuantity());
        verify(productRepository).save(sampleProduct);
    }

    @Test
    @DisplayName("Xóa mềm sản phẩm (chuyển sang INACTIVE) thành công")
    void testDeleteProduct_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        adminService.deleteProduct(1L);

        assertEquals(ProductStatus.INACTIVE, sampleProduct.getStatus());
        verify(productRepository).save(sampleProduct);
    }
}
