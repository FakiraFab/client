import React, { useState, useRef, useEffect} from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, X, Volume2, VolumeX } from 'lucide-react';
import type { Reel } from '../../types';

interface InstagramReelsProps {
  reels: Reel[];
  title?: string;
}

const InstagramReels: React.FC<InstagramReelsProps> = ({ reels, title = "Featured Reels" }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);

  // Scroll buttons
  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 320, behavior: 'smooth' });

  // Toggle thumbnail video (for preview only)
  const toggleVideo = (reelId: string) => {
    const video = videoRefs.current.get(reelId);
    if (!video) return;
    if (playingId === reelId) {
      video.pause();
      setPlayingId(null);
    } else {
      if (playingId) {
        const previousVideo = videoRefs.current.get(playingId);
        previousVideo?.pause();
      }
      video.play();
      setPlayingId(reelId);
    }
  };

  // Open fullscreen modal
  const openModal = (index: number) => {
    setActiveIndex(index);
    setIsModalOpen(true);
  };

  // Mute/unmute toggle
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Handle autoplay and mute when video changes
  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      const video = modalVideoRef.current;
      video.currentTime = 0;
      video.play().catch(() => {});
      video.muted = isMuted;

      const handleEnded = () => {
        if (activeIndex !== null && activeIndex < reels.length - 1) {
          setActiveIndex((prev) => (prev !== null ? prev + 1 : null));
        }
      };

      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
    }
  }, [activeIndex, isModalOpen, isMuted, reels.length]);

  // Swipe gesture support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX.current;

    if (delta > 50 && activeIndex! > 0) {
      setActiveIndex((prev) => (prev ?? 1) - 1);
    } else if (delta < -50 && activeIndex! < reels.length - 1) {
      setActiveIndex((prev) => (prev ?? -1) + 1);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <div className="flex space-x-2">
            <button onClick={scrollLeft} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button onClick={scrollRight} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reels.map((reel, index) => (
            <div
              key={reel._id}
              onClick={() => openModal(index)}
              className="cursor-pointer flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="relative h-80 overflow-hidden">
                <video
                  ref={(el) => {
                    if (el) {
                      videoRefs.current.set(reel._id, el);
                    }
                  }}
                  src={reel.videoUrl}
                  poster={reel.thumbnailUrl}
                  className="w-full h-full object-cover"
                  muted
                  loop
                />

                <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVideo(reel._id);
                    }}
                    className="p-4 bg-white bg-opacity-90 rounded-full"
                  >
                    {playingId === reel._id ? (
                      <Pause className="h-6 w-6 text-gray-800" />
                    ) : (
                      <Play className="h-6 w-6 text-gray-800" />
                    )}
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg mb-1">{reel.title}</h3>
                  {reel.price && (
                    <p className="text-white/90 text-sm">₹{reel.price}</p>
                  )}
                  {reel.description && (
                    <p className="text-white/80 text-xs mt-1">{reel.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="absolute top-4 right-6 text-white text-3xl font-bold" onClick={() => setIsModalOpen(false)}>
            <X />
          </button>

          {/* Mute/Unmute Button */}
          <button
            className="absolute top-4 left-6 text-white text-xl"
            onClick={toggleMute}
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>

          {/* Left Arrow */}
          {activeIndex > 0 && (
            <button
              className="absolute left-4 text-white text-4xl"
              onClick={() => setActiveIndex(activeIndex - 1)}
            >
              <ChevronLeft size={40} />
            </button>
          )}

          {/* Video Player */}
          <video
            key={reels[activeIndex]._id}
            ref={modalVideoRef}
            src={reels[activeIndex].videoUrl}
            poster={reels[activeIndex].thumbnailUrl}
            autoPlay
            muted={isMuted}
            controls
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />

          {/* Right Arrow */}
          {activeIndex < reels.length - 1 && (
            <button
              className="absolute right-4 text-white text-4xl"
              onClick={() => setActiveIndex(activeIndex + 1)}
            >
              <ChevronRight size={40} />
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default InstagramReels;
