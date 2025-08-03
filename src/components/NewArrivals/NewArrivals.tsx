import React from 'react';
import { Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stockLeft: number;
}

interface NewArrivalsProps {
  products: Product[];
}

const NewArrivals: React.FC<NewArrivalsProps> = ({ products }) => {
  console.log('New Arrivals Products:', products);
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our latest collection of handcrafted fabrics and textiles
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              <div className="relative h-64 overflow-hidden bg-white flex items-center justify-center">
                <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />



                
                {/* Quick View Button */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2">
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

                <p className="text-sm text-red-600 mb-4">
                  {product.stockLeft} meters left
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;