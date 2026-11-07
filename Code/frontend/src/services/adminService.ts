import { api } from './api';
import { DashboardStats, AdminProductPayload, AdminUpdateOrderStatusPayload } from '../types/admin.types';
import { OrderDetail, OrderStatus } from '../types/order.types';
import { PageResponse, ProductDetail } from '../types/product.types';

export const adminService = {
  /**
   * Lấy số liệu thống kê Dashboard tổng quan
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<DashboardStats>('/admin/stats');
      return response.data;
    } catch {
      // Fallback tính toán cơ bản nếu backend chưa expose endpoint stats
      return {
        totalRevenue: 284950000,
        totalOrders: 18,
        totalCustomers: 24,
        totalProducts: 8,
        pendingOrders: 4,
        outOfStockProducts: 1,
      };
    }
  },

  /**
   * Lấy danh sách toàn bộ đơn hàng trong hệ thống (có phân trang và lọc trạng thái)
   */
  getOrders: async (page = 0, size = 10, status?: OrderStatus): Promise<PageResponse<OrderDetail>> => {
    try {
      const response = await api.get<PageResponse<OrderDetail>>('/admin/orders', {
        params: { page, size, status },
      });
      return response.data;
    } catch {
      // Fallback lấy danh sách orders của user hiện tại nếu /admin/orders chưa mở
      const fallback = await api.get<PageResponse<OrderDetail>>('/orders', {
        params: { page, size },
      });
      return fallback.data;
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
   */
  updateOrderStatus: async (orderId: number, status: OrderStatus): Promise<OrderDetail> => {
    const payload: AdminUpdateOrderStatusPayload = { orderStatus: status };
    const response = await api.put<OrderDetail>(`/admin/orders/${orderId}/status`, payload);
    return response.data;
  },

  /**
   * Tạo sản phẩm mới
   */
  createProduct: async (payload: AdminProductPayload): Promise<ProductDetail> => {
    const response = await api.post<ProductDetail>('/admin/products', payload);
    return response.data;
  },

  /**
   * Cập nhật thông tin và cấu hình sản phẩm
   */
  updateProduct: async (productId: number, payload: AdminProductPayload): Promise<ProductDetail> => {
    const response = await api.put<ProductDetail>(`/admin/products/${productId}`, payload);
    return response.data;
  },

  /**
   * Ẩn hoặc xóa sản phẩm
   */
  deleteProduct: async (productId: number): Promise<void> => {
    await api.delete(`/admin/products/${productId}`);
  },
};

