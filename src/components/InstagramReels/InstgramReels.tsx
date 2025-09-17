import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, X, Volume2, VolumeX, Loader2 } from 'lucide-react';
import type { Reel } from '../../types';

interface InstagramReelsProps {
  reels: Reel[];
  title?: string;
}

// Cloudinary optimization helper functions
const optimizeVideoUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
}) => {
  if (!url.includes('cloudinary.com')) return url;
  
  const { width = 600, height = 800, quality = 'auto:good', format = 'auto' } = options;
  
  // Extract the upload part and add transformations
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

const optimizeThumbnailUrl = (videoUrl: string, options: {
  width?: number;
  height?: number;
  quality?: string;
}) => {
  if (!videoUrl.includes('cloudinary.com')) return videoUrl;
  
  const { width = 300, height = 400, quality = 'auto:low' } = options;
  
  const parts = videoUrl.split('/upload/');
  if (parts.length !== 2) return videoUrl;
  
  // Generate thumbnail from video
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_fill`,
    `q_${quality}`,
    'f_webp',
    'fl_progressive',
    'so_auto' // Smart object detection for best frame
  ].join(',');
  
  return `${parts[0]}/upload/${transformations}/${parts[1].replace(/\.[^.]+$/, '.jpg')}`;
};

const InstagramReels: React.FC<InstagramReelsProps> = ({ reels, title = "Featured Reels" }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const preloadedVideos = useRef<Set<string>>(new Set());

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Start muted for better UX
  const touchStartX = useRef<number>(0);
  const [visibleReels, setVisibleReels] = useState<Set<string>>(new Set());

  // Memoized optimized URLs
  const optimizedReels = useMemo(() => 
    reels.map(reel => ({
      ...reel,
      optimizedVideoUrl: optimizeVideoUrl(reel.videoUrl, { 
        width: 600, 
        height: 800, 
        quality: 'auto:good' 
      }),
      optimizedThumbnail: reel.thumbnailUrl || optimizeThumbnailUrl(reel.videoUrl, { 
        width: 300, 
        height: 400 
      }),
      modalVideoUrl: optimizeVideoUrl(reel.videoUrl, { 
        width: 1080, 
        height: 1920, 
        quality: 'auto:best' 
      })
    })), [reels]
  );

  // Preload video when it becomes visible
  const preloadVideo = useCallback((videoUrl: string, videoId: string) => {
    if (preloadedVideos.current.has(videoId)) return;
    
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = videoUrl;
    video.muted = true;
    
    video.addEventListener('loadedmetadata', () => {
      preloadedVideos.current.add(videoId);
    });
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const reelId = entry.target.getAttribute('data-reel-id');
          if (!reelId) return;

          if (entry.isIntersecting) {
            setVisibleReels(prev => new Set(prev).add(reelId));
            // Immediately start playing the video when it becomes visible
            const video = videoRefs.current.get(reelId);
            if (video) {
              video.muted = true;
              video.play().catch(() => {});
              setPlayingId(reelId);
            }
          } else {
            setVisibleReels(prev => {
              const newSet = new Set(prev);
              newSet.delete(reelId);
              // Pause video when it goes out of view
              const video = videoRefs.current.get(reelId);
              if (video) {
                video.pause();
                if (playingId === reelId) {
                  setPlayingId(null);
                }
              }
              return newSet;
            });
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '200px' // Start playing videos 200px before they're visible
      }
    );

    return () => intersectionObserver.current?.disconnect();
  }, [optimizedReels, preloadVideo]);

  // Remove the complex auto-play logic since we're handling it in intersection observer
  // This was causing delays and complexity

  // Enhanced video loading with progress
  const handleVideoLoad = useCallback((reelId: string) => {
    setLoadingVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(reelId);
      return newSet;
    });
  }, []);

  const handleVideoLoadStart = useCallback((reelId: string) => {
    setLoadingVideos(prev => new Set(prev).add(reelId));
  }, []);

  // Scroll functions with smooth scrolling
  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 280, behavior: 'smooth' });

  // Enhanced video toggle with loading states
  const toggleVideo = async (reelId: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    
    const video = videoRefs.current.get(reelId);
    if (!video) return;

    try {
      if (playingId === reelId) {
        video.pause();
        setPlayingId(null);
      } else {
        // Pause other videos
        if (playingId) {
          const previousVideo = videoRefs.current.get(playingId);
          previousVideo?.pause();
        }
        
        setLoadingVideos(prev => new Set(prev).add(reelId));
        await video.play();
        setPlayingId(reelId);
        setLoadingVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(reelId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Video play failed:', error);
      setLoadingVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(reelId);
        return newSet;
      });
    }
  };

  // Enhanced modal with better loading
  const openModal = async (index: number) => {
    setActiveIndex(index);
    setIsModalOpen(true);
    
    // Preload modal video
    const reel = optimizedReels[index];
    if (reel && !preloadedVideos.current.has(`modal-${reel._id}`)) {
      preloadVideo(reel.modalVideoUrl, `modal-${reel._id}`);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Enhanced modal video handling
  useEffect(() => {
    if (isModalOpen && modalVideoRef.current && activeIndex !== null) {
      const video = modalVideoRef.current;
      const reel = optimizedReels[activeIndex];
      
      video.currentTime = 0;
      video.muted = isMuted;
      
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log('Modal video play failed:', error);
        }
      };

      if (video.readyState >= 2) {
        playVideo();
      } else {
        video.addEventListener('loadeddata', playVideo, { once: true });
      }

      const handleEnded = () => {
        if (activeIndex < optimizedReels.length - 1) {
          setActiveIndex(prev => (prev !== null ? prev + 1 : null));
        } else {
          setActiveIndex(0); // Loop back to first video
        }
      };

      video.addEventListener('ended', handleEnded);
      return () => {
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('loadeddata', playVideo);
      };
    }
  }, [activeIndex, isModalOpen, isMuted, optimizedReels]);

  // Enhanced touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX.current;

    if (Math.abs(delta) > 50) {
      if (delta > 0 && activeIndex! > 0) {
        setActiveIndex(prev => (prev ?? 1) - 1);
      } else if (delta < 0 && activeIndex! < optimizedReels.length - 1) {
        setActiveIndex(prev => (prev ?? -1) + 1);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen || activeIndex === null) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (activeIndex > 0) setActiveIndex(activeIndex - 1);
          break;
        case 'ArrowRight':
          if (activeIndex < optimizedReels.length - 1) setActiveIndex(activeIndex + 1);
          break;
        case 'Escape':
          setIsModalOpen(false);
          break;
        case ' ':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, activeIndex, optimizedReels.length]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <div className="flex space-x-2">
            <button 
              onClick={scrollLeft} 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              onClick={scrollRight} 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {optimizedReels.map((reel, index) => (
            <div
              key={reel._id}
              data-reel-id={reel._id}
              ref={(el) => {
                if (el && intersectionObserver.current) {
                  intersectionObserver.current.observe(el);
                }
              }}
              onClick={() => openModal(index)}
              className="cursor-pointer flex-shrink-0 w-56 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="relative h-96 overflow-hidden">
                <video
                  ref={(el) => {
                    if (el) {
                      videoRefs.current.set(reel._id, el);
                    }
                  }}
                  src={reel.optimizedVideoUrl}
                  poster={reel.optimizedThumbnail}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="none"
                  onLoadStart={() => handleVideoLoadStart(reel._id)}
                  onLoadedData={() => handleVideoLoad(reel._id)}
                />

                {/* Loading indicator */}
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
                  {reel.price && (
                    <p className="text-white/90 text-sm font-medium">₹{reel.price}</p>
                  )}
                  {reel.description && (
                    <p className="text-white/80 text-xs mt-1 line-clamp-2">{reel.description}</p>
                  )}
                </div>

                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Fullscreen Modal */}
      {isModalOpen && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-6 text-white text-3xl font-bold hover:text-gray-300 transition-colors z-10" 
            onClick={() => setIsModalOpen(false)}
            aria-label="Close modal"
          >
            <X />
          </button>

          {/* Mute/Unmute Button */}
          <button
            className="absolute top-4 left-6 text-white text-xl hover:text-gray-300 transition-colors z-10"
            onClick={toggleMute}
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>

          {/* Progress indicator */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-white text-sm z-10">
            {activeIndex + 1} / {optimizedReels.length}
          </div>

          {/* Navigation arrows */}
          {activeIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors z-10"
              onClick={() => setActiveIndex(activeIndex - 1)}
              aria-label="Previous video"
            >
              <ChevronLeft size={40} />
            </button>
          )}

          {activeIndex < optimizedReels.length - 1 && (
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors z-10"
              onClick={() => setActiveIndex(activeIndex + 1)}
              aria-label="Next video"
            >
              <ChevronRight size={40} />
            </button>
          )}

          {/* Video Player */}
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
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          />

          {/* Video info overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
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