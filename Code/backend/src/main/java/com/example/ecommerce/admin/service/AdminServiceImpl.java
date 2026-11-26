package com.example.ecommerce.admin.service;

import com.example.ecommerce.admin.dto.AdminProductRequest;
import com.example.ecommerce.admin.dto.AdminUpdateOrderStatusRequest;
import com.example.ecommerce.admin.dto.DashboardStatsResponse;
import com.example.ecommerce.common.dto.PageResponse;
import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.order.dto.OrderDetailResponse;
import com.example.ecommerce.order.entity.Order;
import com.example.ecommerce.order.entity.OrderItem;
import com.example.ecommerce.order.entity.OrderStatus;
import com.example.ecommerce.order.entity.PaymentStatus;
import com.example.ecommerce.order.entity.PaymentTransactionStatus;
import com.example.ecommerce.order.repository.OrderRepository;
import com.example.ecommerce.order.service.OrderService;
import com.example.ecommerce.product.dto.ProductDetailResponse;
import com.example.ecommerce.product.entity.Brand;
import com.example.ecommerce.product.entity.Category;
import com.example.ecommerce.product.entity.Product;
import com.example.ecommerce.product.entity.ProductSpec;
import com.example.ecommerce.product.entity.ProductStatus;
import com.example.ecommerce.product.repository.BrandRepository;
import com.example.ecommerce.product.repository.CategoryRepository;
import com.example.ecommerce.product.repository.ProductRepository;
import com.example.ecommerce.product.service.ProductService;
import com.example.ecommerce.user.entity.Role;
import com.example.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final OrderService orderService;
    private final ProductService productService;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        BigDecimal totalRevenue = orderRepository.sumTotalRevenueExcludingStatus(OrderStatus.CANCELLED);
        long totalOrders = orderRepository.count();
        long totalCustomers = userRepository.countByRole(Role.USER);
        long totalProducts = productRepository.countByStatus(ProductStatus.ACTIVE);
        long pendingOrders = orderRepository.countByOrderStatus(OrderStatus.PENDING);
        long outOfStockProducts = productRepository.countByStatusAndOutOfStock(ProductStatus.ACTIVE)
                + productRepository.countByStatus(ProductStatus.OUT_OF_STOCK);

        return DashboardStatsResponse.builder()
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .totalOrders(totalOrders)
                .totalCustomers(totalCustomers)
                .totalProducts(totalProducts)
                .pendingOrders(pendingOrders)
                .outOfStockProducts(outOfStockProducts)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderDetailResponse> getOrders(int page, int size, OrderStatus status) {
        Pageable pageable = PageRequest.of(Math.max(0, page), size <= 0 ? 10 : size);
        Page<Order> orderPage = (status != null)
                ? orderRepository.findByOrderStatusWithItems(status, pageable)
                : orderRepository.findAllWithItems(pageable);

        List<OrderDetailResponse> items = orderPage.getContent().stream()
                .map(orderService::mapToOrderDetailResponse)
                .toList();

        return PageResponse.<OrderDetailResponse>builder()
                .items(items)
                .page(orderPage.getNumber())
                .size(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public OrderDetailResponse updateOrderStatus(Long orderId, AdminUpdateOrderStatusRequest request) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với id: " + orderId));

        OrderStatus newStatus = request.getOrderStatus();
        OrderStatus oldStatus = order.getOrderStatus();

        // Nếu chuyển sang CANCELLED và đơn trước đó chưa hủy -> hoàn trả tồn kho
        if (newStatus == OrderStatus.CANCELLED && oldStatus != OrderStatus.CANCELLED) {
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
        }

        // Nếu chuyển sang DELIVERED -> cập nhật payment sang PAID / SUCCESS
        if (newStatus == OrderStatus.DELIVERED) {
            order.setPaymentStatus(PaymentStatus.PAID);
            if (order.getPayment() != null) {
                order.getPayment().setStatus(PaymentTransactionStatus.SUCCESS);
            }
        }

        order.setOrderStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return orderService.mapToOrderDetailResponse(updatedOrder);
    }

    @Override
    @Transactional
    public ProductDetailResponse createProduct(AdminProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id: " + request.getCategoryId()));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hãng với id: " + request.getBrandId()));

        String slug = generateSlug(request.getName(), request.getSlug());

        ProductStatus status;
        if (request.getStatus() != null) {
            status = request.getStatus();
        } else if (request.getStockQuantity() <= 0) {
            status = ProductStatus.OUT_OF_STOCK;
        } else {
            status = ProductStatus.ACTIVE;
        }

        Product product = Product.builder()
                .name(request.getName().trim())
                .slug(slug)
                .category(category)
                .brand(brand)
                .originalPrice(request.getOriginalPrice())
                .salePrice(request.getSalePrice())
                .stockQuantity(request.getStockQuantity())
                .thumbnail(request.getThumbnail() != null ? request.getThumbnail().trim() : null)
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .status(status)
                .images(new ArrayList<>())
                .specs(new ArrayList<>())
                .build();

        if (request.getSpecs() != null && !request.getSpecs().isEmpty()) {
            int sortOrder = 0;
            for (AdminProductRequest.AdminProductSpecRequest specReq : request.getSpecs()) {
                ProductSpec spec = ProductSpec.builder()
                        .specGroup(specReq.getSpecGroup())
                        .specKey(specReq.getSpecKey())
                        .specValue(specReq.getSpecValue())
                        .sortOrder(sortOrder++)
                        .build();
                product.addSpec(spec);
            }
        }

        Product savedProduct = productRepository.save(product);
        return productService.mapToDetail(savedProduct);
    }

    @Override
    @Transactional
    public ProductDetailResponse updateProduct(Long productId, AdminProductRequest request) {
        Product product = productRepository.findByIdWithCategoryAndBrand(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + productId));

        if (!product.getCategory().getId().equals(request.getCategoryId())) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        if (!product.getBrand().getId().equals(request.getBrandId())) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hãng với id: " + request.getBrandId()));
            product.setBrand(brand);
        }

        product.setName(request.getName().trim());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setSalePrice(request.getSalePrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setThumbnail(request.getThumbnail() != null ? request.getThumbnail().trim() : null);
        product.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        if (request.getSlug() != null && !request.getSlug().trim().isEmpty() && !request.getSlug().trim().equals(product.getSlug())) {
            String newSlug = request.getSlug().trim();
            if (!productRepository.existsBySlug(newSlug)) {
                product.setSlug(newSlug);
            }
        }

        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        } else if (product.getStockQuantity() <= 0 && product.getStatus() == ProductStatus.ACTIVE) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        } else if (product.getStockQuantity() > 0 && product.getStatus() == ProductStatus.OUT_OF_STOCK) {
            product.setStatus(ProductStatus.ACTIVE);
        }

        if (request.getSpecs() != null) {
            product.getSpecs().clear();
            int sortOrder = 0;
            for (AdminProductRequest.AdminProductSpecRequest specReq : request.getSpecs()) {
                ProductSpec spec = ProductSpec.builder()
                        .specGroup(specReq.getSpecGroup())
                        .specKey(specReq.getSpecKey())
                        .specValue(specReq.getSpecValue())
                        .sortOrder(sortOrder++)
                        .build();
                product.addSpec(spec);
            }
        }

        Product updatedProduct = productRepository.save(product);
        return productService.mapToDetail(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + productId));

        // Soft delete: chuyển sang trạng thái INACTIVE để đảm bảo toàn vẹn dữ liệu đơn hàng cũ
        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    private String generateSlug(String name, String customSlug) {
        String slug;
        if (customSlug != null && !customSlug.trim().isEmpty()) {
            slug = customSlug.trim();
        } else {
            String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
            slug = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                    .toLowerCase(Locale.ROOT)
                    .replaceAll("đ", "d")
                    .replaceAll("[^a-z0-9\\s-]", "")
                    .replaceAll("\\s+", "-")
                    .replaceAll("-+", "-")
                    .replaceAll("^-|-$", "");
        }

        if (slug.isEmpty()) {
            slug = "product-" + System.currentTimeMillis();
        }

        String baseSlug = slug;
        int count = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count++;
        }
        return slug;
    }
}
