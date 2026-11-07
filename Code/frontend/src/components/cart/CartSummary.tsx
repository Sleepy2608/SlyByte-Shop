'use client';

import React from 'react';
import Link from 'next/link';

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  onCheckout?: () => void;
}

export function CartSummary({ totalItems, totalPrice }: CartSummaryProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <aside className="cart-summary-card">
      <h3 className="cart-summary-title">Tóm Tắt Đơn Hàng</h3>

      <div className="cart-summary-row">
        <span>Tổng số lượng:</span>
        <strong style={{ color: 'var(--text-primary)' }}>{totalItems} thiết bị</strong>
      </div>

      <div className="cart-summary-row">
        <span>Tạm tính:</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>

      <div className="cart-summary-row">
        <span>Phí vận chuyển:</span>
        <span style={{ color: '#52c41a', fontWeight: 600 }}>Miễn phí (Toàn quốc)</span>
      </div>

      <div className="cart-summary-row total-row">
        <span>Tổng thanh toán:</span>
        <span className="cart-summary-total-price">{formatPrice(totalPrice)}</span>
      </div>

      <Link
        href="/checkout"
        className="btn btn-primary btn-block btn-lg"
        style={{ marginTop: 'var(--space-2)' }}
      >
        Tiến Hành Đặt Hàng &rarr;
      </Link>

      <Link
        href="/products"
        className="btn btn-outline btn-block btn-sm"
      >
        &larr; Tiếp tục chọn thêm sản phẩm
      </Link>

      <div className="cart-summary-guarantee">
        <div className="cart-summary-guarantee-item">
          <span>🛡️</span>
          <span>Cam kết 100% phần cứng chính hãng</span>
        </div>
        <div className="cart-summary-guarantee-item">
          <span>⚡</span>
          <span>Bảo hành 24 tháng theo tiêu chuẩn nhà sản xuất</span>
        </div>
        <div className="cart-summary-guarantee-item">
          <span>🔄</span>
          <span>Đổi trả 1-đổi-1 trong 30 ngày nếu phát sinh lỗi</span>
        </div>
      </div>
    </aside>
  );
}

