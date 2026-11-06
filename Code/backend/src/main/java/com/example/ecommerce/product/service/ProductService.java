package com.example.ecommerce.product.service;

import com.example.ecommerce.common.dto.PageResponse;
import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.product.dto.*;
import com.example.ecommerce.product.entity.Product;
import com.example.ecommerce.product.entity.ProductImage;
import com.example.ecommerce.product.entity.ProductSpec;
import com.example.ecommerce.product.entity.ProductStatus;
import com.example.ecommerce.product.repository.ProductImageRepository;
import com.example.ecommerce.product.repository.ProductRepository;
import com.example.ecommerce.product.repository.ProductSpecRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductSpecRepository productSpecRepository;
    private final CategoryService categoryService;
    private final BrandService brandService;

    @Transactional(readOnly = true)
    public PageResponse<ProductSummaryResponse> getProducts(
            Long categoryId,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String keyword,
            int page,
            int size,
            String sort
    ) {
        Sort sortObj;
        if ("price_asc".equalsIgnoreCase(sort)) {
            sortObj = Sort.by(Sort.Direction.ASC, "salePrice");
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            sortObj = Sort.by(Sort.Direction.DESC, "salePrice");
        } else {
            sortObj = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        int pageIndex = Math.max(0, page);
        int pageSize = size <= 0 ? 12 : size;
        Pageable pageable = PageRequest.of(pageIndex, pageSize, sortObj);

        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        Page<Product> productPage = productRepository.filterProducts(
                ProductStatus.ACTIVE,
                categoryId,
                brandId,
                minPrice,
                maxPrice,
                searchKeyword,
                pageable
        );

        List<ProductSummaryResponse> items = productPage.getContent().stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());

        return PageResponse.<ProductSummaryResponse>builder()
                .items(items)
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProductById(Long id) {
        Product product = productRepository.findByIdWithCategoryAndBrand(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + id));
        return mapToDetail(product);
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlugWithCategoryAndBrand(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với slug: " + slug));
        return mapToDetail(product);
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getFeaturedProducts() {
        return productRepository.findTop8ByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE).stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getRelatedProducts(Long categoryId, Long productId) {
        return productRepository.findTop4ByCategoryIdAndIdNotAndStatus(categoryId, productId, ProductStatus.ACTIVE).stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    public ProductSummaryResponse mapToSummary(Product p) {
        if (p == null) return null;
        return ProductSummaryResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .originalPrice(p.getOriginalPrice())
                .salePrice(p.getSalePrice())
                .discountPercentage(calculateDiscount(p.getOriginalPrice(), p.getSalePrice()))
                .stockQuantity(p.getStockQuantity())
                .thumbnail(p.getThumbnail())
                .status(p.getStatus())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .brandId(p.getBrand() != null ? p.getBrand().getId() : null)
                .brandName(p.getBrand() != null ? p.getBrand().getName() : null)
                .build();
    }

    public ProductDetailResponse mapToDetail(Product p) {
        if (p == null) return null;

        List<ProductImageResponse> imageResponses = productImageRepository.findByProductIdOrderBySortOrderAsc(p.getId()).stream()
                .map(img -> ProductImageResponse.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .isPrimary(img.getIsPrimary())
                        .sortOrder(img.getSortOrder())
                        .build())
                .collect(Collectors.toList());

        List<ProductSpecResponse> specResponses = productSpecRepository.findByProductIdOrderBySortOrderAsc(p.getId()).stream()
                .map(spec -> ProductSpecResponse.builder()
                        .id(spec.getId())
                        .specGroup(spec.getSpecGroup())
                        .specKey(spec.getSpecKey())
                        .specValue(spec.getSpecValue())
                        .sortOrder(spec.getSortOrder())
                        .build())
                .collect(Collectors.toList());

        return ProductDetailResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .description(p.getDescription())
                .originalPrice(p.getOriginalPrice())
                .salePrice(p.getSalePrice())
                .discountPercentage(calculateDiscount(p.getOriginalPrice(), p.getSalePrice()))
                .stockQuantity(p.getStockQuantity())
                .thumbnail(p.getThumbnail())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .category(categoryService.mapToResponse(p.getCategory()))
                .brand(brandService.mapToResponse(p.getBrand()))
                .images(imageResponses)
                .specs(specResponses)
                .build();
    }

    private Integer calculateDiscount(BigDecimal originalPrice, BigDecimal salePrice) {
        if (originalPrice == null || salePrice == null || originalPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        if (originalPrice.compareTo(salePrice) > 0) {
            return originalPrice.subtract(salePrice)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(originalPrice, 0, RoundingMode.HALF_UP)
                    .intValue();
        }
        return 0;
    }
}

