package com.example.ecommerce.product.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "product_specs")
public class ProductSpec {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name; // Ví dụ: "Màn hình", "CPU", "RAM"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String value; // Ví dụ: "15.6 inch OLED", "Intel Core i7-13700H", "16GB DDR5"

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
