package com.example.ecommerce.product.service;

import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.product.dto.BrandResponse;
import com.example.ecommerce.product.entity.Brand;
import com.example.ecommerce.product.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    @Transactional(readOnly = true)
    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAllByOrderByNameAsc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BrandResponse getBrandBySlug(String slug) {
        Brand brand = brandRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu: " + slug));
        return mapToResponse(brand);
    }

    public BrandResponse mapToResponse(Brand brand) {
        if (brand == null) return null;
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .slug(brand.getSlug())
                .logoUrl(brand.getLogoUrl())
                .build();
    }
}

