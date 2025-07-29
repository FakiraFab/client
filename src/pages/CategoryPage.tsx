import React, { useState } from 'react';
import { data, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Product, ApiResponse } from '../types';
import FilterTabs from '../components/FilterTabs/FilterTabs';

const fetchProductsByCategory = async (categoryId: string | undefined, type: string): Promise<ApiResponse<Product[]>> => {
  if (!categoryId) return { success: true, data: [], filters: { subCategories: [] }, pagination: { total: 0, page: 1, pages: 1 } };
  const query = type === 'All' ? '' : `&subcategory=${type}`;
  const res = await apiClient.get(`/products?category=${categoryId}${query}`);
  console.log(res.data);
  return res.data;
};

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [selectedType, setSelectedType] = useState<string>('All');

  const { data = { success: true, data: [], filters: { subCategories: [] }, pagination: { total: 0, page: 1, pages: 1 } }, isLoading, error } = useQuery({
    queryKey: ['products', categoryId, selectedType],
    queryFn: () => fetchProductsByCategory(categoryId, selectedType),
    enabled: !!categoryId,
  });

  const displayCategoryName = categoryId?.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  // const displayCategoryName = data?.data?.

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold text-gray-800">{displayCategoryName}</h1>
        </div>
      </div>
      {/* Filter Tabs */}
      <FilterTabs categoryId={categoryId} selectedType={selectedType} onSelect={setSelectedType} subCategories={data.filters?.subCategories || []} />
      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        {/* Product Grid */}
        {error ? (
          <div className="text-center text-red-600 py-20">Error loading products: {error instanceof Error ? error.message : 'Unknown error'}</div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center text-gray-600 py-20">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.data?.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;