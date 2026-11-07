import { api } from './api';
import { CheckoutPayload, OrderDetail, OrderSummary } from '../types/order.types';
import { PageResponse } from '../types/product.types';

export const orderService = {
  /**
   * Đặt hàng từ các sản phẩm trong giỏ hàng hiện tại
   */
  checkout: async (payload: CheckoutPayload): Promise<OrderDetail> => {
    const response = await api.post<OrderDetail>('/orders/checkout', payload);
    return response.data;
  },

  /**
   * Lấy danh sách lịch sử đơn hàng của người dùng đang đăng nhập
   */
  getUserOrders: async (page = 0, size = 10): Promise<PageResponse<OrderSummary>> => {
    const response = await api.get<PageResponse<OrderSummary>>('/orders', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Xem chi tiết đơn hàng theo mã đơn
   */
  getOrderDetail: async (orderCode: string): Promise<OrderDetail> => {
    const response = await api.get<OrderDetail>(`/orders/${orderCode}`);
    return response.data;
  },

  /**
   * Hủy đơn hàng (khi đơn đang ở trạng thái PENDING)
   */
  cancelOrder: async (orderCode: string): Promise<OrderDetail> => {
    const response = await api.post<OrderDetail>(`/orders/${orderCode}/cancel`);
    return response.data;
  },
};

