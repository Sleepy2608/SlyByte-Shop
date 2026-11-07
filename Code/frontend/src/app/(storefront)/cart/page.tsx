'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { CartEmpty } from '@/components/cart/CartEmpty';

export default function CartPage() {
  const { cart, totalItems, isLoading, error, fetchCart, clearCart, clearError } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleClearCart = async () => {
    if (confirm('Bạn có chắc chắn muốn dọn sạch toàn bộ thiết bị khỏi giỏ hàng?')) {
      try {
        await clearCart();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Không thể xóa giỏ hàng.');
      }
    }
  };

  // Trường hợp chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty-container">
            <div className="cart-empty-icon">🔐</div>
            <h2 className="cart-empty-title">Đăng Nhập Để Xem Giỏ Hàng</h2>
            <p className="cart-empty-desc">
              Giỏ hàng của bạn được lưu trữ an toàn theo tài khoản cá nhân. Vui lòng đăng nhập để tiếp tục quản lý các thiết bị công nghệ đã chọn.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: 'var(--space-2)' }}>
              <Link href="/login?from=/cart" className="btn btn-primary btn-lg">
                Đăng Nhập Ngay
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

  // Trường hợp đang tải dữ liệu lần đầu
  if (isLoading && !cart) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="cart-page-title">Giỏ Hàng Của Bạn</h1>
            <p className="cart-page-subtitle">Đang nạp dữ liệu giỏ hàng...</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
            <div className="skeleton-thumb shimmer" style={{ height: '360px', borderRadius: '12px' }} />
            <div className="skeleton-thumb shimmer" style={{ height: '280px', borderRadius: '12px' }} />
          </div>
        </div>
      </div>
    );
  }

  // Trường hợp giỏ hàng rỗng
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="cart-page-title">Giỏ Hàng Của Bạn</h1>
            <p className="cart-page-subtitle">0 thiết bị công nghệ</p>
          </div>
          <CartEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header trang giỏ hàng */}
        <div className="cart-header">
          <h1 className="cart-page-title">Giỏ Hàng Thiết Bị Công Nghệ</h1>
          <p className="cart-page-subtitle">
            Bạn đang có <strong style={{ color: 'var(--color-primary)' }}>{totalItems} sản phẩm</strong> trong giỏ
          </p>
        </div>

        {/* Thông báo lỗi nếu có */}
        {error && (
          <div
            className="alert alert-error"
            style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>{error}</span>
            <button
              onClick={clearError}
              style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Bố cục 2 cột giỏ hàng */}
        <div className="cart-layout">
          {/* Cột trái: Bảng danh sách sản phẩm */}
          <section className="cart-items-card">
            <div className="cart-table-head">
              <span>Sản phẩm</span>
              <span>Đơn giá</span>
              <span style={{ textAlign: 'center' }}>Số lượng</span>
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
                &larr; Tiếp tục chọn thêm sản phẩm
              </Link>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleClearCart}
                disabled={isLoading}
                style={{ color: '#ff4d4f', borderColor: 'rgba(255, 77, 79, 0.4)' }}
              >
                Dọn sạch giỏ hàng
              </button>
            </div>
          </section>

          {/* Cột phải: Thẻ tóm tắt đơn hàng */}
          <CartSummary
            totalItems={cart.totalItems}
            totalPrice={cart.totalPrice}
          />
        </div>
      </div>
    </div>
  );
}

