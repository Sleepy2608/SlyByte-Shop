import { create } from 'zustand';
import { WishlistItemResponse } from '../types/wishlist.types';
import { wishlistService } from '../services/wishlistService';
import axios from 'axios';

interface WishlistState {
  items: WishlistItemResponse[];
  wishlistProductIds: number[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  removeItem: (productId: number) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  wishlistProductIds: [],
  totalItems: 0,
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await wishlistService.getWishlist();
      set({
        items,
        wishlistProductIds: items.map((i) => i.productId),
        totalItems: items.length,
        isLoading: false,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        set({ items: [], wishlistProductIds: [], totalItems: 0, isLoading: false, error: null });
        return;
      }
      set({
        isLoading: false,
        error: 'Không thể tải danh sách yêu thích.',
      });
    }
  },

  toggleWishlist: async (productId: number) => {
    const isPresent = get().wishlistProductIds.includes(productId);
    if (isPresent) {
      // Remove
      set((state) => ({
        items: state.items.filter((i) => i.productId !== productId),
        wishlistProductIds: state.wishlistProductIds.filter((id) => id !== productId),
        totalItems: Math.max(0, state.totalItems - 1),
      }));
      try {
        await wishlistService.removeFromWishlist(productId);
        return false;
      } catch (err) {
        // Rollback on error
        await get().fetchWishlist();
        throw err;
      }
    } else {
      // Add
      const newItem = await wishlistService.addToWishlist(productId);
      set((state) => ({
        items: [newItem, ...state.items],
        wishlistProductIds: [...state.wishlistProductIds, productId],
        totalItems: state.totalItems + 1,
      }));
      return true;
    }
  },

  isInWishlist: (productId: number) => {
    return get().wishlistProductIds.includes(productId);
  },

  removeItem: async (productId: number) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
      wishlistProductIds: state.wishlistProductIds.filter((id) => id !== productId),
      totalItems: Math.max(0, state.totalItems - 1),
    }));
    try {
      await wishlistService.removeFromWishlist(productId);
    } catch (err) {
      await get().fetchWishlist();
      throw err;
    }
  },

  clearWishlist: () => {
    set({ items: [], wishlistProductIds: [], totalItems: 0, error: null });
  },
}));
