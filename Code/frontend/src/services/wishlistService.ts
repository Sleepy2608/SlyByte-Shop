import { api } from './api';
import { WishlistItemResponse } from '@/types/wishlist.types';

export const wishlistService = {
  async getWishlist(): Promise<WishlistItemResponse[]> {
    const response = await api.get<WishlistItemResponse[]>('/wishlist');
    return response.data;
  },

  async addToWishlist(productId: number): Promise<WishlistItemResponse> {
    const response = await api.post<WishlistItemResponse>(`/wishlist/${productId}`);
    return response.data;
  },

  async removeFromWishlist(productId: number): Promise<void> {
    await api.delete(`/wishlist/${productId}`);
  },

  async checkWishlist(productId: number): Promise<boolean> {
    const response = await api.get<{ inWishlist: boolean }>(`/wishlist/check/${productId}`);
    return response.data.inWishlist;
  },
};
