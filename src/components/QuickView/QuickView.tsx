import React from 'react';
import { X, ShoppingCart, Heart, Star, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickView: React.FC<QuickViewProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!product || !isOpen) return null;

  const productId = product._id;
  const productImage = product.imageUrl;
  const stockQuantity = product.quantity || 0;
  
  // Calculate discount if there are variants with different prices
  // const originalPrice = null; // Variants don't have price in global types
  const hasDiscount = false; // No discount calculation possible with current variant structure
  const discountPercentage = 0;

  const handleBuyNow = () => {
    if (productId) {
      navigate(`/products/${productId}`);
      onClose();
    }
  };

  const handleViewDetails = () => {
    if (productId) {
      navigate(`/products/${productId}`);
      onClose();
    }
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', productId);
  };

  const handleAddToCart = () => {
    if (stockQuantity === 0) return;
    
    // Add to cart with default quantity 1
    addToCart(product, 1);
    
    // Show success toast and close modal
    showToast({
      type: 'success',
      title: 'Added to Cart!',
      message: `${product.name} has been added to your cart.`,
      duration: 3000
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white h-full w-full max-w-md sm:max-w-lg lg:max-w-2xl shadow-2xl transform transition-transform duration-300 ease-in-out animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quick View</h2>
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl sm:text-3xl font-bold transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Content */}
        <div className="p-4 sm:p-6 overflow-y-auto h-full">
          <div className="space-y-4 sm:space-y-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl bg-gray-50 shadow-lg"
                />
                {/* Discount Badge */}
                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full shadow-lg">
                    -{discountPercentage}% OFF
                  </span>
                )}
                {/* Stock Status Badge */}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium text-white shadow-lg ${
                  stockQuantity === 0 ? 'bg-red-500' : 
                  stockQuantity <= 5 ? 'bg-orange-500' : 'bg-green-500'
                }`}>
                  {stockQuantity === 0 ? 'Out of Stock' : 
                   stockQuantity <= 5 ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-red-300 transition-colors duration-200 cursor-pointer flex-shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h3>
              
              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-red-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
                  per metre
                </span>
              </div>

              {/* Stock Information */}
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${
                  stockQuantity === 0 ? 'bg-red-400' : 
                  stockQuantity <= 5 ? 'bg-orange-400' : 'bg-green-400'
                }`} />
                <span className="text-gray-700">
                  {stockQuantity === 0 ? 'Out of stock' : `${stockQuantity} metres available`}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Description</h4>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {product.description || 'A beautiful handcrafted product featuring traditional designs and premium quality materials. Perfect for special occasions and everyday wear.'}
                </p>
              </div>

              {/* Product Specifications */}
              {(product.material || product.style || product.length || product.designNo) && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {product.material && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-xs text-gray-600 block">Material</span>
                        <p className="font-medium text-gray-900 text-sm">{product.material}</p>
                      </div>
                    )}
                    {product.style && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-xs text-gray-600 block">Style</span>
                        <p className="font-medium text-gray-900 text-sm">{product.style}</p>
                      </div>
                    )}
                    {product.length && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-xs text-gray-600 block">Length</span>
                        <p className="font-medium text-gray-900 text-sm">{product.length}</p>
                      </div>
                    )}
                    {product.designNo && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-xs text-gray-600 block">Design No</span>
                        <p className="font-medium text-gray-900 text-sm">{product.designNo}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddToWishlist}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:border-red-300 hover:text-red-600 flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Wishlist</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={stockQuantity === 0}
                  className="flex-1 bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Add to Cart</span>
                </button>
              </div>

              {/* Main Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 text-base sm:text-lg transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleBuyNow}
                  disabled={stockQuantity === 0}
                >
                  {stockQuantity === 0 ? 'Out of Stock' : 'Buy Now'}
                </button>
                <button
                  className="w-full bg-white border-2 border-red-900 text-red-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 text-base sm:text-lg hover:bg-red-50 transform hover:scale-105"
                  onClick={handleViewDetails}
                >
                  View Full Details
                </button>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>Free delivery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <span>4.5 (234 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default QuickView;
