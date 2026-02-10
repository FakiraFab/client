import apiClient from './client';
import type { Address, AddressFormData } from '../types/address';
import type { ApiResponse } from '../types';

export const addressApi = {
  // Get all addresses for current user
  getAddresses: async (): Promise<ApiResponse<Address[]>> => {
    const response = await apiClient.get('/addresses');
    return response.data;
  },

  // Get single address
  getAddress: async (id: string): Promise<ApiResponse<Address>> => {
    const response = await apiClient.get(`/addresses/${id}`);
    return response.data;
  },

  // Create new address
  createAddress: async (data: AddressFormData): Promise<ApiResponse<Address>> => {
    const response = await apiClient.post('/addresses', data);
    return response.data;
  },

  // Update address
  updateAddress: async (id: string, data: Partial<AddressFormData>): Promise<ApiResponse<Address>> => {
    const response = await apiClient.patch(`/addresses/${id}`, data);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/addresses/${id}`);
    return response.data;
  },

  // Set default address
  setDefaultAddress: async (id: string): Promise<ApiResponse<Address>> => {
    const response = await apiClient.patch(`/addresses/${id}/set-default`);
    return response.data;
  },
};
