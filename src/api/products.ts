import apiClient from "./client";

export const fetchNewArrivals = async () => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const res = await apiClient.get('/products', {
    params: {
      createdAt: {
        $gte: twoWeeksAgo.toISOString()
      },
      sort: '-createdAt',
      limit: 4
    }
  });
  return res.data.data;
};

// Reels API functions
export const fetchReels = async (params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}) => {
  const response = await apiClient.get('/reels', { params });
  return response.data;
};

export const fetchActiveReels = async () => {
  const response = await apiClient.get('/reels/active');
  return response.data;
};

export const fetchReel = async (id: string) => {
  const response = await apiClient.get(`/reels/${id}`);
  return response.data;
};