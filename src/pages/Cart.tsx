import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo/Seo';
import { ShoppingCart, X, Check, Clock, Info, Plus, Minus } from 'lucide-react';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { state, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (state.items.length === 0) {
    return (
      <>
        <Seo title="Shopping Cart - Fakira Fab" description="Your shopping cart" />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center py-16">
              <ShoppingCart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <Link
                to="/all-products"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Shopping Cart - Fakira Fab" description="Your shopping cart" />
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {state.items.map((item) => {
                const price = item.selectedVariant !== undefined && item.selectedVariant >= 0 && item.product.variants
                  ? item.product.variants[item.selectedVariant]?.price || item.product.price
                  : item.product.price;

                // Determine stock status (you can customize this based on your product data)
                const inStock = item.product.inStock !== false;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Product Image */}
                      <Link
                        to={`/products/${item.product._id}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={
                            item.selectedVariant !== undefined && item.selectedVariant >= 0 && item.product.variants?.[item.selectedVariant]?.images?.[0]
                              ? item.product.variants[item.selectedVariant].images[0]
                              : item.product.images?.[0] || item.product.imageUrl
                          }
                          alt={item.product.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div className="flex-1 min-w-0 pr-4">
                            <Link
                              to={`/products/${item.product._id}`}
                              className="text-base sm:text-lg font-medium text-gray-900 hover:text-red-600 transition-colors block"
                            >
                              {item.product.name}
                            </Link>
                            
                            {item.selectedColor && (
                              <p className="text-sm text-gray-600 mt-1">
                                {item.selectedColor}
                              </p>
                            )}

                            {/* Price */}
                            <p className="text-base sm:text-lg font-medium text-gray-900 mt-2">
                              ₹{price.toLocaleString()}
                            </p>

                            {/* Stock Status */}
                            <div className="mt-2 sm:mt-3">
                              {inStock ? (
                                <div className="flex items-center text-sm text-green-600">
                                  <Check className="h-4 w-4 mr-1" />
                                  <span>In stock</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>Ships in 3-4 weeks</span>
                                </div>
                              )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="mt-3 sm:mt-4 flex items-center gap-3">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors h-fit"
                            aria-label="Remove item"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Order summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{getCartTotal().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <span>Shipping estimate</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-900">₹50.00</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <span>Tax estimate</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-900">₹{Math.round(getCartTotal() * 0.18).toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-medium text-gray-900">
                    <span>Order total</span>
                    <span>₹{(getCartTotal() + 50 + Math.round(getCartTotal() * 0.18)).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
                >
                  Checkout
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    or{' '}
                    <Link
                      to="/all-products"
                      className="font-medium text-red-600 hover:text-red-500"
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
