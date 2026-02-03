import apiClient from './client';
import type { Wishlist } from '../types/wishlist';
import type { ApiResponse } from '../types';

export const wishlistApi = {
  // Get wishlist
  getWishlist: async (): Promise<ApiResponse<Wishlist>> => {
    const response = await apiClient.get('/wishlist');
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (productId: string): Promise<ApiResponse<Wishlist>> => {
    const response = await apiClient.post('/wishlist', { productId });
    return response.data;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/wishlist/${productId}`);
    return response.data;
  },

  // Move wishlist item to cart
  moveToCart: async (productId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/wishlist/${productId}/move-to-cart`);
    return response.data;
  },
};
