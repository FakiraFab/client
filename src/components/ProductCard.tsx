import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Star, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuickView from './QuickView';
import type { Product} from '../types';
// import type { Product, ProductOption, ProductVariant, ProductSpecifications } from '../types';

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
  const [showQuickView, setShowQuickView] = useState(false);

  const navigate = useNavigate();
  
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const hasMultipleImages = images.length > 1;
  const isLowStock = product.quantity <= 5;
  const isOutOfStock = product.quantity === 0;
  
  // Calculate discount if there are variants with different prices
  const originalPrice = null; // Variants don't have price in global types
  const hasDiscount = false; // No discount calculation possible with current variant structure
  const discountPercentage = 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleQuickViewClose = () => setShowQuickView(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product._id}`);
    
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/products/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50">
          <div className="aspect-square relative">
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Image Navigation for Multiple Images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
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
            <div className="absolute top-3 left-3 flex flex-col gap-2">
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

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleWishlistToggle}
                className={`w-10 h-10 rounded-full backdrop-blur-sm shadow-lg transition-colors flex items-center justify-center ${
                  isWishlisted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleQuickView}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Add to Cart - Mobile */}
            <div className="md:hidden absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-12 h-12 bg-[#7F1416] from-red-900 to-red-800 text-white rounded-full shadow-lg flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-110 transition-transform"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-4">
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.category.name}
            </span>
            {product.material && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {product.material}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Design Number */}
          {product.designNo && (
            <p className="text-xs text-gray-500 mb-2">Design: {product.designNo}</p>
          )}

          {/* Price Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price ? product.price.toLocaleString() : '0'}
              </span>
              {hasDiscount && originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price ? product.price.toLocaleString() : '0'}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
              per metre
            </span>
          </div>

          {/* Stock and Shipping Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                isOutOfStock ? 'bg-red-400' : 
                isLowStock ? 'bg-orange-400' : 'bg-green-400'
              }`} />
              <span>
                {isOutOfStock ? 'Out of stock' : `${product.quantity}m available`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>Free delivery</span>
            </div>
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-3 h-3 fill-current text-yellow-400" 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">4.5 (234)</span>
          </div>

          {/* Add to Cart Button - Desktop */}
          <div className="hidden md:block">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full bg-[#7F1416] from-red-900 to-red-800 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>

      {/* Quick View Component */}
      <QuickView 
        product={product}
        isOpen={showQuickView}
        onClose={handleQuickViewClose}
      />
    </div>
  );
};

export default ProductCard;