package com.example.ecommerce.product.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    private String slug;

    @Column(name = "parent_id")
    private Long parentId;

    private String description;
}
