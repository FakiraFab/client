// import React from 'react';

const TouchFeelCreateHero = () => {
  return (
    <section className="w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-gray-100">
      {/* Left Side - Text Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start p-8 lg:p-16 xl:p-24 order-2 lg:order-1">
        <div className="max-w-2xl space-y-4 lg:space-y-6">
          {/* Large Bold Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black text-black leading-none tracking-tight">
              TOUCH
            </h1>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black text-black leading-none tracking-tight -mt-4 lg:-mt-8">
              FEEL <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]">&</span>
            </h1>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black text-black leading-none tracking-tight -mt-4 lg:-mt-8">
              CREATE
            </h1>
          </div>
          
          {/* Subtitle (Optional) */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mt-8 lg:mt-12 text-center lg:text-left max-w-lg">
            Experience the luxury of premium fabrics and bring your creative visions to life.
          </p>
          
          {/* CTA Button (Optional) */}
          <div className="pt-6 lg:pt-8 text-center lg:text-left">
            <button className="inline-flex items-center justify-center px-10 py-4 bg-black hover:bg-gray-800 text-white font-semibold text-lg rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95">
              Explore Collection
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Side - Full Height Image */}
      <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[50vh] lg:min-h-screen order-1 lg:order-2">
        <img
          src="https://www.fabvoguestudio.com/cdn/shop/files/Mobile_banner_1_d025a821-58f5-4ab7-a50a-4dc56f60584c_1.png?height=1760&v=1753185194"
          alt="Beautiful fabric rolls showcasing texture and patterns"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        
        {/* Subtle overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gray-100/10"></div>
        
        {/* Optional: Fabric texture overlay for depth */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>
      
      {/* Optional: Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:left-8 lg:transform-none hidden lg:block">
        <div className="flex flex-col items-center space-y-2 text-gray-600">
          <span className="text-sm font-medium tracking-wider rotate-90 origin-center">SCROLL</span>
          <div className="w-px h-12 bg-gray-400"></div>
        </div>
      </div>
    </section>
  );
};

export default TouchFeelCreateHero;