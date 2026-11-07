import { create } from 'zustand';
import { Cart } from '../types/cart.types';
import { cartService } from '../services/cartService';
import axios from 'axios';

interface CartState {
  cart: Cart | null;
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  totalItems: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.getCart();
      set({
        cart,
        totalItems: cart.totalItems || 0,
        isLoading: false,
      });
    } catch (err: unknown) {
      // Nếu 401 (chưa đăng nhập) thì không tính là lỗi nghiêm trọng, chỉ set cart = null
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        set({ cart: null, totalItems: 0, isLoading: false, error: null });
        return;
      }
      set({
        isLoading: false,
        error: 'Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau.',
      });
    }
  },

  addItem: async (productId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCart = await cartService.addToCart({ productId, quantity });
      set({
        cart: updatedCart,
        totalItems: updatedCart.totalItems || 0,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      let message = 'Không thể thêm sản phẩm vào giỏ hàng.';
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          message = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!';
        } else if (err.response?.data) {
          if (typeof err.response.data === 'string') {
            message = err.response.data;
          } else if (typeof err.response.data.message === 'string') {
            message = err.response.data.message;
          }
        }
      }
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  updateQuantity: async (cartItemId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCart = await cartService.updateCartItem(cartItemId, { quantity });
      set({
        cart: updatedCart,
        totalItems: updatedCart.totalItems || 0,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      let message = 'Không thể cập nhật số lượng.';
      if (axios.isAxiosError(err) && err.response?.data) {
        if (typeof err.response.data === 'string') {
          message = err.response.data;
        } else if (typeof err.response.data.message === 'string') {
          message = err.response.data.message;
        }
      }
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  removeItem: async (cartItemId: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCart = await cartService.removeCartItem(cartItemId);
      set({
        cart: updatedCart,
        totalItems: updatedCart.totalItems || 0,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      let message = 'Không thể xóa sản phẩm khỏi giỏ hàng.';
      if (axios.isAxiosError(err) && err.response?.data) {
        if (typeof err.response.data === 'string') {
          message = err.response.data;
        } else if (typeof err.response.data.message === 'string') {
          message = err.response.data.message;
        }
      }
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await cartService.clearCart();
      set({
        cart: {
          id: 0,
          userId: 0,
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
        totalItems: 0,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      let message = 'Không thể dọn sạch giỏ hàng.';
      if (axios.isAxiosError(err) && err.response?.data) {
        if (typeof err.response.data === 'string') {
          message = err.response.data;
        } else if (typeof err.response.data.message === 'string') {
          message = err.response.data.message;
        }
      }
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  reset: () => {
    set({
      cart: null,
      totalItems: 0,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

