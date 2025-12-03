
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Product } from '../types';
import Seo from '../components/Seo/Seo';
import JsonLd from '../components/Seo/JsonLd';
import FilterDrawer, { type FilterState } from '../components/FilterDrawer';
import { SlidersHorizontal } from 'lucide-react';
import { AVAILABLE_COLORS, getActiveFilterCount } from '../utils/filterUtils';

// Fetch all products with pagination
const fetchAllProducts = async ({ 
  pageParam = 1,
  queryKey,
}: { 
  pageParam?: number;
  queryKey: (string | FilterState)[];
}) => {
  const [, filters, sortBy] = queryKey as [string, FilterState, string];
  
  // Build query params from filters
  let query = '';
  
  // Add filter params if they exist
  if (filters.subcategory) {
    query += `&subcategory=${filters.subcategory}`;
  }
  if (filters.minPrice !== undefined) {
    query += `&minPrice=${filters.minPrice}`;
  }
  if (filters.maxPrice !== undefined) {
    query += `&maxPrice=${filters.maxPrice}`;
  }
  if (filters.colors && filters.colors.length > 0) {
    filters.colors.forEach(color => {
      query += `&color=${color}`;
    });
  }
  if (filters.attributes) {
    Object.entries(filters.attributes).forEach(([attrName, values]) => {
      values.forEach(value => {
        query += `&${attrName}=${value}`;
      });
    });
  }
  if (sortBy && sortBy !== 'Featured') {
    query += `&sort=${sortBy}`;
  }

  const res = await apiClient.get(`/products?page=${pageParam}&limit=12${query}`);
  return res.data;
};

const AllProducts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'Featured');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    subcategory: searchParams.get('subcategory') || undefined,
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    colors: searchParams.getAll('color').length > 0 ? searchParams.getAll('color') : undefined,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['allProducts', filters, sortBy],
    queryFn: fetchAllProducts,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      return lastPage.pagination.page < lastPage.pagination.pages ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Intersection Observer for infinite scroll
  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Handle drawer filter apply
  const handleApplyFilters = (newFilters: FilterState) => {
    setIsFiltering(true);
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.subcategory) params.set('subcategory', newFilters.subcategory);
    if (newFilters.minPrice !== undefined) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice !== undefined) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.colors && newFilters.colors.length > 0) {
      newFilters.colors.forEach(color => params.append('color', color));
    }
    if (sortBy !== 'Featured') params.set('sort', sortBy);
    
    setSearchParams(params);
    setTimeout(() => setIsFiltering(false), 500);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setIsFiltering(true);
    setFilters({});
    setSearchParams({});
    setTimeout(() => setIsFiltering(false), 500);
  };

  // Sync sortBy with URL
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (sortBy !== 'Featured') {
      params.set('sort', sortBy);
    }
    // Preserve existing filter params
    if (filters.subcategory) params.set('subcategory', filters.subcategory);
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.colors && filters.colors.length > 0) {
      filters.colors.forEach(color => params.append('color', color));
    }
    setSearchParams(params, { replace: true });
  }, [sortBy, filters, setSearchParams]);

  // Sort products based on selected option
  const sortedProducts = React.useMemo(() => {
    if (!data?.pages) return [];
    
    const products = data.pages.flatMap(page => page.data);
    
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
  }, [data?.pages, sortBy]);

  // SEO values
  const pageTitle = "All Products | Handmade Fabrics, Sarees, Dresses & Men's Wear | Fakira FAB";
  const pageDesc = 'Discover authentic hand-block-printed sarees, unstitched fabrics, suit pieces, dupattas, bedsheets, and men’s clothing at Fakira Fab—premium quality, timeless designs, handcrafted with love.';
  const canonicalUrl = 'https://www.fakirafab.com/all-products';
  const ogImage = 'https://www.fakirafab.com/og-all-products.jpg';
  const keywords = 'handmade fabrics, sarees, dress materials, women clothing, artisan, block print, Fakira FAB, premium textiles, accessories';

  // JSON-LD schema for CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "All Products",
    "description": pageDesc,
    "url": canonicalUrl,
    "image": ogImage,
    "keywords": keywords,
    "publisher": {
      "@type": "Organization",
      "name": "Fakira FAB",
      "url": "https://www.fakirafab.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.fakirafab.com/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Seo
        title={pageTitle}
        description={pageDesc}
        url={canonicalUrl}
        image={ogImage}
        type="website"
        keywords={keywords}
        imageAlt="All products at Fakira FAB - Handmade Fabrics, Sarees, Dresses & More"
      />
      <JsonLd data={jsonLd} />
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
              <div className="w-40 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Section */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {getActiveFilterCount(filters) > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold text-white bg-purple-600 rounded-full">
                    {getActiveFilterCount(filters)}
                  </span>
                )}
              </button>
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
              </p>
            </div>
            
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
      {(isLoading || isFiltering) && (
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

        {/* Infinite Scroll Loading Indicator */}
        {!error && (hasNextPage || isFetchingNextPage) && (
          <div 
            ref={observerTarget}
            className="mt-8 sm:mt-12 text-center p-4"
          >
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-[#7F1416] border-t-transparent rounded-full animate-spin"></div>
              <span>{isFetchingNextPage ? 'Loading more products...' : 'Load more products'}</span>
            </div>
          </div>
        )}
      </div>

      

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        initialFilters={filters}
        availableFilters={{
          colors: AVAILABLE_COLORS,
        }}
      />

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
