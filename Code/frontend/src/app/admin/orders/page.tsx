'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { OrderDetail, OrderStatus } from '@/types/order.types';
import { IconX, IconArrowLeft, IconArrowRight } from '@/components/ui/Icons';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

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
    setFeedbackError(null);
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    setFeedbackError(null);
    try {
      await adminService.updateOrderStatus(selectedOrder.id, newStatus);
      setSelectedOrder(null);
      await fetchOrders(page, filterStatus);
    } catch (err: unknown) {
      setFeedbackError(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái đơn hàng.');
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
      {feedbackError && (
        <div className="alert alert-error" role="alert">
          <span>{feedbackError}</span>
        </div>
      )}

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <h2 className="admin-table-title">Danh Sách Đơn Hàng Hệ Thống</h2>

          <div className="admin-table-filters">
            <label htmlFor="admin-order-status-filter" className="text-muted-sm">
              Lọc trạng thái:
            </label>
            <select
              id="admin-order-status-filter"
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
                  <td colSpan={7} className="admin-table-empty">
                    Đang nạp dữ liệu đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-table-empty">
                    Không có đơn hàng nào khớp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="mono-code">{order.orderCode}</span>
                    </td>
                    <td>
                      <div className="text-strong">{order.recipientName}</div>
                      <div className="text-muted-sm tabular-nums">{order.phone}</div>
                    </td>
                    <td className="admin-cell-address">
                      {order.shippingAddress}
                    </td>
                    <td>
                      <div className="admin-order-items-cell">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((it) => (
                            <div key={it.id} className="admin-order-item-line">
                              {it.productName} <span className="text-muted-sm">(x{it.quantity})</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-sm">Chi tiết trong đơn</span>
                        )}
                      </div>
                    </td>
                    <td className="text-strong tabular-nums">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td>{renderStatusBadge(order.orderStatus)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
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

        {totalPages > 1 && (
          <div className="admin-pagination-bar">
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

      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Cập Nhật Trạng Thái Đơn Hàng</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Đóng hộp thoại"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-modal-meta-row">
                <span className="text-muted-sm">Mã đơn: </span>
                <strong className="mono-code">{selectedOrder.orderCode}</strong>
              </div>
              <div className="admin-modal-meta-row">
                <span className="text-muted-sm">Người nhận: </span>
                <span>{selectedOrder.recipientName} ({selectedOrder.phone})</span>
              </div>

              <div className="form-group">
                <label htmlFor="modal-status-select" className="form-label">
                  Chọn trạng thái xử lý mới:
                </label>
                <select
                  id="modal-status-select"
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

              <p className="text-muted-sm">
                Việc chuyển trạng thái sang <strong>DELIVERED</strong> xác nhận giao dịch hoàn tất. Trạng thái <strong>CANCELLED</strong> sẽ hoàn trả lại tồn kho nếu đơn chưa giao.
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
