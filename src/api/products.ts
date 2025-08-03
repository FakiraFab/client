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