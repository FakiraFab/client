import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, X, Volume2, VolumeX, Loader2 } from 'lucide-react';
import type { Reel } from '../../types';

interface InstagramReelsProps {
  reels: Reel[];
  title?: string;
}

// ---------------- Cloudinary Helpers ----------------
const optimizeVideoUrl = (
  url: string,
  options: { width?: number; height?: number; quality?: string; format?: string }
) => {
  if (!url.includes('cloudinary.com')) return url;

  const { width = 600, height = 800, quality = 'auto:good', format = 'auto' } = options;

  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_fill`,
    `q_${quality}`,
    `f_${format}`,
    'fl_progressive',
    'fl_lossy'
  ].join(',');

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

const optimizeThumbnailUrl = (videoUrl: string, options: { width?: number; height?: number; quality?: string }) => {
  if (!videoUrl.includes('cloudinary.com')) return videoUrl;

  const { width = 300, height = 400, quality = 'auto:low' } = options;
  const parts = videoUrl.split('/upload/');
  if (parts.length !== 2) return videoUrl;

  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_fill`,
    `q_${quality}`,
    'f_webp',
    'fl_progressive',
    'so_auto'
  ].join(',');

  return `${parts[0]}/upload/${transformations}/${parts[1].replace(/\.[^.]+$/, '.jpg')}`;
};

// Low-res blurred preview loop
const optimizePreviewUrl = (videoUrl: string) => {
  if (!videoUrl.includes('cloudinary.com')) return videoUrl;

  const parts = videoUrl.split('/upload/');
  if (parts.length !== 2) return videoUrl;

  const transformations = [
    'w_150',
    'h_200',
    'c_fill',
    'q_10',
    'e_blur:200',
    'f_auto',
    'vc_auto'
  ].join(',');

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

// ---------------- Component ----------------
const InstagramReels: React.FC<InstagramReelsProps> = ({ reels, title = 'Featured Reels' }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const touchStartX = useRef<number>(0);

  // Memoized URLs
  const optimizedReels = useMemo(
    () =>
      reels.map((reel) => ({
        ...reel,
        optimizedVideoUrl: optimizeVideoUrl(reel.videoUrl, {
          width: 600,
          height: 800,
          quality: 'auto:good'
        }),
        optimizedThumbnail:
          reel.thumbnailUrl ||
          optimizeThumbnailUrl(reel.videoUrl, {
            width: 300,
            height: 400
          }),
        modalVideoUrl: optimizeVideoUrl(reel.videoUrl, {
          width: 1080,
          height: 1920,
          quality: 'auto:best'
        }),
        previewUrl: optimizePreviewUrl(reel.videoUrl)
      })),
    [reels]
  );

  // Scroll functions
  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 280, behavior: 'smooth' });

  // Video load handlers
  const handleVideoLoad = useCallback((reelId: string) => {
    setLoadingVideos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(reelId);
      return newSet;
    });
  }, []);

  const handleVideoLoadStart = useCallback((reelId: string) => {
    setLoadingVideos((prev) => new Set(prev).add(reelId));
  }, []);

  // Toggle video play
  const toggleVideo = async (reelId: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    const video = videoRefs.current.get(reelId);
    if (!video) return;

    try {
      if (playingId === reelId) {
        video.pause();
        setPlayingId(null);
      } else {
        // Pause previous
        if (playingId) {
          const previousVideo = videoRefs.current.get(playingId);
          previousVideo?.pause();
        }

        // Swap preview → full video
        const fullUrl = optimizedReels.find((r) => r._id === reelId)?.optimizedVideoUrl;
        if (fullUrl && video.src !== fullUrl) {
          video.src = fullUrl;
          video.load();
        }

        setLoadingVideos((prev) => new Set(prev).add(reelId));
        await video.play();
        setPlayingId(reelId);
        setLoadingVideos((prev) => {
          const newSet = new Set(prev);
          newSet.delete(reelId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Video play failed:', error);
    }
  };

  // Modal open
  const openModal = (index: number) => {
    setActiveIndex(index);
    setIsModalOpen(true);
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  // Modal video autoplay
  useEffect(() => {
    if (isModalOpen && modalVideoRef.current && activeIndex !== null) {
      const video = modalVideoRef.current;
      video.currentTime = 0;
      video.muted = isMuted;
      video.play().catch(() => {});
    }
  }, [activeIndex, isModalOpen, isMuted]);

  // Touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0 && activeIndex! > 0) setActiveIndex((prev) => (prev ?? 1) - 1);
      else if (delta < 0 && activeIndex! < optimizedReels.length - 1) setActiveIndex((prev) => (prev ?? -1) + 1);
    }
  };

  return (
    <section className="py-16">
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

        {/* Reel Cards */}
        <div ref={scrollContainerRef} className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
          {optimizedReels.map((reel, index) => (
            <div
              key={reel._id}
              onClick={() => openModal(index)}
              className="cursor-pointer flex-shrink-0 w-56 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="relative h-96 overflow-hidden">
                {/* Preview video (blurred) → swapped to full on play */}
                <video
                  ref={(el) => {
                    if (el) videoRefs.current.set(reel._id, el);
                  }}
                  src={reel.previewUrl}
                  poster={reel.optimizedThumbnail}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onLoadStart={() => handleVideoLoadStart(reel._id)}
                  onLoadedData={() => handleVideoLoad(reel._id)}
                />

                {loadingVideos.has(reel._id) && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}

                {/* Play/Pause overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => toggleVideo(reel._id, e)}
                    className="p-3 bg-white bg-opacity-90 rounded-full backdrop-blur-sm hover:bg-opacity-100 transition-all"
                    disabled={loadingVideos.has(reel._id)}
                  >
                    {loadingVideos.has(reel._id) ? (
                      <Loader2 className="h-5 w-5 text-gray-800 animate-spin" />
                    ) : playingId === reel._id ? (
                      <Pause className="h-5 w-5 text-gray-800" />
                    ) : (
                      <Play className="h-5 w-5 text-gray-800 ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <h3 className="text-white font-semibold text-base mb-1 line-clamp-2">{reel.title}</h3>
                  {reel.price && <p className="text-white/90 text-sm font-medium">₹{reel.price}</p>}
                  {reel.description && <p className="text-white/80 text-xs mt-1 line-clamp-2">{reel.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <button className="absolute top-4 right-6 text-white text-3xl font-bold" onClick={() => setIsModalOpen(false)}>
            <X />
          </button>
          <button className="absolute top-4 left-6 text-white text-xl" onClick={toggleMute}>
            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>

          {activeIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
              onClick={() => setActiveIndex(activeIndex - 1)}
            >
              <ChevronLeft size={40} />
            </button>
          )}
          {activeIndex < optimizedReels.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
              onClick={() => setActiveIndex(activeIndex + 1)}
            >
              <ChevronRight size={40} />
            </button>
          )}

          <video
            key={`modal-${optimizedReels[activeIndex]._id}`}
            ref={modalVideoRef}
            src={optimizedReels[activeIndex].modalVideoUrl}
            poster={optimizedReels[activeIndex].optimizedThumbnail}
            autoPlay
            muted={isMuted}
            controls
            playsInline
            className="max-w-[90vw] max-h-[85vh] object-contain shadow-2xl"
          />

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-lg font-semibold mb-2">{optimizedReels[activeIndex].title}</h3>
            {optimizedReels[activeIndex].description && (
              <p className="text-sm text-white/80">{optimizedReels[activeIndex].description}</p>
            )}
            {optimizedReels[activeIndex].price && (
              <p className="text-lg font-bold text-yellow-400 mt-1">₹{optimizedReels[activeIndex].price}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default InstagramReels;
