import React from 'react';
import { ArrowRight, Handshake, Globe, Sparkles } from 'lucide-react';

const SupportArtisans: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Support Local
                <span className="text-red-900 block">Artisans</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Every purchase you make directly supports skilled artisans and their families. 
                Help preserve traditional craftsmanship while empowering communities to thrive 
                through their ancestral skills and knowledge.
              </p>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-900 mb-1">500+</div>
                <div className="text-sm text-gray-600">Artisans Supported</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-900 mb-1">50+</div>
                <div className="text-sm text-gray-600">Villages Reached</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Handshake className="h-5 w-5 text-red-900" />
                </div>
                <span className="text-gray-700">Fair trade practices and ethical sourcing</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Globe className="h-5 w-5 text-red-900" />
                </div>
                <span className="text-gray-700">Sustainable community development</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Sparkles className="h-5 w-5 text-red-900" />
                </div>
                <span className="text-gray-700">Preserving cultural heritage</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-all duration-200 flex items-center justify-center space-x-2 group">
                <span>Learn More</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <button className="border-2 border-red-900 text-red-900 px-8 py-4 rounded-lg font-semibold hover:bg-red-900 hover:text-white transition-all duration-200">
                Our Impact
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://setufairtrade.com/wp-content/uploads/2022/11/our-artisan.jpg"
                alt="Community of artisans"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Supporting Communities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportArtisans;