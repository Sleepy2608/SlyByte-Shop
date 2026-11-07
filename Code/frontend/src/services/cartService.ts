import { api } from './api';
import { AddToCartPayload, Cart, UpdateCartItemPayload } from '../types/cart.types';

export const cartService = {
  /**
   * Lấy giỏ hàng của người dùng hiện tại
   */
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  addToCart: async (payload: AddToCartPayload): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/items', payload);
    return response.data;
  },

  /**
   * Cập nhật số lượng của mục giỏ hàng
   */
  updateCartItem: async (cartItemId: number, payload: UpdateCartItemPayload): Promise<Cart> => {
    const response = await api.put<Cart>(`/cart/items/${cartItemId}`, payload);
    return response.data;
  },

  /**
   * Xóa một sản phẩm khỏi giỏ hàng
   */
  removeCartItem: async (cartItemId: number): Promise<Cart> => {
    const response = await api.delete<Cart>(`/cart/items/${cartItemId}`);
    return response.data;
  },

  /**
   * Dọn sạch toàn bộ sản phẩm trong giỏ hàng
   */
  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};

