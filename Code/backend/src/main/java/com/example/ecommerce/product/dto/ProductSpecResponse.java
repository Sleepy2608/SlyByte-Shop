package com.example.ecommerce.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSpecResponse {
    private Long id;
    private String specGroup;
    private String specKey;
    private String specValue;
    private Integer sortOrder;
}
