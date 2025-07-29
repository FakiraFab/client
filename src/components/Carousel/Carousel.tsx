import React, { useState, useEffect } from 'react';

interface CarouselItem {
  id: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  const handleImageError = (id: string) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

  if (!items.length) return null;

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden bg-gray-100">
      {/* Carousel Items */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="min-w-full h-full relative">
            {imageError[item.id] ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">📷</div>
                  <span className="text-sm sm:text-lg">Image not available</span>
                </div>
              </div>
            ) : (
              <img
                src={item.image}
                alt={item.id}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => handleImageError(item.id)}
              />
            )}
            
            {/* CTA Button */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-12 lg:bottom-16 left-4 sm:left-6 md:left-12 lg:left-16">
              {item.ctaText && (
                <button
                  onClick={() => item.ctaLink && window.open(item.ctaLink, '_blank')}
                  className="group relative bg-transparent border-2 border-white text-white px-4 sm:px-6 md:px-12 py-2 sm:py-3 md:py-4 font-medium tracking-wider text-xs sm:text-sm md:text-base uppercase transition-all duration-300 hover:bg-white hover:text-black"
                >
                  <span className="relative z-10">{item.ctaText}</span>
                  <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Line Navigation */}
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 md:space-x-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-0.5 sm:h-1 transition-all duration-300 ${
              currentIndex === index 
                ? 'w-6 sm:w-8 md:w-12 lg:w-16 bg-white' 
                : 'w-4 sm:w-6 md:w-8 lg:w-10 bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;