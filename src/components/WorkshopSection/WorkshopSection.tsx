import React from 'react';

const WorkshopSection: React.FC<{ onRegisterClick: () => void }> = ({ onRegisterClick }) => {
  return (
    <section className="w-full min-h-screen mt-12 mb-12 flex items-center bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-gray-300 rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-gray-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-gray-300 rotate-45"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 xl:px-24 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">
          
          {/* Workshop Content */}
          <div className="w-full lg:w-1/2 space-y-8 order-2 lg:order-1">
            {/* Small Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Limited Seats Available
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-none tracking-tight">
                REGISTER
              </h2>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-none tracking-tight -mt-2">
                FOR OUR
              </h2>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-[#7F1416] bg-clip-text text-transparent leading-none tracking-tight -mt-2">
                WORKSHOP
              </h2>
            </div>
            
            {/* Description */}
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-xl">
              Join our hands-on masterclass and create beautiful fabric art using 
              <span className="font-semibold text-gray-800"> age-old block printing methods</span>. 
              Discover the joy of handcrafting unique patterns with traditional techniques.
            </p>
            
            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-lg text-gray-700">Traditional block printing techniques</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-lg text-gray-700">All materials and tools provided</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-lg text-gray-700">Take home your creations</span>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={onRegisterClick}
                className="group inline-flex items-center justify-center px-12 py-5 bg-black hover:bg-[#7F1416] text-white text-lg font-bold  transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 relative overflow-hidden"
              >
                <span className="relative z-10">Register Now</span>
                <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Arrow Icon */}
                <svg 
                  className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">500+</span>
                  <span>Students Trained</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">4.9★</span>
                  <span>Average Rating</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Workshop Image */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative group">
              {/* Main Image */}
              <div className="relative overflow-hidden  shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                <img
                  src="https://res.cloudinary.com/dhkaucebl/image/upload/v1754541548/WhatsApp_Image_2024-07-27_at_13.05.06_b780f152_1_lpcth9.png"
                  alt="Block printing workshop with artisans"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                
                {/* Floating Badge */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold text-gray-800">Live Workshop</span>
                </div>
              </div>
              
             
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkshopSection;