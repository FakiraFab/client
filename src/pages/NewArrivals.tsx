import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import type { Product } from '../types';
import Seo from '../components/Seo/Seo';
import JsonLd from '../components/Seo/JsonLd';
import { FaqSection } from '../components/StaticSections';
import CircularImageFilter from '../components/CircularImageFilter';

// Fetch new arrivals - products created in the last 2 weeks
const fetchNewArrivals = async (): Promise<Product[]> => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const res = await apiClient.get('/products', {
    params: {
      createdAt: {
        $gte: twoWeeksAgo.toISOString(),
      },
      sort: '-createdAt',
      limit: 50, // Fetch more products for a full page experience
    },
  });
  return res.data.data;
};

const NewArrivals: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('featured');
  const navigate = useNavigate();

  const {
    data: productsData = [] as Product[],
    isLoading,
    error
  } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: fetchNewArrivals,
  });

  // Sort products based on selected option
  const sortedProducts = React.useMemo(() => {
    if (!productsData) return [];
    
    const products = [...productsData];
    
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
  }, [productsData, sortBy]);

  // Map products to ensure all required fields are present
  const mappedProducts = sortedProducts.map((product: Product) => ({
    _id: product._id,
    name: product.name,
    subcategory: product.subcategory,
    category: product.category,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl || 'https://via.placeholder.com/800',
    quantity: product.quantity || 0,
    options: product.options,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    __v: product.__v,
    images: product.images,
    variants: product.variants,
    unit: product.unit,
    specifications: product.specifications,
    fullDescription: product.fullDescription,
    material: product.material,
    style: product.style,
    length: product.length,
    blousePiece: product.blousePiece,
    designNo: product.designNo,
  }));

  // SEO values
  const pageTitle = "New Arrivals | Latest Handmade Fabrics, Sarees & Designs | Fakira FAB";
  const pageDesc = 'Explore our newest collection of hand-block-printed sarees, unstitched fabrics, suit pieces, and more. Discover the latest arrivals from Fakira Fab—fresh designs, premium quality, handcrafted with love.';
  const canonicalUrl = 'https://www.fakirafab.com/new-arrivals';
  const ogImage = 'https://www.fakirafab.com/og-new-arrivals.jpg';
  const keywords = 'new arrivals, latest designs, handmade fabrics, new sarees, latest collections, block print, Fakira FAB, new products, fresh designs';

  // JSON-LD schema for CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "New Arrivals",
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
        imageAlt="New Arrivals at Fakira FAB - Latest Handmade Fabrics & Sarees"
      />
      <JsonLd data={jsonLd} />
      
      {/* Hero Header Section */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        {/* Category Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFicmljJTIwZGVzaWdufGVufDB8fDB8fHww&auto=format&fit=crop&w=1470&q=80" 
          alt="New Arrivals Background" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 tracking-tight">
              New Arrivals
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover our latest collection of handcrafted fabrics, sarees, and designs
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-40 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Circular Image Filter Section */}
      <CircularImageFilter
        categories={[
          {
            name: "Sarees",
            img: "https://res.cloudinary.com/dhkaucebl/image/upload/w_400,h_400,c_fill,ar_1:1,g_auto,q_auto,f_auto/v1760011020/sp0kuh8ihnbdcnmnwlcz.jpg",
            value: "Sarees"
          },
          {
            name: "Fabrics",
            img: "https://res.cloudinary.com/dtst7rqhw/image/upload/v1758265744/6226250966609545720_h7uygy.jpg",
            value: "Unstitch Fabrics"
          },
          {
            name: "Dupattas",
            img: "https://res.cloudinary.com/dhkaucebl/image/upload/w_400,h_400,c_fill,ar_1:1,g_auto,q_auto,f_auto/v1760008642/dlc9gmerxvazwwmi1uqt.jpg",
            value: "dupattas"
          },
          {
            name: "Bedsheets",
            img: "https://res.cloudinary.com/dhkaucebl/image/upload/w_400,h_400,c_fill,ar_1:1,g_auto,q_auto,f_auto/v1764936905/hjtuhrf6cayxlko41ap9.jpg",
            value: "Bed Sheets"
          },
        //   {
        //     name: "All",
        //     img: "https://images.unsplash.com/photo-1558769132-cb1aea42c838?w=400&h=400&fit=crop",
        //     value: ""
        //   },
        ]}
        onCategorySelect={(category) => {
          if (category.value) {
            navigate(`/category/${category.value}`);
          }
        }}
      />

      {/* Filter and Sort Section */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-0">
              Showing <span className="font-semibold text-gray-900">{mappedProducts.length}</span> new products
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
                {error instanceof Error ? error.message : 'Unable to load new arrivals. Please try again.'}
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
        {!isLoading && !error && mappedProducts.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                No new arrivals yet
              </h3>
              <p className="text-gray-600 mb-6">
                We don't have any new arrivals at the moment. Check back soon for fresh designs!
              </p>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && mappedProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {mappedProducts.map((product: Product, index: number) => (
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
      </div>
      
      <FaqSection />
    </div>
  );
};

export default NewArrivals;
