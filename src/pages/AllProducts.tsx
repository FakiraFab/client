import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Product, ApiResponse } from '../types';

// Fetch all products
const fetchAllProducts = async (): Promise<ApiResponse<Product[]>> => {
  const res = await apiClient.get('/products', {
    params: {
      sort: '-createdAt',
      limit: 50 // Adjust based on your needs
    }
  });
  return res.data;
};

const AllProducts: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('featured');

  const { data = { success: true, data: [], pagination: { total: 0, page: 1, pages: 1 } }, isLoading, error } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchAllProducts,
  });

  // Sort products based on selected option
  const sortedProducts = React.useMemo(() => {
    if (!data.data) return [];
    
    const products = [...data.data];
    
    switch (sortBy) {
      case 'price-low':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high':
        return products.sort((a, b) => b.price - a.price);
      case 'newest':
        return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products; // Featured - keep original order
    }
  }, [data.data, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header Section */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        {/* Background with decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl transform -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl transform translate-y-1/2"></div>
        </div>
        
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 tracking-tight">
              All Products
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover our complete collection of premium fabrics, sarees, dress materials, and more
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Section */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-0">
              Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
            </p>
            
            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-2xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Error State */}
        {error && (
          <div className="text-center py-16 sm:py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600 mb-6">
                {error instanceof Error ? error.message : 'Unable to load products. Please try again.'}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedProducts.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products at the moment. Please check back later.
              </p>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && sortedProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {sortedProducts.map((product: Product, index: number) => (
              <div 
                key={product._id} 
                className="group transform transition-all duration-300 hover:scale-105 hover:z-10"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Load More Section */}
        {!isLoading && !error && sortedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16 text-center">
            <button className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-purple-300 hover:text-purple-600 transition-all duration-200 shadow-sm hover:shadow-md">
              <span>Load More Products</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Stay In Style
            </h3>
            <p className="text-gray-300 mb-8">
              Get the latest trends, exclusive offers, and style inspiration delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button className="px-6 py-3 bg-[#7F1416] from-red-900 to-red-800 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style> */}
    </div>
  );
};

export default AllProducts;
