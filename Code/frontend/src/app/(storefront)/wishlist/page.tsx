'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { IconHeart, IconTrash, IconShoppingBag, IconLaptop } from '@/components/ui/Icons';

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const { items, totalItems, isLoading, removeItem, fetchWishlist } = useWishlistStore();
  const { addItem, isLoading: isCartLoading } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleAddToCart = async (productId: number) => {
    await addItem(productId, 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page container">
        <div className="wishlist-empty-card">
          <div className="wishlist-empty-icon">
            <IconHeart size={48} />
          </div>
          <h2 className="wishlist-empty-title">Danh Sách Yêu Thích</h2>
          <p className="wishlist-empty-desc">
            Vui lòng đăng nhập để lưu trữ và theo dõi các thiết bị công nghệ bạn yêu thích.
          </p>
          <Link href="/login" className="btn btn-primary">
            Đăng Nhập Ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container">
      {/* Header */}
      <div className="wishlist-header">
        <div>
          <span className="technical-eyebrow">SAVED GEAR // WISHLIST</span>
          <h1 className="wishlist-heading">
            Danh Sách Thiết Bị Yêu Thích <span className="tabular-nums">({totalItems})</span>
          </h1>
        </div>
        <Link href="/products" className="btn btn-outline btn-sm">
          Tiếp tục xem sản phẩm
        </Link>
      </div>

      {isLoading && items.length === 0 ? (
        <div className="wishlist-loading">Đang tải danh sách thiết bị yêu thích...</div>
      ) : items.length === 0 ? (
        <div className="wishlist-empty-card">
          <div className="wishlist-empty-icon">
            <IconHeart size={48} />
          </div>
          <h2 className="wishlist-empty-title">Danh sách yêu thích trống</h2>
          <p className="wishlist-empty-desc">
            Bạn chưa lưu thiết bị công nghệ nào vào danh sách này. Bấm vào biểu tượng trái tim trên các sản phẩm để lưu lại và theo dõi biến động giá.
          </p>
          <Link href="/products" className="btn btn-primary">
            Khám Phá Thiết Bị
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => {
            const isOutOfStock = item.stockQuantity <= 0;
            const hasDiscount = item.originalPrice > item.salePrice;

            return (
              <article key={item.id} className="wishlist-card">
                <div className="wishlist-card-thumb">
                  <Link href={`/products/${item.productSlug || item.productId}`}>
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.productName}
                        className="wishlist-thumb-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="wishlist-thumb-fallback">
                        <IconLaptop size={32} />
                      </div>
                    )}
                  </Link>

                  <button
                    type="button"
                    className="wishlist-remove-btn"
                    onClick={() => removeItem(item.productId)}
                    title="Xóa khỏi yêu thích"
                    aria-label={`Xóa ${item.productName} khỏi yêu thích`}
                  >
                    <IconTrash size={16} />
                  </button>
                </div>

                <div className="wishlist-card-body">
                  <h3 className="wishlist-card-title">
                    <Link href={`/products/${item.productSlug || item.productId}`}>
                      {item.productName}
                    </Link>
                  </h3>

                  <div className="wishlist-price-row">
                    <span className="wishlist-sale-price tabular-nums">
                      {formatPrice(item.salePrice)}
                    </span>
                    {hasDiscount && (
                      <span className="wishlist-original-price tabular-nums">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="wishlist-stock-status">
                    <span
                      className={`stock-status-dot ${isOutOfStock ? 'out-of-stock' : ''}`}
                    />
                    <span className="stock-status-text">
                      {isOutOfStock ? 'Hết hàng' : `Còn hàng (${item.stockQuantity})`}
                    </span>
                  </div>

                  <div className="wishlist-card-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-block"
                      disabled={isOutOfStock || isCartLoading}
                      onClick={() => handleAddToCart(item.productId)}
                    >
                      <IconShoppingBag size={15} />
                      <span>Thêm vào giỏ</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
