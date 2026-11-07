'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/adminService';
import { DashboardStats } from '@/types/admin.types';
import { OrderDetail, OrderStatus } from '@/types/order.types';
import {
  IconCreditCard,
  IconPackage,
  IconUsers,
  IconLaptop,
  IconArrowRight,
} from '@/components/ui/Icons';

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
          <div className="skeleton-thumb shimmer admin-skeleton-stat" />
          <div className="skeleton-thumb shimmer admin-skeleton-stat" />
          <div className="skeleton-thumb shimmer admin-skeleton-stat" />
          <div className="skeleton-thumb shimmer admin-skeleton-stat" />
        </div>
        <div className="skeleton-thumb shimmer admin-skeleton-table" />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>Tổng Doanh Thu</span>
            <span className="admin-stat-icon">
              <IconCreditCard size={18} />
            </span>
          </div>
          <div className="admin-stat-value text-accent tabular-nums">
            {formatPrice(stats?.totalRevenue || 0)}
          </div>
          <div className="admin-stat-subtext">Đã ghi nhận trong hệ thống</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>Đơn Hàng Chờ Xử Lý</span>
            <span className="admin-stat-icon">
              <IconPackage size={18} />
            </span>
          </div>
          <div className="admin-stat-value text-warning tabular-nums">
            {stats?.pendingOrders || 0}
          </div>
          <div className="admin-stat-subtext">Trên tổng số {stats?.totalOrders || 0} đơn hàng</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>Khách Hàng Đăng Ký</span>
            <span className="admin-stat-icon">
              <IconUsers size={18} />
            </span>
          </div>
          <div className="admin-stat-value tabular-nums">
            {stats?.totalCustomers || 0}
          </div>
          <div className="admin-stat-subtext">Tài khoản thành viên hoạt động</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>Thiết Bị Đang Mở Bán</span>
            <span className="admin-stat-icon">
              <IconLaptop size={18} />
            </span>
          </div>
          <div className="admin-stat-value tabular-nums">
            {stats?.totalProducts || 0}
          </div>
          <div className="admin-stat-subtext">
            {stats?.outOfStockProducts
              ? `${stats.outOfStockProducts} sản phẩm tạm hết hàng`
              : 'Đủ tồn kho cung ứng'}
          </div>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <h2 className="admin-table-title">Đơn Hàng Cần Xử Lý Gần Đây</h2>
          <Link href="/admin/orders" className="btn btn-outline btn-sm">
            <span>Xem tất cả đơn hàng</span>
            <IconArrowRight size={14} />
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
                  <td colSpan={7} className="admin-table-empty">
                    Chưa có đơn hàng nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="mono-code">{order.orderCode}</span>
                    </td>
                    <td>{order.recipientName}</td>
                    <td className="tabular-nums">{order.phone}</td>
                    <td className="text-strong tabular-nums">{formatPrice(order.totalAmount)}</td>
                    <td>
                      <span className="text-muted-sm">
                        {order.paymentMethod === 'COD' ? 'COD' : 'Chuyển khoản'}
                      </span>
                    </td>
                    <td>{renderStatusBadge(order.orderStatus)}</td>
                    <td>
                      <Link href="/admin/orders" className="btn btn-ghost btn-sm">
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
