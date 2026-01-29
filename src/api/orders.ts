import apiClient from './client';
import type { 
  Order, 
  CreateOrderRequest, 
  CreateOrderResponse,
  VerifyPaymentRequest,
  CancelOrderRequest 
} from '../types/order';
import type { ApiResponse } from '../types';

export const orderApi = {
  // Create new order
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await apiClient.post('/orders/create', data);
    return response.data;
  },

  // Verify payment (for Razorpay)
  verifyPayment: async (data: VerifyPaymentRequest): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post('/orders/verify-payment', data);
    return response.data;
  },

  // Get all orders for current user
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string, data: CancelOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post(`/orders/${id}/cancel`, data);
    return response.data;
  },
};
