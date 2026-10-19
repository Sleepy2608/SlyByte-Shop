package com.example.ecommerce.product.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;

    @Column(name = "is_thumbnail", nullable = false)
    private Boolean isThumbnail = false;

    private Integer sortOrder = 0;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
