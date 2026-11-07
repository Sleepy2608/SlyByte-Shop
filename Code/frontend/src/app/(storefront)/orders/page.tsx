'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/services/orderService';
import { OrderStatus, OrderSummary } from '@/types/order.types';
import { IconPackage, IconArrowRight, IconArrowLeft } from '@/components/ui/Icons';

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
    setCancellingCode(orderCode);
    setError(null);
    try {
      await orderService.cancelOrder(orderCode);
      await fetchOrders(page);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể hủy đơn hàng vào lúc này.');
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
        <div className="checkout-header">
          <h1 className="checkout-title">Lịch Sử Mua Hàng</h1>
          <p className="checkout-subtitle">
            Theo dõi lộ trình giao vận và trạng thái các thiết bị công nghệ bạn đã đặt.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="orders-list">
            <div className="skeleton-thumb shimmer order-skeleton-row" />
            <div className="skeleton-thumb shimmer order-skeleton-row" />
            <div className="skeleton-thumb shimmer order-skeleton-row" />
          </div>
        ) : orders.length === 0 ? (
          <div className="cart-empty-container">
            <div className="cart-empty-icon">
              <IconPackage size={36} />
            </div>
            <h2 className="cart-empty-title">Bạn Chưa Có Đơn Hàng Nào</h2>
            <p className="cart-empty-desc">
              Khám phá các dòng Laptop Workstation, Smartphone Flagship và thiết bị công nghệ chính hãng để đặt đơn hàng đầu tiên.
            </p>
            <Link href="/products" className="btn btn-primary btn-lg">
              <span>Khám Phá Kho Thiết Bị</span>
              <IconArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-card-meta">
                    <span className="order-meta-label">Mã đơn:</span>
                    <span className="order-card-code">{order.orderCode}</span>
                    <span className="order-meta-divider">/</span>
                    <span className="order-card-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    {renderStatusBadge(order.orderStatus)}
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-card-info">
                    <span className="order-info-primary">
                      Người nhận: <strong>{order.recipientName}</strong>
                    </span>
                    <span className="order-info-secondary">
                      Phương thức: {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                    </span>
                  </div>

                  <div className="order-card-pricing">
                    <div className="order-card-amount">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <span className="order-info-secondary">
                      {order.totalItems} thiết bị
                    </span>
                  </div>

                  <div className="order-card-actions">
                    <Link
                      href={`/order-success/${order.orderCode}`}
                      className="btn btn-outline btn-sm"
                    >
                      <span>Chi tiết</span>
                      <IconArrowRight size={14} />
                    </Link>

                    {order.orderStatus === 'PENDING' && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-danger-ghost"
                        disabled={cancellingCode === order.orderCode}
                        onClick={() => handleCancelOrder(order.orderCode)}
                      >
                        {cancellingCode === order.orderCode ? 'Đang hủy...' : 'Hủy đơn'}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={page <= 0}
                  onClick={() => fetchOrders(page - 1)}
                >
                  <IconArrowLeft size={14} />
                  <span>Trang trước</span>
                </button>
                <span className="pagination-status-text">
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => fetchOrders(page + 1)}
                >
                  <span>Trang sau</span>
                  <IconArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
