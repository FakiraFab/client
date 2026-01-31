import React from 'react';

const BestSellerSection: React.FC = () => {
  return (
    <section className="py-16" style={{ backgroundColor: '#E6F0F7' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Best Seller
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-md mx-auto lg:mx-0">
              Discover the Finest Fabrics in Our Top Selling Collection.
            </p>
            <button className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-gray-800 text-gray-800 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
              Shop now
            </button>
          </div>

          {/* Right Column - Stacked Fabrics */}
          <div className="relative">
            {/* Stacked Fabric Images */}
            <div className="relative space-y-2 flex justify-center lg:justify-start">
              {/* Top Fabric - Light Blue with Teal Leaves */}
              <div className="relative w-32 sm:w-40 lg:w-48 h-24 sm:h-28 lg:h-32 bg-gradient-to-r from-blue-200 to-cyan-300 rounded-lg shadow-lg transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="absolute inset-2 bg-white/20 rounded-md"></div>
                <div className="absolute top-2 left-2 w-6 sm:w-8 lg:w-8 h-6 sm:h-8 lg:h-8 bg-teal-400 rounded-full opacity-60"></div>
                <div className="absolute top-6 sm:top-6 lg:top-6 left-6 sm:left-6 lg:left-6 w-4 sm:w-6 lg:w-6 h-4 sm:h-6 lg:h-6 bg-teal-500 rounded-full opacity-80"></div>
              </div>

              {/* Second Fabric - Light Pink with Pink Flowers */}
              <div className="relative w-32 sm:w-40 lg:w-48 h-24 sm:h-28 lg:h-32 bg-gradient-to-r from-pink-200 to-rose-300 rounded-lg shadow-lg transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer ml-4 sm:ml-6 lg:ml-8">
                <div className="absolute inset-2 bg-white/20 rounded-md"></div>
                <div className="absolute top-3 left-3 w-8 sm:w-10 lg:w-10 h-8 sm:h-10 lg:h-10 bg-pink-400 rounded-full opacity-70"></div>
                <div className="absolute top-8 left-8 w-4 sm:w-6 lg:w-6 h-4 sm:h-6 lg:h-6 bg-green-400 rounded-full opacity-60"></div>
              </div>

              {/* Third Fabric - Light Blue with Cherry Blossoms */}
              <div className="relative w-32 sm:w-40 lg:w-48 h-24 sm:h-28 lg:h-32 bg-gradient-to-r from-blue-200 to-sky-300 rounded-lg shadow-lg transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer ml-2 sm:ml-3 lg:ml-4">
                <div className="absolute inset-2 bg-white/20 rounded-md"></div>
                <div className="absolute top-2 left-4 w-4 sm:w-6 lg:w-6 h-4 sm:h-6 lg:h-6 bg-white rounded-full opacity-80"></div>
                <div className="absolute top-6 sm:top-6 lg:top-6 left-8 w-3 sm:w-4 lg:w-4 h-3 sm:h-4 lg:h-4 bg-pink-300 rounded-full opacity-70"></div>
                <div className="absolute top-8 left-2 w-4 sm:w-5 lg:w-5 h-4 sm:h-5 lg:h-5 bg-white rounded-full opacity-60"></div>
              </div>

              {/* Fourth Fabric - Light Beige with Red Flowers */}
              <div className="relative w-32 sm:w-40 lg:w-48 h-24 sm:h-28 lg:h-32 bg-gradient-to-r from-amber-100 to-orange-200 rounded-lg shadow-lg transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer ml-6 sm:ml-8 lg:ml-12">
                <div className="absolute inset-2 bg-white/20 rounded-md"></div>
                <div className="absolute top-2 left-6 w-8 sm:w-12 lg:w-12 h-8 sm:h-12 lg:h-12 bg-red-400 rounded-full opacity-80"></div>
                <div className="absolute top-8 left-2 w-6 sm:w-8 lg:w-8 h-6 sm:h-8 lg:h-8 bg-green-600 rounded-full opacity-70"></div>
              </div>

              {/* Fifth Fabric - Light Pink with Roses */}
              <div className="relative w-32 sm:w-40 lg:w-48 h-24 sm:h-28 lg:h-32 bg-gradient-to-r from-pink-100 to-rose-200 rounded-lg shadow-lg transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer ml-3 sm:ml-4 lg:ml-6">
                <div className="absolute inset-2 bg-white/20 rounded-md"></div>
                <div className="absolute top-3 left-4 w-8 sm:w-10 lg:w-10 h-8 sm:h-10 lg:h-10 bg-pink-500 rounded-full opacity-80"></div>
                <div className="absolute top-8 left-8 w-4 sm:w-6 lg:w-6 h-4 sm:h-6 lg:h-6 bg-green-500 rounded-full opacity-70"></div>
              </div>

              {/* Bottom Fabric - Light Beige with Pink Roses */}
              <div className="relative w-32 sm:w-40 lg:w-48 h-24 sm:h-28 lg:h-32 bg-gradient-to-r from-amber-50 to-orange-100 rounded-lg shadow-lg transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer ml-5 sm:ml-6 lg:ml-10">
                <div className="absolute inset-2 bg-white/20 rounded-md"></div>
                <div className="absolute top-2 left-6 w-8 sm:w-10 lg:w-10 h-8 sm:h-10 lg:h-10 bg-pink-400 rounded-full opacity-80"></div>
                <div className="absolute top-8 left-2 w-6 sm:w-8 lg:w-8 h-6 sm:h-8 lg:h-8 bg-green-500 rounded-full opacity-70"></div>
              </div>
            </div>

            {/* Decorative Leaf */}
            <div className="absolute -bottom-4 -right-4 w-12 h-16 sm:w-14 sm:h-18 lg:w-16 lg:h-20 transform rotate-45">
              <div className="w-full h-full bg-green-600 rounded-full opacity-80"></div>
              <div className="absolute inset-2 bg-green-500 rounded-full"></div>
              <div className="absolute top-1 left-1 w-1 h-1 bg-green-300 rounded-full"></div>
              <div className="absolute top-3 left-3 w-1 h-1 bg-green-300 rounded-full"></div>
              <div className="absolute top-5 left-5 w-1 h-1 bg-green-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
