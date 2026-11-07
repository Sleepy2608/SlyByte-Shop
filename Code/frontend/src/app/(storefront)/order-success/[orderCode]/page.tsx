'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { orderService } from '@/services/orderService';
import { OrderDetail } from '@/types/order.types';
import { IconCheck, IconBank, IconArrowRight } from '@/components/ui/Icons';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderCode = params?.orderCode as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderCode) return;

    let isMounted = true;
    orderService
      .getOrderDetail(orderCode)
      .then((data) => {
        if (isMounted) setOrder(data);
      })
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết đơn hàng:', err);
        if (isMounted) setError('Không thể tải thông tin đơn hàng.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderCode]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="catalog-empty-state">
            <p className="catalog-empty-desc">Đang xác thực thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="catalog-empty-state">
            <h2 className="catalog-empty-title">{error || 'Không tìm thấy đơn hàng'}</h2>
            <Link href="/products" className="btn btn-primary">
              Quay lại danh mục sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="order-success-card">
          <div className="order-success-icon">
            <IconCheck size={32} />
          </div>
          <h1 className="order-success-title">Đặt Hàng Thành Công</h1>
          <p className="order-success-desc">
            Cảm ơn bạn đã lựa chọn SlyByte Shop. Đơn hàng của bạn đã được ghi nhận vào hệ thống và đang được chuẩn bị để bàn giao vận chuyển.
          </p>

          <div className="order-code-badge">
            <span>Mã đơn hàng:</span>
            <strong>{order.orderCode}</strong>
          </div>

          {order.paymentMethod === 'BANK_TRANSFER' && (
            <div className="bank-transfer-box">
              <div className="bank-transfer-title">
                <IconBank size={18} />
                <span>Thông Tin Chuyển Khoản Ngân Hàng</span>
              </div>
              <div className="bank-transfer-details">
                <div className="bank-transfer-row">
                  <span>Ngân hàng:</span>
                  <span>Vietcombank (Ngoại Thương Việt Nam)</span>
                </div>
                <div className="bank-transfer-row">
                  <span>Số tài khoản:</span>
                  <span className="mono-code">1029 3847 56</span>
                </div>
                <div className="bank-transfer-row">
                  <span>Chủ tài khoản:</span>
                  <span>SLYBYTE SHOP TECH JSC</span>
                </div>
                <div className="bank-transfer-row">
                  <span>Số tiền:</span>
                  <span className="text-success-strong">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="bank-transfer-row bank-transfer-row-last">
                  <span>Nội dung chuyển khoản:</span>
                  <span className="mono-code">{order.orderCode}</span>
                </div>
              </div>
              <p className="bank-transfer-note">
                Vui lòng ghi chính xác mã <strong>{order.orderCode}</strong> trong nội dung chuyển tiền để hệ thống tự động đối soát.
              </p>
            </div>
          )}

          <div className="order-recipient-summary">
            <div className="order-recipient-row">
              <span>Người nhận:</span>
              <strong>{order.recipientName} ({order.phone})</strong>
            </div>
            <div className="order-recipient-row">
              <span>Địa chỉ giao hàng:</span>
              <span>{order.shippingAddress}</span>
            </div>
            <div className="order-recipient-row">
              <span>Phương thức thanh toán:</span>
              <span>
                {order.paymentMethod === 'COD'
                  ? 'Thanh toán khi nhận hàng (COD)'
                  : 'Chuyển khoản ngân hàng'}
              </span>
            </div>
            <div className="order-recipient-row">
              <span>Tổng thanh toán:</span>
              <strong className="text-accent tabular-nums">{formatPrice(order.totalAmount)}</strong>
            </div>
          </div>

          <div className="empty-state-actions">
            <Link href="/orders" className="btn btn-outline btn-lg">
              Xem Lịch Sử Đơn Hàng
            </Link>
            <Link href="/products" className="btn btn-primary btn-lg">
              <span>Tiếp Tục Mua Sắm</span>
              <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
