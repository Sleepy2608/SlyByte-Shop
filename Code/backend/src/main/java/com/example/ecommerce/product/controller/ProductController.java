package com.example.ecommerce.product.controller;

import com.example.ecommerce.common.dto.PageResponse;
import com.example.ecommerce.product.dto.ProductDetailResponse;
import com.example.ecommerce.product.dto.ProductSummaryResponse;
import com.example.ecommerce.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Lấy danh sách sản phẩm có phân trang, tìm kiếm và lọc đa tiêu chí
     * GET /api/products?categoryId=...&brandId=...&minPrice=...&maxPrice=...&keyword=...&page=0&size=12&sort=newest
     */
    @GetMapping
    public ResponseEntity<PageResponse<ProductSummaryResponse>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sort
    ) {
        PageResponse<ProductSummaryResponse> response = productService.getProducts(
                categoryId, brandId, minPrice, maxPrice, keyword, page, size, sort
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách sản phẩm nổi bật / mới nhất cho Trang chủ
     * GET /api/products/featured
     */
    @GetMapping("/featured")
    public ResponseEntity<List<ProductSummaryResponse>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    /**
     * Xem chi tiết sản phẩm theo ID (kèm gallery ảnh & thông số specs)
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    /**
     * Xem chi tiết sản phẩm theo Slug (tối ưu URL SEO)
     * GET /api/products/slug/{slug}
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDetailResponse> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    /**
     * Lấy danh sách sản phẩm liên quan cùng danh mục
     * GET /api/products/{id}/related?categoryId=...
     */
    @GetMapping("/{id}/related")
    public ResponseEntity<List<ProductSummaryResponse>> getRelatedProducts(
            @PathVariable Long id,
            @RequestParam Long categoryId
    ) {
        return ResponseEntity.ok(productService.getRelatedProducts(categoryId, id));
    }
}

