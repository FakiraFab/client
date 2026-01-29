import apiClient from './client';
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '../types/cart';
import type { ApiResponse } from '../types';

export const cartApi = {
  // Get current user's cart
  getCart: async (): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (data: AddToCartRequest): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.post('/cart', data);
    return response.data;
  },

  // Update cart item
  updateCartItem: async (
    productId: string, 
    data: UpdateCartItemRequest
  ): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.patch(`/cart/items/${productId}`, data);
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (
    productId: string, 
    selectedOption?: { color?: string; size?: string }
  ): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.delete(`/cart/items/${productId}`, {
      data: { selectedOption },
    });
    return response.data;
  },

  // Clear entire cart
  clearCart: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete('/cart');
    return response.data;
  },
};
