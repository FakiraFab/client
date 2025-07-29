import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';

const FeaturedProducts: React.FC = () => {
  const products = [
    {
      id: 1,
      name: 'Ajrakh Modal Saree',
      price: 4999,
      originalPrice: 6999,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
      badge: 'Bestseller',
      colors: ['#8B1538', '#2563EB', '#059669', '#DC2626']
    },
    {
      id: 2,
      name: 'Gamthi Cotton Saree',
      price: 3299,
      originalPrice: 4299,
      rating: 4.6,
      reviews: 89,
      image: 'https://images.pexels.com/photos/6764045/pexels-photo-6764045.jpeg?auto=compress&cs=tinysrgb&w=800',
      badge: 'New Arrival',
      colors: ['#F59E0B', '#8B1538', '#059669']
    },
    {
      id: 3,
      name: 'Maheshwari Silk Saree',
      price: 5999,
      originalPrice: 7999,
      rating: 4.9,
      reviews: 156,
      image: 'https://images.pexels.com/photos/9594454/pexels-photo-9594454.jpeg?auto=compress&cs=tinysrgb&w=800',
      badge: 'Premium',
      colors: ['#8B1538', '#F59E0B', '#2563EB']
    },
    {
      id: 4,
      name: 'Designer Dress Material',
      price: 2799,
      originalPrice: 3499,
      rating: 4.7,
      reviews: 67,
      image: 'https://images.pexels.com/photos/8532657/pexels-photo-8532657.jpeg?auto=compress&cs=tinysrgb&w=800',
      badge: 'Limited',
      colors: ['#059669', '#8B1538', '#DC2626']
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked premium fabrics that showcase the finest craftsmanship 
            and exceptional quality from our collection.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.badge === 'Bestseller' ? 'bg-yellow-500 text-white' :
                    product.badge === 'New Arrival' ? 'bg-green-500 text-white' :
                    product.badge === 'Premium' ? 'bg-purple-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {product.badge}
                  </span>
                </div>

                {/* Wishlist */}
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                  <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors duration-200" />
                </button>

                {/* Quick Actions */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-red-900 text-white py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-900 transition-colors duration-200">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Colors */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-600">Colors:</span>
                  <div className="flex space-x-1">
                    {product.colors.map((color, index) => (
                      <div 
                        key={index}
                        className="w-4 h-4 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-red-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-red-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-all duration-200 transform hover:scale-105">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;