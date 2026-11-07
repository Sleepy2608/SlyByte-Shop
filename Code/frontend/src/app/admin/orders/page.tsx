'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { OrderDetail, OrderStatus } from '@/types/order.types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal đổi trạng thái
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('PENDING');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = useCallback(async (targetPage = 0, statusFilter = filterStatus) => {
    setLoading(true);
    try {
      const statusParam = statusFilter === 'ALL' ? undefined : (statusFilter as OrderStatus);
      const data = await adminService.getOrders(targetPage, 10, statusParam);
      setOrders(data.items || []);
      setPage(data.page);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchOrders(0, filterStatus);
  }, [filterStatus, fetchOrders]);

  const handleOpenStatusModal = (order: OrderDetail) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await adminService.updateOrderStatus(selectedOrder.id, newStatus);
      setSelectedOrder(null);
      await fetchOrders(page, filterStatus);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái đơn hàng.');
    } finally {
      setIsUpdating(false);
    }
  };

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

  return (
    <div>
      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <h2 className="admin-table-title">Danh Sách Đơn Hàng Hệ Thống</h2>

          <div className="admin-table-filters">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lọc trạng thái:</span>
            <select
              className="admin-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận (PENDING)</option>
              <option value="PROCESSING">Đang xử lý (PROCESSING)</option>
              <option value="SHIPPED">Đang giao hàng (SHIPPED)</option>
              <option value="DELIVERED">Đã hoàn thành (DELIVERED)</option>
              <option value="CANCELLED">Đã hủy (CANCELLED)</option>
            </select>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Người nhận</th>
                <th>Địa chỉ giao hàng</th>
                <th>Thiết bị đặt mua</th>
                <th>Tổng thanh toán</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                    Đang nạp dữ liệu đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Không có đơn hàng nào khớp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {order.orderCode}
                      </span>
                    </td>
                    <td>
                      <div><strong>{order.recipientName}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.phone}</div>
                    </td>
                    <td style={{ maxWidth: '240px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {order.shippingAddress}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {order.items && order.items.length > 0 ? (
                          order.items.map((it) => (
                            <div key={it.id} style={{ whiteSpace: 'nowrap' }}>
                              • {it.productName} (x{it.quantity})
                            </div>
                          ))
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Chi tiết trong đơn</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td>{renderStatusBadge(order.orderStatus)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                        onClick={() => handleOpenStatusModal(order)}
                      >
                        Đổi trạng thái
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={page <= 0}
              onClick={() => fetchOrders(page - 1)}
            >
              &larr; Trang trước
            </button>
            <span style={{ alignSelf: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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

      {/* Modal Cập Nhật Trạng Thái */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Cập Nhật Trạng Thái Đơn Hàng</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mã đơn: </span>
                <strong style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>
                  {selectedOrder.orderCode}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Người nhận: </span>
                <span>{selectedOrder.recipientName} ({selectedOrder.phone})</span>
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">Chọn trạng thái xử lý mới:</label>
                <select
                  className="form-input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                >
                  <option value="PENDING">Chờ xác nhận (PENDING)</option>
                  <option value="PROCESSING">Đang xử lý / Đóng gói (PROCESSING)</option>
                  <option value="SHIPPED">Đang giao hàng (SHIPPED)</option>
                  <option value="DELIVERED">Giao thành công (DELIVERED)</option>
                  <option value="CANCELLED">Hủy đơn hàng (CANCELLED)</option>
                </select>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                * Việc chuyển trạng thái sang <strong>DELIVERED</strong> xác nhận giao dịch thành công. Trạng thái <strong>CANCELLED</strong> sẽ hoàn trả lại tồn kho nếu đơn chưa giao.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setSelectedOrder(null)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={isUpdating}
                onClick={handleSaveStatus}
              >
                {isUpdating ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

