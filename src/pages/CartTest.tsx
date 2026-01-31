import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CartTest: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const { state, addToCart, removeFromCart, clearCart, getCartItemCount, getCartTotal, cartMode } = useCart();

  // Mock product for testing
  const mockProduct = {
    _id: 'test-product-1',
    name: 'Test Handloom Saree',
    description: 'Beautiful test saree for cart testing',
    price: 2500,
    imageUrl: 'https://via.placeholder.com/150',
    quantity: 10,
    options: [],
    category: { _id: 'cat-1', name: 'Sarees' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };

  const handleLogin = async () => {
    try {
      await login('test@example.com');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(mockProduct, 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Hybrid Cart System Test Page
          </h1>
          <div className="flex gap-4 items-center">
            <div className={`px-4 py-2 rounded-lg ${cartMode === 'GUEST' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
              <strong>Cart Mode:</strong> {cartMode}
            </div>
            <div className={`px-4 py-2 rounded-lg ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              <strong>Auth Status:</strong> {isAuthenticated ? 'Logged In' : 'Guest'}
            </div>
            {user && (
              <div className="px-4 py-2 rounded-lg bg-purple-100 text-purple-800">
                <strong>User:</strong> {user.email}
              </div>
            )}
          </div>
        </div>

        {/* Auth Controls */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Authentication</h2>
          <div className="flex gap-4">
            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Mock Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            {!isAuthenticated 
              ? 'Login to test cart merge functionality. Any items in your guest cart will be merged with backend cart.'
              : 'Logout to switch back to guest mode. Cart will be cleared from backend but items will be stored locally.'
            }
          </p>
        </div>

        {/* Cart Controls */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cart Operations</h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Add Test Item to Cart
            </button>
            <button
              onClick={clearCart}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Clear Cart
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-blue-600">{getCartItemCount()}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cart Total</p>
              <p className="text-2xl font-bold text-purple-600">₹{getCartTotal().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Cart Items Display */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Cart Items ({state.items.length})
          </h2>
          {state.items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Cart is empty</p>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} × ₹{item.product.price}
                      </p>
                      <p className="text-sm text-gray-400">ID: {item.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(item.quantity * item.product.price).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LocalStorage Inspector */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">LocalStorage State</h2>
          <div className="bg-gray-50 p-4 rounded font-mono text-sm overflow-auto">
            <div className="mb-2">
              <strong>fakira-cart:</strong>{' '}
              {localStorage.getItem('fakira-cart') || 'null'}
            </div>
            <div className="mb-2">
              <strong>fakira-auth-token:</strong>{' '}
              {localStorage.getItem('fakira-auth-token') || 'null'}
            </div>
            <div>
              <strong>fakira-user:</strong>{' '}
              {localStorage.getItem('fakira-user') || 'null'}
            </div>
          </div>
        </div>

        {/* Test Scenarios */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Scenarios</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              <strong>Guest Cart:</strong> Add items while logged out. They should persist in localStorage.
            </li>
            <li>
              <strong>Cart Merge:</strong> Add items as guest, then login. Items should merge with backend cart.
            </li>
            <li>
              <strong>Authenticated Cart:</strong> Add items while logged in. They should sync to backend (mocked).
            </li>
            <li>
              <strong>Logout:</strong> Logout with items in cart. Cart should clear but items remain in backend.
            </li>
            <li>
              <strong>Optimistic Updates:</strong> All operations should update UI immediately.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CartTest;
