import { useEffect, useRef } from 'react';

const TouchFeelCreateHero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((error) => console.error('Video playback failed:', error));
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full flex flex-col lg:flex-row bg-gray-50 overflow-hidden">
      {/* Video Section - First on mobile */}
      <div className="relative w-full lg:w-1/2 order-1 lg:order-2">
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/dtst7rqhw/video/upload/v1758210575/IMG_3217_1_klgomi.mp4"
          className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen object-cover object-center "
          preload="auto"
          muted
          loop
          playsInline
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/30 z-0 rounded-b-lg lg:rounded-none"></div>
        {/* Light overlay */}
        <div className="absolute inset-0 bg-black/5 z-0 rounded-b-lg lg:rounded-none"></div>
      </div>

      {/* Text Content Section - Second on mobile */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center lg:justify-start p-4 lg:p-12 xl:p-16 order-2 lg:order-1 bg-gray-50">
        <div className="max-w-xl space-y-4 w-full px-2 sm:px-4">
          {/* Large Bold Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-black leading-tight tracking-tight">
              FLOW
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-black leading-tight tracking-tight -mt-1 lg:-mt-2">
              FORM <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">&</span>
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-black leading-tight tracking-tight -mt-1 lg:-mt-2">
              FASHION
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mt-3 lg:mt-4 text-center lg:text-left max-w-md">
            Experience the luxury of premium fabrics and bring your creative visions to life.
          </p>

          {/* CTA Button */}
          <div className="pt-3 lg:pt-4 text-center lg:text-left">
            <button className="inline-flex items-center justify-center px-6 py-2.5 sm:px-8 sm:py-3 bg-black hover:bg-[#7F1416] text-white font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 rounded-lg">
              Explore Collection
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator (desktop only) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:left-6 lg:transform-none hidden lg:block z-10">
        <div className="flex flex-col items-center space-y-1.5 text-gray-500">
          <span className="text-xs font-medium tracking-wider rotate-90 origin-center">SCROLL</span>
          <div className="w-px h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default TouchFeelCreateHero;