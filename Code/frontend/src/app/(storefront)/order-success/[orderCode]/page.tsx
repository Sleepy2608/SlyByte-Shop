'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { orderService } from '@/services/orderService';
import { OrderDetail } from '@/types/order.types';

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
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Đang xác thực thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-success-page">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2 style={{ color: '#ff4d4f', marginBottom: '16px' }}>{error || 'Không tìm thấy đơn hàng'}</h2>
          <Link href="/products" className="btn btn-primary">
            Quay lại danh mục sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="order-success-card">
          <div className="order-success-icon">✓</div>
          <h1 className="order-success-title">Đặt Hàng Thành Công!</h1>
          <p className="order-success-desc">
            Cảm ơn bạn đã lựa chọn SlyByte Shop. Đơn hàng của bạn đã được ghi nhận vào hệ thống và đang được chuẩn bị để bàn giao cho đơn vị vận chuyển.
          </p>

          <div className="order-code-badge">
            <span>Mã đơn hàng:</span>
            <span>{order.orderCode}</span>
          </div>

          {/* Hộp hướng dẫn chuyển khoản nếu chọn BANK_TRANSFER */}
          {order.paymentMethod === 'BANK_TRANSFER' && (
            <div className="bank-transfer-box">
              <div className="bank-transfer-title">
                <span>🏦</span>
                <span>Thông Tin Chuyển Khoản Ngân Hàng</span>
              </div>
              <div className="bank-transfer-details">
                <div className="bank-transfer-row">
                  <span>Ngân hàng:</span>
                  <span>Vietcombank (Ngoại Thương Việt Nam)</span>
                </div>
                <div className="bank-transfer-row">
                  <span>Số tài khoản:</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '1.05rem', letterSpacing: '1px' }}>
                    1029 3847 56
                  </span>
                </div>
                <div className="bank-transfer-row">
                  <span>Chủ tài khoản:</span>
                  <span>SLYBYTE SHOP TECH JSC</span>
                </div>
                <div className="bank-transfer-row">
                  <span>Số tiền:</span>
                  <span style={{ color: '#52c41a', fontSize: '1.1rem' }}>
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
                <div className="bank-transfer-row" style={{ borderBottom: 'none' }}>
                  <span>Nội dung chuyển khoản:</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {order.orderCode}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                * Lưu ý: Vui lòng ghi chính xác <strong>{order.orderCode}</strong> trong nội dung chuyển tiền để hệ thống tự động kích hoạt trạng thái đơn hàng nhanh nhất.
              </p>
            </div>
          )}

          {/* Chi tiết người nhận & Tóm tắt */}
          <div style={{ textAlign: 'left', background: 'var(--bg-surface)', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Người nhận:</strong> {order.recipientName} ({order.phone})
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Phương thức thanh toán:</strong> {order.paymentMethod === 'COD' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
            </div>
            <div>
              <strong>Tổng thanh toán:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/orders" className="btn btn-outline btn-lg">
              Xem Lịch Sử Đơn Hàng
            </Link>
            <Link href="/products" className="btn btn-primary btn-lg">
              Tiếp Tục Mua Sắm &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

