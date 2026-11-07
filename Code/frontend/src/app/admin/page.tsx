'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/adminService';
import { DashboardStats } from '@/types/admin.types';
import { OrderDetail, OrderStatus } from '@/types/order.types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [statsData, ordersData] = await Promise.all([
          adminService.getStats(),
          adminService.getOrders(0, 5),
        ]);
        if (isMounted) {
          setStats(statsData);
          setRecentOrders(ordersData.items || []);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge-status status-pending">Chờ xác nhận</span>;
      case 'PROCESSING':
        return <span className="badge-status status-processing">Đang xử lý</span>;
      case 'SHIPPED':
        return <span className="badge-status status-shipped">Đang giao</span>;
      case 'DELIVERED':
        return <span className="badge-status status-delivered">Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="badge-status status-cancelled">Đã hủy</span>;
      default:
        return <span className="badge-status">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div>
        <div className="admin-stats-grid">
          <div className="skeleton-thumb shimmer" style={{ height: '110px', borderRadius: '12px' }} />
          <div className="skeleton-thumb shimmer" style={{ height: '110px', borderRadius: '12px' }} />
          <div className="skeleton-thumb shimmer" style={{ height: '110px', borderRadius: '12px' }} />
          <div className="skeleton-thumb shimmer" style={{ height: '110px', borderRadius: '12px' }} />
        </div>
        <div className="skeleton-thumb shimmer" style={{ height: '300px', borderRadius: '12px' }} />
      </div>
    );
  }

  return (
    <div>
      {/* 4 Thẻ Thống Kê Chính */}
      <div className="admin-stats-grid">
        {/* Doanh thu */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>Tổng Doanh Thu</span>
            <span className="admin-stat-icon">💰</span>
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--color-primary)' }}>
            {formatPrice(stats?.totalRevenue || 0)}
          </div>
          <div className="admin-stat-subtext">Đã ghi nhận trong hệ thống</div>
        </div>

        {/* Tổng đơn hàng & Đơn chờ duyệt */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>Đơn Hàng Chờ Xử Lý</span>
            <span className="admin-stat-icon">📦</span>
          </div>
          <div className="admin-stat-value" style={{ color: '#faad14' }}>
            {stats?.pendingOrders || 0}
          </div>
          <div className="admin-stat-subtext">Trên tổng số {stats?.totalOrders || 0} đơn hàng</div>
        </div>

        {/* Khách hàng */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>Khách Hàng Đã Đăng Ký</span>
            <span className="admin-stat-icon">👥</span>
          </div>
          <div className="admin-stat-value">
            {stats?.totalCustomers || 0}
          </div>
          <div className="admin-stat-subtext">Tài khoản thành viên hoạt động</div>
        </div>

        {/* Sản phẩm trong kho */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>Thiết Bị Đang Mở Bán</span>
            <span className="admin-stat-icon">💻</span>
          </div>
          <div className="admin-stat-value">
            {stats?.totalProducts || 0}
          </div>
          <div className="admin-stat-subtext">
            {stats?.outOfStockProducts ? `${stats.outOfStockProducts} sản phẩm tạm hết hàng` : 'Đủ tồn kho cung ứng'}
          </div>
        </div>
      </div>

      {/* Bảng Đơn Hàng Gần Đây */}
      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <h2 className="admin-table-title">Đơn Hàng Cần Xử Lý Gần Đây</h2>
          <Link href="/admin/orders" className="btn btn-outline btn-sm">
            Xem tất cả đơn hàng &rarr;
          </Link>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Người nhận</th>
                <th>Số điện thoại</th>
                <th>Tổng thanh toán</th>
                <th>Hình thức</th>
                <th>Trạng thái</th>
                <th>Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Chưa có đơn hàng nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {order.orderCode}
                      </span>
                    </td>
                    <td>{order.recipientName}</td>
                    <td>{order.phone}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(order.totalAmount)}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {order.paymentMethod === 'COD' ? 'COD' : 'Chuyển khoản'}
                      </span>
                    </td>
                    <td>{renderStatusBadge(order.orderStatus)}</td>
                    <td>
                      <Link
                        href={`/admin/orders`}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      >
                        Quản lý
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

