import apiClient from "./client";
import type { Banner, BannerResponse } from "../types";

// Fetch all banners with pagination
export const fetchBanners = async (params?: {
  page?: number;
  limit?: number;
}): Promise<BannerResponse> => {
  const response = await apiClient.get('/banners', { params });
  return response.data;
};

// Fetch active banners for carousel
export const fetchActiveBanners = async (): Promise<Banner[]> => {
  const response = await apiClient.get('/banners', {
    params: {
      isActive: true,
      sort: 'order',
      limit: 20
    }
  });
  return response.data.data;
};

// Fetch a single banner by ID
export const fetchBanner = async (id: string): Promise<Banner> => {
  const response = await apiClient.get(`/banners/${id}`);
  return response.data.data;
}; 