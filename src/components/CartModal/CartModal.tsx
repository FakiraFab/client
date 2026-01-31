import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart, type CartItem } from '../../context/CartContext';
import EnquiryForm from '../EnquiryForm/EnquiryForm';
import type { Enquiry } from '../../types';

const CartModal: React.FC = () => {
  const { state, removeFromCart, updateQuantity, closeCart, getCartTotal } = useCart();
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);

  const handleQuantityChange = (item: CartItem, change: number) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateQuantity(item.id, newQuantity);
  };

  const handleBuyNow = (item: CartItem) => {
    setSelectedCartItem(item);
    setIsEnquiryFormOpen(true);
  };

  const handleEnquirySubmit = async (enquiry: Enquiry) => {
    // This will be handled by the parent component
    console.log('Enquiry submitted from cart:', enquiry);
    setIsEnquiryFormOpen(false);
    setSelectedCartItem(null);
  };

  const closeEnquiryForm = () => {
    setIsEnquiryFormOpen(false);
    setSelectedCartItem(null);
  };

  const getItemPrice = (item: CartItem): number => {
    if (item.selectedVariant !== undefined && item.selectedVariant >= 0 && item.product.variants) {
      const variant = item.product.variants[item.selectedVariant];
      if (variant && variant.price) {
        return variant.price;
      }
    }
    return item.product.price;
  };

  const getItemImage = (item: CartItem): string => {
    if (item.selectedVariant !== undefined && item.selectedVariant >= 0 && item.product.variants) {
      const variant = item.product.variants[item.selectedVariant];
      if (variant && variant.images && variant.images.length > 0) {
        return variant.images[0];
      }
    }
    return item.product.imageUrl;
  };

  const getItemColor = (item: CartItem): string => {
    if (item.selectedVariant !== undefined && item.selectedVariant >= 0 && item.product.variants) {
      const variant = item.product.variants[item.selectedVariant];
      if (variant && variant.color) {
        return variant.color;
      }
    }
    return item.product.specifications?.color || 'Default';
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Cart Modal */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
          onClick={closeCart}
        />

        {/* Modal */}
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700 text-white">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-6 w-6" />
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                  {state.items.length}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close cart"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some products to get started!</p>
                  <button
                    onClick={closeCart}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <Link to={`/products/${item.product._id}`} onClick={closeCart}>
                            <img
                              src={getItemImage(item)}
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                          </Link>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item.product._id}`} onClick={closeCart}>
                            <h3 className="text-sm font-medium text-gray-900 truncate hover:text-red-600 transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          
                          {item.selectedVariant !== undefined && item.selectedVariant >= 0 && (
                            <p className="text-xs text-gray-600 mt-1">
                              Color: {getItemColor(item)}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-red-600">
                              ₹{getItemPrice(item).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">per metre</span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 mt-3">
                            <button
                              onClick={() => handleQuantityChange(item, -1)}
                              className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, 1)}
                              className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                            <span className="text-sm font-medium text-gray-700">
                              Total: ₹{(getItemPrice(item) * item.quantity).toLocaleString()}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleBuyNow(item)}
                                className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-1"
                              >
                                <span>Buy Now</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-red-600">
                    ₹{getCartTotal().toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={closeCart}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Free shipping on orders over ₹999
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enquiry Form Modal */}
      {selectedCartItem && (
        <EnquiryForm
          isOpen={isEnquiryFormOpen}
          onClose={closeEnquiryForm}
          productId={selectedCartItem.product._id}
          productName={selectedCartItem.product.name}
          selectedVariant={getItemColor(selectedCartItem)}
          defaultQuantity={selectedCartItem.quantity}
          productImage={getItemImage(selectedCartItem)}
          onSubmit={handleEnquirySubmit}
        />
      )}
    </>
  );
};

export default CartModal;

