import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import QuickView from '../QuickView';
import ProductCard from '../ProductCard';
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

  // const navigate = useNavigate();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // const handleProductClick = (productId: string) => {
  //   navigate(`/products/${productId}`);
  // };

  // const handleQuickViewOpen = (product: Product) => {
  //   setQuickViewProduct(product);
  //   setIsQuickViewOpen(true);
  // };

  const handleQuickViewClose = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  return (
    <section className="py-16 ">
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
            <ProductCard 
              key={product._id}
              product={product}
            />
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