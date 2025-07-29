import React from 'react';
import { ChevronRight, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-red-50 to-red-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Trusted by 10,000+ customers</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Discover
                <span className="text-red-900 block">Premium Fabrics</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Explore our exquisite collection of traditional and contemporary fabrics, 
                handpicked for their quality, craftsmanship, and timeless appeal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-all duration-200 flex items-center justify-center space-x-2 group">
                <span>Shop Collections</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <button className="border-2 border-red-900 text-red-900 px-8 py-4 rounded-lg font-semibold hover:bg-red-900 hover:text-white transition-all duration-200">
                View Catalog
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-900">500+</div>
                <div className="text-sm text-gray-600">Premium Fabrics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-900">50+</div>
                <div className="text-sm text-gray-600">Design Varieties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-900">25+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-red-900 to-red-800 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/6621387/pexels-photo-6621387.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Premium Fabric Collection" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-gray-900">Handwoven Sarees</h3>
                  <p className="text-sm text-gray-600">Traditional craftsmanship</p>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">In Stock</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-900">₹2,999</div>
                  <div className="text-sm text-gray-600">Starting from</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;