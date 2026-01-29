import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlistApi } from '../../api/wishlist';
import { useToast } from '../../context/ToastContext';
import Seo from '../../components/Seo/Seo';
import type { WishlistItem } from '../../types/wishlist';

const Wishlist: React.FC = () => {
  const { showToast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [movingToCartId, setMovingToCartId] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await wishlistApi.getWishlist();
      if (response.success && response.data) {
        setWishlistItems(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load wishlist',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      await wishlistApi.removeFromWishlist(productId);
      showToast({
        type: 'success',
        title: 'Removed from Wishlist',
        message: 'Item removed from your wishlist',
        duration: 3000,
      });
      fetchWishlist();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to remove item',
        duration: 5000,
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleMoveToCart = async (productId: string) => {
    setMovingToCartId(productId);
    try {
      await wishlistApi.moveToCart(productId);
      showToast({
        type: 'success',
        title: 'Moved to Cart',
        message: 'Item moved to your cart',
        duration: 3000,
      });
      fetchWishlist();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to move item to cart',
        duration: 5000,
      });
    } finally {
      setMovingToCartId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title="My Wishlist - Fakira FAB"
        description="View and manage your favorite products"
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="mt-2 text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>

          {/* Wishlist Grid */}
          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
              <p className="mt-2 text-gray-600">Save items you love for later</p>
              <Link
                to="/all-products"
                className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow relative group"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    disabled={removingId === item.product._id}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Remove from wishlist"
                  >
                    {removingId === item.product._id ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  {/* Product Image */}
                  <Link to={`/products/${item.product._id}`}>
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                      <img
                        src={item.product.images?.[0] || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="h-64 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="p-4">
                    <Link to={`/products/${item.product._id}`}>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-red-600">
                        {item.product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="mt-2 flex items-center space-x-2">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{item.product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Stock Status */}
                    <div className="mt-2">
                      {item.product.quantity > 0 ? (
                        <span className="text-xs text-green-600 font-medium">In Stock</span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                      )}
                    </div>

                    {/* Move to Cart Button */}
                    <button
                      onClick={() => handleMoveToCart(item.product._id)}
                      disabled={movingToCartId === item.product._id || item.product.quantity === 0}
                      className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                    >
                      {movingToCartId === item.product._id ? (
                        <span className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Moving...
                        </span>
                      ) : item.product.quantity === 0 ? (
                        'Out of Stock'
                      ) : (
                        'Move to Cart'
                      )}
                    </button>
                  </div>

                  {/* Added Date */}
                  <div className="px-4 pb-4">
                    <p className="text-xs text-gray-500">
                      Added {new Date(item.addedAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
