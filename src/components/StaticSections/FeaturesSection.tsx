import { useState, useEffect } from 'react';

const FeaturesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % features.length);
      }, 3000); // Auto-advance every 3 seconds
      
      return () => clearInterval(interval);
    }
  }, [isMobile]);
  const features = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 8C16.5 8 14 10.5 14 14C14 17.5 16.5 20 20 20C23.5 20 26 17.5 26 14C26 10.5 23.5 8 20 8Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M12 32C12 26 15.5 22 20 22C24.5 22 28 26 28 32" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M15 10L12 8L10 12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M25 10L28 8L30 12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      title: "OUR FABRICS",
      description: "Made with love using only 100% vegan fabrics"
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="16" width="24" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="10" y="18" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="26" cy="28" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="26" cy="28" r="2" fill="currentColor"/>
          <path d="M32 20L34 18L36 20L34 22L32 20Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M4 20L6 18L8 20L6 22L4 20Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      title: "EXPRESS DELIVERY",
      description: (
        <>
          We love getting our Muls to you as soon as you<br />
          choose your favourites
        </>
      )
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M16 20L18 22L24 16" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 12C12 8 16 6 20 6C24 6 28 8 28 12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M12 28C12 32 16 34 20 34C24 34 28 32 28 28" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      title: "HAPPINESS GUARANTEED",
      description: (
        <>
          100% money back guaranteed & easy exchanges.<br />
          No questions asked
        </>
      )
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 28C8 28 12 24 20 24C28 24 32 28 32 28L28 32H12L8 28Z" fill="currentColor"/>
          <ellipse cx="14" cy="18" rx="2" ry="3" fill="currentColor"/>
          <ellipse cx="26" cy="18" rx="2" ry="3" fill="currentColor"/>
          <path d="M10 12C12 8 16 6 20 6C24 6 28 8 30 12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="20" cy="16" r="1" fill="currentColor"/>
        </svg>
      ),
      title: "MADE IN INDIA",
      description: (
        <>
          A brand of Indian values, we are made completely<br />
          in India from thought to creation
        </>
      )
    }
  ];

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 flex items-center justify-center text-gray-700 bg-gray-50 rounded-full">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-900 mb-3 uppercase">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile Carousel Layout */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {features.map((feature, index) => (
                <div key={index} className="w-full flex-shrink-0 text-center px-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center text-gray-700 bg-gray-50 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold tracking-wider text-gray-900 mb-3 uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  currentSlide === index ? 'bg-gray-800' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;