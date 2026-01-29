import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo/Seo';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => {
                const price = item.selectedVariant !== undefined && item.selectedVariant >= 0 && item.product.variants
                  ? item.product.variants[item.selectedVariant]?.price || item.product.price
                  : item.product.price;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
                  >
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
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      
                      {item.selectedColor && (
                        <p className="text-sm text-gray-600 mt-1">
                          Color: {item.selectedColor}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-lg font-bold text-gray-900">
                          ₹{(price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({state.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹50</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18% GST)</span>
                    <span>₹{Math.round(getCartTotal() * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{(getCartTotal() + 50 + Math.round(getCartTotal() * 0.18)).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/all-products"
                  className="block text-center text-red-600 font-medium mt-4 hover:text-red-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
