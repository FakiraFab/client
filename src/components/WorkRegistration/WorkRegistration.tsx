import React from 'react';
import { ArrowRight, Users, Award, Heart } from 'lucide-react';

const WorkRegistration: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://setufairtrade.com/wp-content/uploads/2022/11/block-print.jpg"
                alt="Artisan at work"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">500+</div>
                  <div className="text-sm text-gray-600">Artisans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">1000+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Register For Our Workshop
                <span className="text-red-900 block">Handcrafted Work</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Join our community of skilled artisans and showcase your traditional craftsmanship 
                to customers worldwide. Share your story, your skills, and your beautiful creations.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Users className="h-5 w-5 text-red-900" />
                </div>
                <span className="text-gray-700">Connect with a global community</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Award className="h-5 w-5 text-red-900" />
                </div>
                <span className="text-gray-700">Showcase your expertise and skills</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="h-5 w-5 text-red-900" />
                </div>
                <span className="text-gray-700">Preserve traditional craftsmanship</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-all duration-200 flex items-center justify-center space-x-2 group">
                <span>Register Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <button className="border-2 border-red-900 text-red-900 px-8 py-4 rounded-lg font-semibold hover:bg-red-900 hover:text-white transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkRegistration;