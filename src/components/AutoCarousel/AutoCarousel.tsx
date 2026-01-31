import { useState, useEffect } from 'react';

const AutoCarousel = ({ 
  slides = [],
  autoPlayInterval = 4000,
  className = "",
  showIndicators = true,
  pauseOnHover = true
}) => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [currentSlide, isPaused, autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false);
  };

  return (
    <div 
      className={`relative w-full h-48 bg-gradient-to-br from-[#7F1416] to-[#7F1416] overflow-hidden flex items-center justify-center text-white ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Content */}
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index}
            className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center text-center px-8"
          >
            {/* <div className="text-3xl md:text-4xl font-light tracking-widest mb-4 uppercase">
              <span className="font-bold">COD</span> <span className="italic">Available</span>
            </div> */}
            <div className="text-lg md:text-xl font-semibold tracking-wide max-w-2xl">
              {slide}
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-12 h-0.5 transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default AutoCarousel;