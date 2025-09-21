import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingCart, Eye} from 'lucide-react';
import type { Product} from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

// Mock Link component for demo
const Link = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
  <a href={to} className={className}>{children}</a>
);

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set([0]));
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  // Get product images and optimize them for display
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  
  // Enhanced function to optimize Cloudinary images with multiple formats
  const getOptimizedImageUrl = (url: string, transformation = 'w_400,h_400,c_fill,ar_1:1,g_auto,q_auto,f_auto') => {
    if (url && url.includes('cloudinary.com')) {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/${transformation}/${parts[1]}`;
      }
    }
    return url;
  };

  // Generate different sized images for better loading performance
  const getImageVariants = (url: string) => ({
    thumbnail: getOptimizedImageUrl(url, 'w_200,h_200,c_fill,ar_1:1,g_auto,q_auto,f_auto'),
    main: getOptimizedImageUrl(url, 'w_400,h_400,c_fill,ar_1:1,g_auto,q_auto,f_auto'),
    large: getOptimizedImageUrl(url, 'w_800,h_800,c_fill,ar_1:1,g_auto,q_auto,f_auto')
  });

  const hasMultipleImages = images.length > 1;
  const isLowStock = product.quantity <= 5;
  const isOutOfStock = product.quantity === 0;
  
  const hasDiscount = false;
  const discountPercentage = 0;

  // Preload images for smooth transitions
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (preloadedImages.has(index) || !images[index]) return;
      
      setImageLoadingStates(prev => ({ ...prev, [index]: true }));
      
      const img = new Image();
      const imageUrl = getImageVariants(images[index]).main;
      
      img.onload = () => {
        setPreloadedImages(prev => new Set(prev).add(index));
        setImageLoadingStates(prev => ({ ...prev, [index]: false }));
        if (imageRefs.current[index]) {
          imageRefs.current[index]!.src = imageUrl;
        }
      };
      
      img.onerror = () => {
        setImageLoadingStates(prev => ({ ...prev, [index]: false }));
      };
      
      img.src = imageUrl;
    };

    // Preload current image and adjacent images
    preloadImage(currentImageIndex);
    if (hasMultipleImages) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      preloadImage(nextIndex);
      preloadImage(prevIndex);
    }
  }, [currentImageIndex, images, hasMultipleImages, preloadedImages]);

  // Preload all images on component mount for better UX
  useEffect(() => {
    if (hasMultipleImages) {
      images.forEach((_, index) => {
        if (index !== 0) { // Skip index 0 as it's already preloaded
          setTimeout(() => {
            const img = new Image();
            img.src = getImageVariants(images[index]).main;
          }, index * 100); // Stagger loading
        }
      });
    }
  }, [images, hasMultipleImages]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!hasMultipleImages || touchStartX.current === null || touchEndX.current === null) return;
    
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        nextImage(null);
      } else {
        prevImage(null);
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;
    
    addToCart(product, 1);
    
    showToast({
      type: 'success',
      title: 'Added to Cart!',
      message: `${product.name} has been added to your cart.`,
      duration: 3000
    });
  };

  const nextImage = (e: React.MouseEvent | null) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent | null) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex(index);
  };

  return (
    <div className="group relative w-full sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      {/* Full Image Container with Clickable Link */}
      <Link to={`/products/${product._id}`} className="block">
        <div 
          className="relative overflow-hidden bg-gray-50 aspect-square"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image with Loading State */}
          <div className="relative w-full h-full">
            <img
              ref={el => { imageRefs.current[currentImageIndex] = el; }}
              src={getImageVariants(images[currentImageIndex]).main}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoadingStates[currentImageIndex] ? 'opacity-50' : 'opacity-100'
              } group-hover:scale-105`}
              loading={currentImageIndex === 0 ? "eager" : "lazy"}
              onLoad={() => setImageLoadingStates(prev => ({ ...prev, [currentImageIndex]: false }))}
            />
            
            {/* Loading spinner overlay */}
            {imageLoadingStates[currentImageIndex] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-[#7F1416] rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* Image Navigation for Multiple Images - Desktop */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-white z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-white z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Image Dots - Desktop */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 md:flex space-x-1 hidden">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {hasDiscount && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                -{discountPercentage}%
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                Low Stock
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                Out of Stock
              </span>
            )}
          </div>

          {/* Floating Action Buttons on Image */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={handleWishlistToggle}
              className={`w-9 h-9 rounded-full backdrop-blur-sm shadow-lg transition-colors flex items-center justify-center ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleQuickView}
              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Icon - Bottom Right */}
          <div className="absolute bottom-3 right-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-10 h-10 bg-[#7F1416] text-white  shadow-lg flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-110 transition-transform"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>

      {/* Mobile Rectangle Navigation - Below Image */}
      {hasMultipleImages && (
        <div className="mt-2 md:hidden">
          <div className="flex justify-center space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToImage(index, e)}
                className={`h-1 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-[#7F1416] w-6' 
                    : 'bg-gray-300 w-4 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Product Details Below Image */}
      <div className="mt-3 space-y-2">
        {/* Category and Subcategory */}
        <div className="flex items-center gap-2">
          {product.category?.name && (
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {product.category.name}
            </span>
          )}
          {product.subcategory?.name && (
            <span className="text-xs text-[#7F1416] bg-red-50 px-2 py-1 rounded-full">
              {product.subcategory.name}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price ? product.price.toLocaleString() : '0'}
          </span>
          <span className="text-xs text-gray-500">
            per {product.unit || 'meter'}
          </span>
        </div>

        {/* Design Number */}
        {product.designNo && (
          <p className="text-xs text-gray-500">Design: {product.designNo}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;