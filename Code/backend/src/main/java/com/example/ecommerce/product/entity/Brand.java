package com.example.ecommerce.product.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    private String slug;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;
}
