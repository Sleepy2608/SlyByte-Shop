'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/services/orderService';
import { OrderStatus, OrderSummary } from '@/types/order.types';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [cancellingCode, setCancellingCode] = useState<string | null>(null);

  const fetchOrders = useCallback(async (targetPage = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getUserOrders(targetPage, 10);
      setOrders(data.items || []);
      setPage(data.page);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đơn hàng:', err);
      setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?from=/orders');
      return;
    }
    fetchOrders(0);
  }, [isAuthenticated, router, fetchOrders]);

  const handleCancelOrder = async (orderCode: string) => {
    if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderCode}?`)) {
      return;
    }

    setCancellingCode(orderCode);
    try {
      await orderService.cancelOrder(orderCode);
      // Cập nhật lại danh sách đơn hàng
      await fetchOrders(page);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Không thể hủy đơn hàng vào lúc này.');
    } finally {
      setCancellingCode(null);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(d);
    } catch {
      return dateString;
    }
  };

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge-status status-pending">Chờ xác nhận</span>;
      case 'PROCESSING':
        return <span className="badge-status status-processing">Đang xử lý</span>;
      case 'SHIPPED':
        return <span className="badge-status status-shipped">Đang giao hàng</span>;
      case 'DELIVERED':
        return <span className="badge-status status-delivered">Đã giao thành công</span>;
      case 'CANCELLED':
        return <span className="badge-status status-cancelled">Đã hủy</span>;
      default:
        return <span className="badge-status">{status}</span>;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="orders-page">
      <div className="container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Lịch Sử Mua Hàng</h1>
          <p className="checkout-subtitle">
            Theo dõi hành trình vận chuyển và trạng thái các thiết bị công nghệ bạn đã đặt.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }}>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="skeleton-thumb shimmer" style={{ height: '100px', borderRadius: '12px' }} />
            <div className="skeleton-thumb shimmer" style={{ height: '100px', borderRadius: '12px' }} />
            <div className="skeleton-thumb shimmer" style={{ height: '100px', borderRadius: '12px' }} />
          </div>
        ) : orders.length === 0 ? (
          <div className="cart-empty-container">
            <div className="cart-empty-icon">📦</div>
            <h2 className="cart-empty-title">Bạn Chưa Có Đơn Hàng Nào</h2>
            <p className="cart-empty-desc">
              Khám phá ngay các dòng Laptop cao cấp, Smartphone Flagship và phụ kiện công nghệ chính hãng để đặt mua thiết bị đầu tiên!
            </p>
            <Link href="/products" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-2)' }}>
              Khám Phá Sản Phẩm Ngay &rarr;
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mã đơn: </span>
                    <span className="order-card-code">{order.orderCode}</span>
                    <span style={{ margin: '0 8px', color: 'var(--border-strong)' }}>•</span>
                    <span className="order-card-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    {renderStatusBadge(order.orderStatus)}
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-card-info">
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Người nhận: <strong>{order.recipientName}</strong>
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Hình thức: {order.paymentMethod === 'COD' ? 'Tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="order-card-amount">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      ({order.totalItems} thiết bị)
                    </span>
                  </div>

                  <div className="order-card-actions">
                    <Link
                      href={`/order-success/${order.orderCode}`}
                      className="btn btn-outline btn-sm"
                    >
                      Chi tiết &rarr;
                    </Link>

                    {order.orderStatus === 'PENDING' && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#ff4d4f' }}
                        disabled={cancellingCode === order.orderCode}
                        onClick={() => handleCancelOrder(order.orderCode)}
                      >
                        {cancellingCode === order.orderCode ? 'Đang hủy...' : 'Hủy đơn'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Phân trang */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 'var(--space-6)' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={page <= 0}
                  onClick={() => fetchOrders(page - 1)}
                >
                  &larr; Trang trước
                </button>
                <span style={{ alignSelf: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => fetchOrders(page + 1)}
                >
                  Trang sau &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

