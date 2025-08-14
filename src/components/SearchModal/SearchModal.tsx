import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../ProductCard';
import apiClient from '../../api/client';
import type { Product, ApiResponse } from '../../types';
import styles from './SearchModal.module.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fetch products based on search query
const searchProducts = async (query: string): Promise<ApiResponse<Product[]>> => {
  if (!query.trim()) {
    // Fetch default products when no search query
    const res = await apiClient.get('/products', {
      params: {
        sort: '-createdAt',
        limit: 8 // Show 8 products by default
      }
    });
    return res.data;
  }

  // Search with query
  const res = await apiClient.get('/products/search', {
    params: {
      q: query,
      limit: 20 // More results for search
    }
  });
  return res.data;
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setDebouncedQuery('');
    }
  }, [isOpen]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchProducts', debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery),
    enabled: isOpen, // Only run query when modal is open
  });

  const products = data?.data || [];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal - Fixed positioning with proper responsive behavior */}
      <div className="relative flex flex-col h-full">
        {/* Mobile: Full screen, Desktop: Centered with max height */}
        <div className="mx-auto w-full h-full flex flex-col 
                        md:max-w-6xl md:my-8 md:mx-4 md:h-auto md:max-h-[calc(100vh-4rem)]">
          
          <div className="bg-white flex flex-col h-full 
                          rounded-none md:rounded-3xl md:shadow-2xl 
                          overflow-hidden">
            
            {/* Header - Always visible */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-4 md:px-6">
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl 
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white 
                             transition-all duration-200 text-base md:text-lg"
                    autoFocus
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                           rounded-xl transition-colors duration-200 flex-shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search Stats */}
              {!isLoading && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {searchQuery ? (
                      products.length > 0 ? (
                        <>Found <span className="font-semibold text-gray-900">{products.length}</span> results for "<span className="font-medium">{searchQuery}</span>"</>
                      ) : (
                        <>No results found for "<span className="font-medium">{searchQuery}</span>"</>
                      )
                    ) : (
                      <>Showing <span className="font-semibold text-gray-900">{products.length}</span> featured products</>
                    )}
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-red-600 hover:text-red-700 font-medium flex-shrink-0"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Content - Scrollable area */}
            <div className={`flex-1 overflow-y-auto min-h-0 ${styles.customScrollbar}`}>
              <div className="p-4 md:p-6">
                {/* Loading State */}
                {isLoading && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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
                )}

                {/* Error State */}
                {error && (
                  <div className="text-center py-12 md:py-16">
                    <div className="max-w-sm mx-auto px-4">
                      <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                      <p className="text-gray-600 text-sm">
                        {error instanceof Error ? error.message : 'Unable to load products. Please try again.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Empty State - No Search Results */}
                {!isLoading && !error && searchQuery && products.length === 0 && (
                  <div className="text-center py-12 md:py-16">
                    <div className="max-w-sm mx-auto px-4">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                        No products found
                      </h3>
                      <p className="text-gray-600 text-sm mb-6">
                        Try searching with different keywords or browse our featured products below.
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium 
                                 rounded-xl hover:bg-red-700 transition-colors duration-200"
                      >
                        Show All Products
                      </button>
                    </div>
                  </div>
                )}

                {/* Empty State - No Products Available */}
                {!isLoading && !error && !searchQuery && products.length === 0 && (
                  <div className="text-center py-12 md:py-16">
                    <div className="max-w-sm mx-auto px-4">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                        No products available
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Please check back later for new products.
                      </p>
                    </div>
                  </div>
                )}

                {/* Product Grid */}
                {!isLoading && !error && products.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {products.map((product: Product, index: number) => (
                      <div
                        key={product._id}
                        className={`transform transition-all duration-300 hover:scale-105 ${styles.fadeInUpAnimation}`}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                        onClick={onClose} // Close modal when product is clicked
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Popular Searches (when no search query) */}
                {!isLoading && !error && !searchQuery && products.length > 0 && (
                  <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                    <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Popular Searches</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Sarees', 'Dress Materials', 'Silk Fabrics', 'Cotton Fabrics', 'Designer Sarees', 'Wedding Collection'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-2 md:px-4 bg-gray-100 text-gray-700 rounded-full text-sm 
                                   hover:bg-red-100 hover:text-red-700 transition-colors duration-200
                                   active:scale-95"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom spacing for mobile */}
                <div className="h-4 md:h-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;