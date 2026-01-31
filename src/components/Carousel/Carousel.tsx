import React, { useState, useEffect } from 'react';
import type { Banner } from '../../types';

interface CarouselProps {
  banners: Banner[];
}

const Carousel: React.FC<CarouselProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // ✅ Only active banners
  const activeBanners = banners.filter((banner) => banner.isActive);

  // ✅ Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Autoplay
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const handleImageError = (id: string) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

  if (!activeBanners.length) return null;

  const getOptimizedUrl = (url: string, mobile: boolean) => {
    if (!url) return '';
    return url.replace(
      '/upload/',
      mobile
        ? '/upload/f_auto,q_auto,c_fill,g_auto,w_768,h_1000/'
        : '/upload/f_auto,q_auto,c_fill,g_auto,w_1920,h_900/'
    );
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-100">
      {/* Carousel Items */}
      <div
        className="flex transition-transform duration-700 ease-in-out w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map((banner) => {
          const isPortrait = isMobile && banner.imageMobile;
          const imageUrl = isPortrait
            ? getOptimizedUrl(banner.imageMobile!, true)
            : getOptimizedUrl(banner.imageDesktop!, false);

          return (
            <div
              key={banner._id}
              className={`min-w-full relative flex justify-center items-center ${
                isPortrait ? 'aspect-[3/4]' : 'aspect-[2.25/1]'
              }`}
            >
              {imageError[banner._id] ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">📷</div>
                    <span className="text-sm sm:text-lg">Image not available</span>
                  </div>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt={banner.title || `Banner ${banner._id}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  onError={() => handleImageError(banner._id)}
                />
              )}

              {/* CTA Button */}
              <div className="absolute bottom-4 sm:bottom-6 md:bottom-12 lg:bottom-16 left-4 sm:left-6 md:left-12 lg:left-16">
                {banner.ctaText && (
                  <button
                    onClick={() => banner.ctaLink && window.open(banner.ctaLink, '_blank')}
                    className="group relative bg-transparent border-2 border-white text-white px-4 sm:px-6 md:px-12 py-2 sm:py-3 md:py-4 font-medium tracking-wider text-xs sm:text-sm md:text-base uppercase transition-all duration-300 hover:bg-white hover:text-black"
                  >
                    <span className="relative z-10">{banner.ctaText}</span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Line Navigation */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 md:space-x-4">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-0.5 sm:h-1 transition-all duration-300 ${
                currentIndex === index
                  ? 'w-12 sm:w-8 md:w-12 lg:w-16 bg-white bg-opacity-100 '
                  : 'w-8 sm:w-6 md:w-8 lg:w-10 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
