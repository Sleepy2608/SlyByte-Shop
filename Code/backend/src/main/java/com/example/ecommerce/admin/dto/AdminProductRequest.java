package com.example.ecommerce.admin.dto;

import com.example.ecommerce.product.entity.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductRequest {

    @NotBlank(message = "Tên thiết bị công nghệ không được để trống")
    private String name;

    private String slug;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    @NotNull(message = "Hãng sản xuất không được để trống")
    private Long brandId;

    @NotNull(message = "Giá niêm yết không được để trống")
    @PositiveOrZero(message = "Giá niêm yết phải lớn hơn hoặc bằng 0")
    private BigDecimal originalPrice;

    @NotNull(message = "Giá bán không được để trống")
    @PositiveOrZero(message = "Giá bán phải lớn hơn hoặc bằng 0")
    private BigDecimal salePrice;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @PositiveOrZero(message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    private Integer stockQuantity;

    private String thumbnail;
    private String description;
    private ProductStatus status;

    private List<AdminProductSpecRequest> specs;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminProductSpecRequest {
        private String specGroup;
        private String specKey;
        private String specValue;
    }
}
