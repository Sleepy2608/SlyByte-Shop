'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { CartEmpty } from '@/components/cart/CartEmpty';
import { IconLock, IconArrowLeft, IconTrash, IconX } from '@/components/ui/Icons';

export default function CartPage() {
  const { cart, totalItems, isLoading, error, fetchCart, clearCart, clearError } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch {
      // Error state is handled by useCartStore.error
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty-container">
            <div className="cart-empty-icon">
              <IconLock size={32} />
            </div>
            <h2 className="cart-empty-title">Đăng Nhập Để Quản Lý Giỏ Hàng</h2>
            <p className="cart-empty-desc">
              Giỏ hàng thiết bị được đồng bộ bảo mật theo tài khoản cá nhân. Vui lòng đăng nhập để tiếp tục thanh toán.
            </p>
            <div className="empty-state-actions">
              <Link href="/login?from=/cart" className="btn btn-primary btn-lg">
                Đăng Nhập
              </Link>
              <Link href="/register" className="btn btn-outline btn-lg">
                Tạo Tài Khoản
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !cart) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="cart-page-title">Giỏ Hàng Thiết Bị</h1>
            <p className="cart-page-subtitle">Đang đồng bộ dữ liệu giỏ hàng...</p>
          </div>
          <div className="cart-layout">
            <div className="skeleton-thumb shimmer cart-skeleton-main" />
            <div className="skeleton-thumb shimmer cart-skeleton-side" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="cart-page-title">Giỏ Hàng Thiết Bị</h1>
            <p className="cart-page-subtitle">0 thiết bị trong giỏ</p>
          </div>
          <CartEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-page-title">Giỏ Hàng Thiết Bị Công Nghệ</h1>
          <p className="cart-page-subtitle">
            Bạn đang có <strong className="text-accent">{totalItems} sản phẩm</strong> sẵn sàng đặt mua
          </p>
        </div>

        {error && (
          <div className="alert alert-error alert-dismissible" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={clearError}
              className="alert-close-btn"
              aria-label="Đóng thông báo"
            >
              <IconX size={16} />
            </button>
          </div>
        )}

        <div className="cart-layout">
          <section className="cart-items-card">
            <div className="cart-table-head">
              <span>Thiết bị</span>
              <span>Đơn giá</span>
              <span className="text-center">Số lượng</span>
              <span>Thành tiền</span>
              <span></span>
            </div>

            <div className="cart-items-list">
              {cart.items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            <div className="cart-card-footer">
              <Link href="/products" className="btn btn-ghost btn-sm">
                <IconArrowLeft size={14} />
                <span>Tiếp tục chọn thiết bị</span>
              </Link>
              <button
                type="button"
                className="btn btn-outline btn-sm btn-danger-outline"
                onClick={handleClearCart}
                disabled={isLoading}
              >
                <IconTrash size={14} />
                <span>Xóa toàn bộ giỏ hàng</span>
              </button>
            </div>
          </section>

          <CartSummary
            totalItems={cart.totalItems}
            totalPrice={cart.totalPrice}
          />
        </div>
      </div>
    </div>
  );
}
