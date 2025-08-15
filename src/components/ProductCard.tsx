import React, { useState } from 'react';
// import { Heart, ShoppingCart, Eye, Star, Truck } from 'lucide-react';
import { Heart, ShoppingCart, Eye} from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import QuickView from './QuickView';
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
  // const [showQuickView, setShowQuickView] = useState(false);

  console.log(product);

  // const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const hasMultipleImages = images.length > 1;
  const isLowStock = product.quantity <= 5;
  const isOutOfStock = product.quantity === 0;
  
  // Calculate discount if there are variants with different prices
  // const originalPrice = null; // Variants don't have price in global types
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
    // setShowQuickView(true);
  };

  // const handleQuickViewClose = () => setShowQuickView(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;
    
    // Add to cart with default quantity 1
    addToCart(product, 1);
    
    // Show success toast
    showToast({
      type: 'success',
      title: 'Added to Cart!',
      message: `${product.name} has been added to your cart.`,
      duration: 3000
    });
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
    <div className="group relative">
      {/* Full Image Container with Clickable Link */}
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative overflow-hidden bg-gray-50 h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[400px]">
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

          {/* Floating Action Buttons on Image */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
          <div className="absolute bottom-3 right-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-10 h-10 bg-[#7F1416] text-white rounded-full shadow-lg flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-110 transition-transform"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Details Below Image - No Background */}
      <div className="mt-3 space-y-2">
        {/* Category and Subcategory */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {product.category.name}
          </span>
          {product.subcategory.name && (
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
            per meter
          </span>
        </div>

        {/* Design Number */}
        {product.designNo && (
          <p className="text-xs text-gray-500">Design: {product.designNo}</p>
        )}
      </div>

      {/* Quick View Component */}
      {/* <QuickView 
        product={product}
        isOpen={showQuickView}
        onClose={handleQuickViewClose}
      /> */}
    </div>
  );
};

export default ProductCard;