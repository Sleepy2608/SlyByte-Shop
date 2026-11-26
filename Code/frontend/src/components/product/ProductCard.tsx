'use client';

import React from 'react';
import Link from 'next/link';
import { ProductSummary } from '@/types/product.types';
import { IconLaptop, IconHeart } from '@/components/ui/Icons';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const isLiked = isInWishlist(product.id);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      await toggleWishlist(product.id);
    } catch {
      // Ignored on fail
    }
  };

  const hasDiscount = product.discountPercentage > 0 && product.originalPrice > product.salePrice;
  const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.stockQuantity <= 0;

  return (
    <article className="product-card">
      <div className="product-thumb-container">
        {hasDiscount && (
          <span className="product-badge-tag discount-badge">-{product.discountPercentage}%</span>
        )}
        {product.brandName && (
          <span className="product-brand-tag">{product.brandName}</span>
        )}

        <button
          type="button"
          className={`product-card-wishlist-btn ${isLiked ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={isLiked ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          aria-label={isLiked ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <IconHeart size={16} filled={isLiked} />
        </button>

        <Link href={`/products/${product.slug || product.id}`} className="product-thumb-link">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="product-thumb-img"
              loading="lazy"
            />
          ) : (
            <span className="product-thumb-icon">
              <IconLaptop size={36} />
            </span>
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
    </article>
  );
}
