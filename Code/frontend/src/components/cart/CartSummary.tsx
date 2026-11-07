'use client';

import React from 'react';
import Link from 'next/link';
import {
  IconShieldCheck,
  IconBolt,
  IconRefresh,
  IconArrowRight,
  IconArrowLeft,
} from '@/components/ui/Icons';

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
        <strong className="text-strong">{totalItems} thiết bị</strong>
      </div>

      <div className="cart-summary-row">
        <span>Tạm tính:</span>
        <span className="tabular-nums">{formatPrice(totalPrice)}</span>
      </div>

      <div className="cart-summary-row">
        <span>Phí vận chuyển:</span>
        <span className="text-success-strong">Miễn phí toàn quốc</span>
      </div>

      <div className="cart-summary-row total-row">
        <span>Tổng thanh toán:</span>
        <span className="cart-summary-total-price">{formatPrice(totalPrice)}</span>
      </div>

      <Link href="/checkout" className="btn btn-primary btn-block btn-lg">
        <span>Tiến Hành Đặt Hàng</span>
        <IconArrowRight size={16} />
      </Link>

      <Link href="/products" className="btn btn-outline btn-block btn-sm">
        <IconArrowLeft size={14} />
        <span>Tiếp tục chọn thiết bị</span>
      </Link>

      <div className="cart-summary-guarantee">
        <div className="cart-summary-guarantee-item">
          <IconShieldCheck size={15} />
          <span>Cam kết 100% phần cứng chính hãng</span>
        </div>
        <div className="cart-summary-guarantee-item">
          <IconBolt size={15} />
          <span>Bảo hành 24 tháng theo tiêu chuẩn nhà sản xuất</span>
        </div>
        <div className="cart-summary-guarantee-item">
          <IconRefresh size={15} />
          <span>Đổi mới 1-đổi-1 trong 30 ngày nếu phát sinh lỗi</span>
        </div>
      </div>
    </aside>
  );
}
