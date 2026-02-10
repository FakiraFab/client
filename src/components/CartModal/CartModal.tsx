import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
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
      <div className="relative z-50">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out"
          onClick={closeCart}
        />

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              {/* Modal Panel */}
              <div className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out">
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  
                  {/* Content Area */}
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        
                        <ShoppingBag className="h-6 w-6 text-gray-900" />
                        {/* <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2> */}
                        {/* provide icon for cart link and redirect cart page */}
                        <h2 className="text-lg font-medium text-gray-900">
                          <Link to="/cart" onClick={closeCart} className="hover:text-red-600 transition-colors">
                            Shopping Cart
                          </Link>
                        </h2>
                      </div>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={closeCart}
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" aria-hidden="true"  />
                        </button>
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="mt-8">
                      {state.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                          <h3 className="text-base font-medium text-gray-900 mb-2">Your cart is empty</h3>
                          <p className="text-sm text-gray-500">Add some products to get started!</p>
                        </div>
                      ) : (
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {state.items.map((item) => (
                              <li key={item.id} className="flex py-6">
                                {/* Product Image */}
                                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <Link to={`/products/${item.product._id}`} onClick={closeCart}>
                                    <img
                                      src={getItemImage(item)}
                                      alt={item.product.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </Link>
                                </div>

                                {/* Product Details */}
                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link 
                                          to={`/products/${item.product._id}`} 
                                          onClick={closeCart}
                                          className="hover:text-red-600 transition-colors"
                                        >
                                          {item.product.name}
                                        </Link>
                                      </h3>
                                      <p className="ml-4">₹{getItemPrice(item).toLocaleString()}</p>
                                    </div>
                                    {item.selectedVariant !== undefined && item.selectedVariant >= 0 && (
                                      <p className="mt-1 text-sm text-gray-500">{getItemColor(item)}</p>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleQuantityChange(item, -1)}
                                        disabled={item.quantity <= 1}
                                        className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                                      >
                                        <Minus className="h-4 w-4 text-gray-600" />
                                      </button>
                                      <span className="text-gray-500">Qty {item.quantity}</span>
                                      <button
                                        onClick={() => handleQuantityChange(item, 1)}
                                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                                      >
                                        <Plus className="h-4 w-4 text-gray-600" />
                                      </button>
                                    </div>

                                    <div className="flex space-x-2">
                                      {/* Buy Now Button */}
                                      <button
                                        onClick={() => handleBuyNow(item)}
                                        className="font-medium text-red-600 hover:text-red-500 flex items-center space-x-1"
                                      >
                                        <span>Buy Now</span>
                                        <ArrowRight className="h-3 w-3" />
                                      </button>
                                      
                                      {/* Remove Button */}
                                      <button
                                        type="button"
                                        onClick={() => removeFromCart(item.id)}
                                        className="font-medium text-red-600 hover:text-red-500"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  {state.items.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>₹{getCartTotal().toLocaleString()}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            // Handle checkout - you can implement this based on your needs
                            console.log('Proceed to checkout');
                          }}
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
                        >
                          Checkout
                        </button>
                      </div>
                      
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            onClick={closeCart}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
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

