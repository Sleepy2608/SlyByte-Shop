package com.example.ecommerce.cart.service;

import com.example.ecommerce.cart.dto.AddToCartRequest;
import com.example.ecommerce.cart.dto.CartResponse;
import com.example.ecommerce.cart.dto.UpdateCartItemRequest;
import com.example.ecommerce.cart.entity.Cart;
import com.example.ecommerce.cart.entity.CartItem;
import com.example.ecommerce.cart.repository.CartItemRepository;
import com.example.ecommerce.cart.repository.CartRepository;
import com.example.ecommerce.common.exception.BadRequestException;
import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.product.entity.Brand;
import com.example.ecommerce.product.entity.Category;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    private User sampleUser;
    private Product sampleProduct;
    private Cart sampleCart;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("customer@slybyte.vn")
                .fullName("Test Customer")
                .build();

        sampleProduct = Product.builder()
                .id(10L)
                .name("MacBook Pro M3 Max")
                .slug("macbook-pro-m3-max")
                .salePrice(new BigDecimal("79990000"))
                .originalPrice(new BigDecimal("84990000"))
                .stockQuantity(10)
                .status(ProductStatus.ACTIVE)
                .brand(Brand.builder().name("Apple").build())
                .category(Category.builder().name("Laptop").build())
                .build();

        sampleCart = Cart.builder()
                .id(100L)
                .user(sampleUser)
                .items(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("getCart - Nên trả về giỏ hàng nếu đã tồn tại")
    void getCart_ShouldReturnExistingCart() {
        // Arrange
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));

        // Act
        CartResponse response = cartService.getCart(1L);

        // Assert
        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(1L, response.getUserId());
        assertEquals(0, response.getTotalItems());
        assertEquals(BigDecimal.ZERO, response.getTotalPrice());
    }

    @Test
    @DisplayName("getCart - Tự động tạo giỏ hàng mới nếu chưa có")
    void getCart_ShouldCreateNewCart_WhenNotFound() {
        // Arrange
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> {
            Cart c = invocation.getArgument(0);
            c.setId(101L);
            return c;
        });

        // Act
        CartResponse response = cartService.getCart(1L);

        // Assert
        assertNotNull(response);
        assertEquals(101L, response.getId());
        verify(cartRepository, times(1)).save(any(Cart.class));
    }

    @Test
    @DisplayName("addToCart - Thêm mới sản phẩm vào giỏ khi chưa có trong giỏ")
    void addToCart_ShouldAddNewItem_WhenNotInCart() {
        // Arrange
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(10L)
                .quantity(2)
                .build();

        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));

        // Act
        CartResponse response = cartService.addToCart(1L, request);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getItems().size());
        assertEquals(2, response.getTotalItems());
        assertEquals(new BigDecimal("159980000"), response.getTotalPrice());
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    @DisplayName("addToCart - Cộng dồn số lượng nếu sản phẩm đã có trong giỏ")
    void addToCart_ShouldIncreaseQuantity_WhenAlreadyInCart() {
        // Arrange
        CartItem existingItem = CartItem.builder()
                .id(200L)
                .cart(sampleCart)
                .product(sampleProduct)
                .quantity(3)
                .price(sampleProduct.getSalePrice())
                .build();
        sampleCart.getItems().add(existingItem);

        AddToCartRequest request = AddToCartRequest.builder()
                .productId(10L)
                .quantity(2)
                .build();

        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));

        // Act
        CartResponse response = cartService.addToCart(1L, request);

        // Assert
        assertEquals(1, response.getItems().size());
        assertEquals(5, response.getTotalItems());
        assertEquals(5, existingItem.getQuantity());
        verify(cartItemRepository, times(1)).save(existingItem);
    }

    @Test
    @DisplayName("addToCart - Ném BadRequestException khi số lượng vượt tồn kho")
    void addToCart_ShouldThrowException_WhenQuantityExceedsStock() {
        // Arrange
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(10L)
                .quantity(15) // Tồn kho chỉ có 10
                .build();

        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                cartService.addToCart(1L, request)
        );
        assertTrue(exception.getMessage().contains("vượt quá số lượng tồn kho"));
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    @DisplayName("updateCartItem - Cập nhật số lượng hợp lệ")
    void updateCartItem_ShouldUpdateQuantity() {
        // Arrange
        CartItem item = CartItem.builder()
                .id(200L)
                .cart(sampleCart)
                .product(sampleProduct)
                .quantity(1)
                .price(sampleProduct.getSalePrice())
                .build();
        sampleCart.getItems().add(item);

        UpdateCartItemRequest request = UpdateCartItemRequest.builder()
                .quantity(4)
                .build();

        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));

        // Act
        CartResponse response = cartService.updateCartItem(1L, 200L, request);

        // Assert
        assertEquals(4, response.getTotalItems());
        assertEquals(4, item.getQuantity());
        verify(cartItemRepository, times(1)).save(item);
    }

    @Test
    @DisplayName("updateCartItem - Tự động xóa item khi số lượng <= 0")
    void updateCartItem_ShouldRemoveItem_WhenQuantityIsZeroOrNegative() {
        // Arrange
        CartItem item = CartItem.builder()
                .id(200L)
                .cart(sampleCart)
                .product(sampleProduct)
                .quantity(3)
                .price(sampleProduct.getSalePrice())
                .build();
        sampleCart.getItems().add(item);

        UpdateCartItemRequest request = UpdateCartItemRequest.builder()
                .quantity(0)
                .build();

        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));

        // Act
        CartResponse response = cartService.updateCartItem(1L, 200L, request);

        // Assert
        assertEquals(0, response.getTotalItems());
        assertEquals(0, response.getItems().size());
        verify(cartItemRepository, times(1)).delete(item);
    }

    @Test
    @DisplayName("removeCartItem - Xóa thành công item khỏi giỏ")
    void removeCartItem_ShouldRemoveItemSuccessfully() {
        // Arrange
        CartItem item = CartItem.builder()
                .id(200L)
                .cart(sampleCart)
                .product(sampleProduct)
                .quantity(2)
                .price(sampleProduct.getSalePrice())
                .build();
        sampleCart.getItems().add(item);

        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));

        // Act
        CartResponse response = cartService.removeCartItem(1L, 200L);

        // Assert
        assertEquals(0, response.getTotalItems());
        verify(cartItemRepository, times(1)).delete(item);
    }

    @Test
    @DisplayName("updateCartItem - Ném ResourceNotFoundException khi cartItemId không tồn tại")
    void updateCartItem_ShouldThrowNotFound_WhenItemNotFound() {
        // Arrange
        UpdateCartItemRequest request = UpdateCartItemRequest.builder().quantity(2).build();
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(sampleCart));

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () ->
                cartService.updateCartItem(1L, 999L, request)
        );
    }
}

