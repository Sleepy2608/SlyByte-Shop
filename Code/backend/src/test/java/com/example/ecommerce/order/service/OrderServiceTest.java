package com.example.ecommerce.order.service;

import com.example.ecommerce.cart.entity.Cart;
import com.example.ecommerce.cart.entity.CartItem;
import com.example.ecommerce.cart.repository.CartItemRepository;
import com.example.ecommerce.cart.repository.CartRepository;
import com.example.ecommerce.common.exception.BadRequestException;
import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.order.dto.CheckoutRequest;
import com.example.ecommerce.order.dto.OrderDetailResponse;
import com.example.ecommerce.order.entity.Order;
import com.example.ecommerce.order.entity.OrderItem;
import com.example.ecommerce.order.entity.OrderStatus;
import com.example.ecommerce.order.entity.Payment;
import com.example.ecommerce.order.entity.PaymentMethod;
import com.example.ecommerce.order.entity.PaymentStatus;
import com.example.ecommerce.order.repository.OrderRepository;
import com.example.ecommerce.order.repository.PaymentRepository;
import com.example.ecommerce.product.entity.Product;
import com.example.ecommerce.product.entity.ProductStatus;
import com.example.ecommerce.product.repository.ProductRepository;
import com.example.ecommerce.user.entity.User;
import com.example.ecommerce.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User sampleUser;
    private Product sampleProduct;
    private Cart sampleCart;
    private CartItem sampleCartItem;
    private CheckoutRequest sampleCheckoutRequest;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("buyer@slybyte.vn")
                .fullName("Nguyen Van A")
                .phone("0987654321")
                .build();

        sampleProduct = Product.builder()
                .id(50L)
                .name("Laptop Dell XPS 15")
                .stockQuantity(5)
                .salePrice(new BigDecimal("45000000"))
                .status(ProductStatus.ACTIVE)
                .thumbnail("https://example.com/dell-xps.jpg")
                .build();

        sampleCartItem = CartItem.builder()
                .id(201L)
                .product(sampleProduct)
                .quantity(2)
                .price(new BigDecimal("45000000"))
                .build();

        List<CartItem> items = new ArrayList<>();
        items.add(sampleCartItem);

        sampleCart = Cart.builder()
                .id(101L)
                .user(sampleUser)
                .items(items)
                .build();

        sampleCheckoutRequest = CheckoutRequest.builder()
                .recipientName("Nguyen Van A")
                .phone("0987654321")
                .shippingAddress("123 Duong Cong Nghe, TP.HCM")
                .paymentMethod(PaymentMethod.COD)
                .notes("Giao gio hanh chinh")
                .build();
    }

    @Test
    @DisplayName("checkout - Đặt hàng thành công: trừ tồn kho, tạo order, dọn sạch cart")
    void checkout_ShouldSucceed_AndDeductStock() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order o = i.getArgument(0);
            o.setId(999L);
            return o;
        });

        // Act
        OrderDetailResponse response = orderService.checkout(1L, sampleCheckoutRequest);

        // Assert
        assertNotNull(response);
        assertEquals(999L, response.getId());
        assertEquals("Nguyen Van A", response.getRecipientName());
        assertEquals(new BigDecimal("90000000"), response.getTotalAmount());
        assertEquals(PaymentMethod.COD, response.getPaymentMethod());
        assertEquals(OrderStatus.PENDING, response.getOrderStatus());
        assertEquals(1, response.getItems().size());

        // Kiểm tra tồn kho của sản phẩm bị trừ từ 5 xuống 3
        assertEquals(3, sampleProduct.getStockQuantity());
        verify(productRepository, times(1)).save(sampleProduct);

        // Kiểm tra payment được tạo và cart được dọn sạch
        verify(paymentRepository, times(1)).save(any(Payment.class));
        verify(cartItemRepository, times(1)).deleteByCartId(101L);
    }

    @Test
    @DisplayName("checkout - Ném BadRequestException khi giỏ hàng rỗng")
    void checkout_ShouldThrowBadRequest_WhenCartIsEmpty() {
        // Arrange
        sampleCart.getItems().clear();
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                orderService.checkout(1L, sampleCheckoutRequest)
        );
        assertTrue(exception.getMessage().contains("Giỏ hàng của bạn đang trống"));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    @DisplayName("checkout - Ném BadRequestException khi số lượng đặt mua vượt tồn kho")
    void checkout_ShouldThrowBadRequest_WhenStockInsufficient() {
        // Arrange
        sampleProduct.setStockQuantity(1); // Tồn kho 1 nhưng mua 2
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                orderService.checkout(1L, sampleCheckoutRequest)
        );
        assertTrue(exception.getMessage().contains("không đủ số lượng"));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    @DisplayName("cancelOrder - Hủy đơn thành công khi trạng thái PENDING và hoàn trả tồn kho")
    void cancelOrder_ShouldRestoreStock_WhenPending() {
        // Arrange
        OrderItem orderItem = OrderItem.builder()
                .product(sampleProduct)
                .quantity(2)
                .price(new BigDecimal("45000000"))
                .totalPrice(new BigDecimal("90000000"))
                .build();

        Order pendingOrder = Order.builder()
                .id(999L)
                .orderCode("ORD-123456")
                .user(sampleUser)
                .orderStatus(OrderStatus.PENDING)
                .items(new ArrayList<>(List.of(orderItem)))
                .totalAmount(new BigDecimal("90000000"))
                .build();

        sampleProduct.setStockQuantity(3); // Giả sử sau khi mua còn 3

        when(orderRepository.findByOrderCodeAndUserIdWithItems("ORD-123456", 1L))
                .thenReturn(Optional.of(pendingOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        OrderDetailResponse response = orderService.cancelOrder(1L, "ORD-123456");

        // Assert
        assertEquals(OrderStatus.CANCELLED, response.getOrderStatus());
        // Tồn kho được hoàn trả từ 3 lên 5
        assertEquals(5, sampleProduct.getStockQuantity());
        verify(productRepository, times(1)).save(sampleProduct);
    }

    @Test
    @DisplayName("cancelOrder - Ném BadRequestException khi đơn hàng không ở trạng thái PENDING")
    void cancelOrder_ShouldThrowBadRequest_WhenNotPending() {
        // Arrange
        Order shippedOrder = Order.builder()
                .id(999L)
                .orderCode("ORD-SHIPPED")
                .user(sampleUser)
                .orderStatus(OrderStatus.SHIPPED)
                .build();

        when(orderRepository.findByOrderCodeAndUserIdWithItems("ORD-SHIPPED", 1L))
                .thenReturn(Optional.of(shippedOrder));

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                orderService.cancelOrder(1L, "ORD-SHIPPED")
        );
        assertTrue(exception.getMessage().contains("Chỉ có thể hủy đơn hàng khi đơn đang ở trạng thái 'Chờ duyệt'"));
    }

    @Test
    @DisplayName("getOrderDetail - Ném ResourceNotFoundException khi mã đơn không tồn tại")
    void getOrderDetail_ShouldThrowNotFound_WhenOrderNotFound() {
        // Arrange
        when(orderRepository.findByOrderCodeAndUserIdWithItems("ORD-NOTFOUND", 1L))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () ->
                orderService.getOrderDetail(1L, "ORD-NOTFOUND")
        );
    }
}

