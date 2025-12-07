import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import QuickView from '../QuickView';
import ProductCard from '../ProductCard';
import type { Product } from '../../types';
import { useNavigate } from 'react-router-dom';

interface NewArrivalsProps {
  products: Product[];
}

const NewArrivals: React.FC<NewArrivalsProps> = ({ products }) => {
  const navigate = useNavigate();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  //console.log('New Arrivals Products:', products);
  
  const handleViewAllClick = () => {
    navigate('/new-arrivals');
  };

  // const handleQuickViewOpen = (product: Product) => {
  //   setQuickViewProduct(product);
  //   setIsQuickViewOpen(true);
  // };

  const handleQuickViewClose = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
       <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
          <button
            onClick={handleViewAllClick}
            className="text-red-900 hover:text-red-700 font-semibold transition-colors duration-200"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

export default NewArrivals;