
import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Product } from '../types';
import FilterTabs from '../components/FilterTabs/FilterTabs';
import Seo from '../components/Seo/Seo';
import JsonLd from '../components/Seo/JsonLd';
import FilterDrawer, { type FilterState } from '../components/FilterDrawer';
import { SlidersHorizontal } from 'lucide-react';

const fetchProductsByCategory = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: (string | undefined | FilterState)[];
}) => {
  const [, categoryId, type, filters, sortBy] = queryKey as [string, string | undefined, string, FilterState, string];
  if (!categoryId) return { 
    success: true, 
    data: [], 
    filters: { subCategories: [] }, 
    pagination: { total: 0, page: 1, pages: 1 } 
  };

  // Build query params from filters
  let query = type === 'All' ? '' : `&subcategory=${type}`;
  
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

  const res = await apiClient.get(`/products?category=${categoryId}${query}&page=${pageParam}&limit=12`);
  return res.data;
};

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'Featured');
  const [imageError, setImageError] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
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
    queryKey: ['products', categoryId, selectedType, filters, sortBy],
    queryFn: fetchProductsByCategory,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      return lastPage.pagination.page < lastPage.pagination.pages ? lastPage.pagination.page + 1 : undefined;
    },
    enabled: !!categoryId,
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

  // Handle filter changes with loading state
  const handleFilterChange = (newType: string) => {
    setIsFiltering(true);
    setSelectedType(newType);
    // Reset filtering state after a short delay to show loading
    setTimeout(() => setIsFiltering(false), 500);
  };

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
    const params = new URLSearchParams(searchParams);
    if (sortBy !== 'Featured') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }
    // Preserve existing filter params
    if (filters.subcategory) params.set('subcategory', filters.subcategory);
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.colors && filters.colors.length > 0) {
      params.delete('color');
      filters.colors.forEach(color => params.append('color', color));
    }
    setSearchParams(params, { replace: true });
  }, [sortBy]);

  // Sort products based on selected sort option
  const sortedProducts = React.useMemo(() => {
    if (!data?.pages) return [];
    
    const products = data.pages.flatMap(page => page.data);
    
    switch (sortBy) {
      case 'Price: Low to High':
        return products.sort((a, b) => a.price - b.price);
      case 'Price: High to Low':
        return products.sort((a, b) => b.price - a.price);
      case 'Newest':
        return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'Best Selling':
        return products.sort((a, b) => b.quantity - a.quantity);
      case 'Featured':
      default:
        return products;
    }
  }, [data?.pages, sortBy]);


  const displayDescription = data?.pages[0]?.category?.description || 
    `Explore our exclusive collection of premium ${categoryId?.replace(/-/g, ' ').toLowerCase()} designed to elevate your style and comfort.`;

  const displayCategoryName = data?.pages[0]?.category?.name || 
    categoryId?.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const categoryBannerImage = data?.pages[0]?.category?.categoryBannerImage || 
    "https://www.fabvoguestudio.com/cdn/shop/collections/co-fresh-designs.jpg?v=1742118562&width=1950";

  // SEO values
  const canonicalUrl = `https://www.fakirafab.com/category/${categoryId || ''}`;
  const pageTitle = `${displayCategoryName} | Handmade ${displayCategoryName} Online | Fakira FAB`;
  const pageDesc = displayDescription;
  const ogImage = categoryBannerImage;
  const keywords = `handmade ${displayCategoryName}, ${displayCategoryName} online, block print, artisan, women clothing, Fakira FAB, premium textiles`;

  // JSON-LD schemas
  const jsonLdSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": displayCategoryName,
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
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.fakirafab.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": displayCategoryName,
          "item": canonicalUrl
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Seo
        title={pageTitle}
        description={pageDesc}
        url={canonicalUrl}
        image={ogImage}
        type="website"
        keywords={keywords}
        imageAlt={`Handmade ${displayCategoryName} at Fakira FAB`}
      />
      <JsonLd data={jsonLdSchemas} />
      {/* Hero Header Section */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        {/* Category Background Image */}
        {!imageError ? (
          <img 
            src={categoryBannerImage} 
            alt={displayCategoryName}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <img 
            src="https://www.fabvoguestudio.com/cdn/shop/collections/co-fresh-designs.jpg?v=1742118562&width=1950" 
            alt="Category Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 tracking-tight">
              {displayCategoryName}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {displayDescription}
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-40 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FilterTabs 
            categoryId={categoryId} 
            selectedType={selectedType} 
            onSelect={handleFilterChange} 
            subCategories={data?.pages[0]?.filters?.subCategories || []} 
          />
        </div>
      </div>

      {/* Loading State */}
      {(isLoading || isFiltering) && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-[#7F1416] border-t-transparent rounded-full animate-spin"></div>
              <span>{isFiltering ? 'Applying filters...' : 'Loading products...'}</span>
            </div>
          </div>
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
        {/* Results Summary */}
        {!isLoading && !isFiltering && sortedProducts && sortedProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {(filters.minPrice !== undefined || filters.maxPrice !== undefined || (filters.colors && filters.colors.length > 0) || filters.subcategory) && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold text-white bg-purple-600 rounded-full">
                      {[
                        filters.subcategory ? 1 : 0,
                        filters.minPrice !== undefined ? 1 : 0,
                        filters.maxPrice !== undefined ? 1 : 0,
                        (filters.colors?.length || 0)
                      ].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </button>
                <p className="text-gray-600 text-sm sm:text-base">
                  Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
                  {selectedType !== 'All' && (
                    <span className="ml-1">in <span className="font-semibold text-gray-900">{selectedType}</span></span>
                  )}
                  {sortBy !== 'Featured' && (
                    <span className="ml-1">sorted by <span className="font-semibold text-gray-900">{sortBy}</span></span>
                  )}
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
                  <option value="Featured">Featured</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest">Newest</option>
                  <option value="Best Selling">Best Selling</option>
                </select>
              </div>
            </div>
          </div>
        )}

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
        {!isLoading && !isFiltering && !error && sortedProducts?.length === 0 && (
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
                {selectedType !== 'All' 
                  ? `We couldn't find any products in the "${selectedType}" category. Try selecting a different filter or browse all products.`
                  : 'We couldn\'t find any products in this category. Try browsing other categories or check back later.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => handleFilterChange('All')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#7F1416] to-[#7F1416] text-white font-medium rounded-xl hover:from-[#7F1416] hover:to-[#7F1416] transition-all duration-200 transform hover:scale-105"
                >
                  View All Products
                </button>
                {selectedType !== 'All' && (
                  <button 
                    onClick={() => handleFilterChange('All')}
                    className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-[#7F1416] hover:text-[#7F1416] transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Product Grid - Enhanced for Mobile (2 columns) and Desktop */}
        {!isLoading && !isFiltering && !error && sortedProducts && sortedProducts.length > 0 && (
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

      <style>{`
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
      `}</style>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        initialFilters={filters}
        availableFilters={{
          subcategories: data?.pages[0]?.filters?.subCategories || [],
          colors: ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Pink', 'Purple', 'Orange', 'Brown'],
        }}
      />
    </div>
  );
};

export default CategoryPage;