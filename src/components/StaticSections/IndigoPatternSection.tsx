import { useEffect, useRef } from 'react';

const IndigoPatternSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((error) => console.error("Video playback failed:", error));
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 } // at least 50% visible to play
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
          src="https://res.cloudinary.com/dtst7rqhw/video/upload/v1758209855/IMG_3215_xf6vok.mp4"
          className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen object-cover object-center rounded-b-lg lg:rounded-none"
          
          loop
          muted
          playsInline
          preload="auto"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/30 z-0 rounded-b-lg lg:rounded-none"></div>
        {/* Light overlay */}
        <div className="absolute inset-0 bg-black/5 z-0 rounded-b-lg lg:rounded-none"></div>
      </div>

      {/* Text Content Section - Second on mobile */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center lg:justify-start p-4 lg:p-12 xl:p-16 order-2 lg:order-1 bg-gray-50">
        <div className="max-w-xl space-y-4 w-full px-2 sm:px-4 text-center lg:text-left">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-black leading-tight tracking-tight">
            Indigo Fabrics
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mt-3 lg:mt-4 max-w-md">
            Experience the timeless beauty of Indigo Prints —
            handcrafted patterns that bring heritage and style to modern fashion.
          </p>

          {/* CTA Button */}
          <div className="pt-3 lg:pt-4">
            <button className="inline-flex items-center justify-center px-6 py-2.5 sm:px-8 sm:py-3 bg-black hover:bg-[#7F1416] text-white font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
              Explore Collection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndigoPatternSection;