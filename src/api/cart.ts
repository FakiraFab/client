import apiClient from './client';

// Backend cart item interface (without full product data)
export interface BackendCartItem {
  productId: string;
  quantity: number;
  selectedVariant?: number;
  selectedColor?: string;
  _id?: string; // Backend-generated cart item ID
}

// Backend cart response interface
export interface BackendCart {
  _id?: string;
  userId: string;
  items: BackendCartItem[];
  createdAt?: string;
  updatedAt?: string;
}

// Cart API functions
export const cartApi = {
  // Get user's cart from backend
  getCart: async (): Promise<BackendCart> => {
    try {
      const response = await apiClient.get('/cart');
      return response.data.data || { userId: '', items: [] };
    } catch (error: any) {
      // If cart doesn't exist (404), return empty cart
      if (error.response?.status === 404) {
        return { userId: '', items: [] };
      }
      throw error;
    }
  },

  // Add item to cart or update quantity if exists
  addToCart: async (item: BackendCartItem): Promise<BackendCart> => {
    try {
      const response = await apiClient.post('/cart', item);
      return response.data.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string, quantity: number): Promise<BackendCart> => {
    try {
      const response = await apiClient.patch(`/cart/items/${itemId}`, { quantity });
      return response.data.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeCartItem: async (itemId: string): Promise<BackendCart> => {
    try {
      const response = await apiClient.delete(`/cart/items/${itemId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async (): Promise<void> => {
    try {
      await apiClient.delete('/cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Sync/replace entire cart (useful for cart merge)
  syncCart: async (items: BackendCartItem[]): Promise<BackendCart> => {
    try {
      const response = await apiClient.put('/cart', { items });
      return response.data.data;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  },
};
