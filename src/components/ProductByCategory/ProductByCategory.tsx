import React from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import QuickView from '../QuickView';
import type { Product } from '../../types';

interface ProductsByCategoryProps {
  title: string;
  products: Product[];
  filters?: string[];
  onViewAll: () => void;
}

const ProductsByCategory: React.FC<ProductsByCategoryProps> = ({ 
  title, 
  products, 
  filters = [],
  onViewAll 
}) => {

  const navigate = useNavigate();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleQuickViewOpen = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onViewAll}
            className="text-red-900 hover:text-red-700 font-semibold transition-colors duration-200"
          >
            View All →
          </button>
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            {filters.map((filter, index) => (
              <button
                key={index}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-red-900 hover:text-red-900 transition-colors duration-200"
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
              onClick={() => handleProductClick(product._id)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Quick View Button */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                    onClick={e => { e.stopPropagation(); handleQuickViewOpen(product); }}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Quick View</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-900 transition-colors duration-200">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-red-900">
                    ₹{product.price.toLocaleString()} <span className="text-sm font-normal text-gray-600">per meter</span>
                  </span>
                </div>
                <p className="text-sm text-red-600">
                  {product.quantity} meters left
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick View Component */}
        <QuickView 
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={handleQuickViewClose}
        />
      </div>
    </section>
  );
};

export default ProductsByCategory;