'use client';

import React from 'react';
import Link from 'next/link';
import { ProductSummary } from '@/types/product.types';

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const hasDiscount = product.discountPercentage > 0 && product.originalPrice > product.salePrice;
  const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.stockQuantity <= 0;

  return (
    <div className="product-card">
      <div className="product-thumb-container">
        {hasDiscount && (
          <span className="product-badge-tag discount-badge">-{product.discountPercentage}%</span>
        )}
        {product.brandName && (
          <span className="product-brand-tag">{product.brandName}</span>
        )}

        <Link href={`/products/${product.slug || product.id}`} className="product-thumb-link">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="product-thumb-img"
              loading="lazy"
            />
          ) : (
            <span className="product-thumb-icon">⚡</span>
          )}
        </Link>

        {isOutOfStock && (
          <div className="product-out-of-stock-overlay">
            <span>HẾT HÀNG</span>
          </div>
        )}
      </div>

      <div className="product-details">
        {product.categoryName && (
          <span className="product-category-label">{product.categoryName}</span>
        )}

        <h3 className="product-title" title={product.name}>
          <Link href={`/products/${product.slug || product.id}`}>
            {product.name}
          </Link>
        </h3>

        <div className="product-footer">
          <div className="product-price-block">
            <span className="product-price">{formatPrice(product.salePrice)}</span>
            {hasDiscount && (
              <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <Link
            href={`/products/${product.slug || product.id}`}
            className="btn btn-outline btn-sm"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
