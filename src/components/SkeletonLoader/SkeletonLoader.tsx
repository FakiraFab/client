import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'hero' | 'product-card' | 'product-grid' | 'categories-grid' | 'reels-grid' | 'section-header' | 'text' | 'image' | 'button' | 'custom';
  className?: string;
  count?: number;
  width?: string;
  height?: string;
  rounded?: boolean;
  animate?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'custom',
  className = '',
  count = 1,
  width,
  height,
  rounded = true,
  animate = true,
}) => {
  const baseClasses = `bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${
    animate ? 'animate-pulse' : ''
  } ${rounded ? 'rounded-lg' : ''} ${className}`;

  const shimmerClasses = animate 
    ? 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_2s_infinite]'
    : '';

  const renderSkeleton = (key?: number) => {
    switch (variant) {
      case 'hero':
        return (
          <div key={key} className={`${baseClasses} ${shimmerClasses}`} style={{ width, height }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-64 h-8 bg-white/20 rounded-md mx-auto animate-pulse" />
                <div className="w-48 h-6 bg-white/20 rounded-md mx-auto animate-pulse delay-100" />
                <div className="w-32 h-10 bg-white/20 rounded-md mx-auto animate-pulse delay-200" />
              </div>
            </div>
          </div>
        );

      case 'product-card':
        return (
          <div key={key} className="space-y-4">
            <div className={`aspect-square ${baseClasses} ${shimmerClasses}`} />
            <div className="space-y-2">
              <div className={`h-4 ${baseClasses} ${shimmerClasses}`} />
              <div className={`h-4 w-3/4 ${baseClasses} ${shimmerClasses}`} />
              <div className={`h-5 w-1/2 ${baseClasses} ${shimmerClasses}`} />
            </div>
          </div>
        );

      case 'product-grid':
        return (
          <div key={key} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="space-y-4">
                <div className={`aspect-square ${baseClasses} ${shimmerClasses}`} />
                <div className="space-y-2">
                  <div className={`h-4 ${baseClasses} ${shimmerClasses}`} />
                  <div className={`h-4 w-3/4 ${baseClasses} ${shimmerClasses}`} />
                  <div className={`h-5 w-1/2 ${baseClasses} ${shimmerClasses}`} />
                </div>
              </div>
            ))}
          </div>
        );

      case 'categories-grid':
        return (
          <div key={key} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className={`aspect-square ${baseClasses} ${shimmerClasses} rounded-2xl`} />
                <div className={`h-4 ${baseClasses} ${shimmerClasses}`} />
              </div>
            ))}
          </div>
        );

      case 'reels-grid':
        return (
          <div key={key} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className={`aspect-[9/16] ${baseClasses} ${shimmerClasses} rounded-xl`} />
                <div className={`h-3 ${baseClasses} ${shimmerClasses}`} />
                <div className={`h-3 w-3/4 ${baseClasses} ${shimmerClasses}`} />
              </div>
            ))}
          </div>
        );

      case 'section-header':
        return (
          <div key={key} className="space-y-4 text-center mb-8">
            <div className={`h-8 w-64 mx-auto ${baseClasses} ${shimmerClasses}`} />
            <div className={`h-5 w-96 mx-auto ${baseClasses} ${shimmerClasses}`} />
            <div className={`h-4 w-80 mx-auto ${baseClasses} ${shimmerClasses}`} />
          </div>
        );

      case 'text':
        return (
          <div key={key} className={`h-4 ${baseClasses} ${shimmerClasses}`} style={{ width, height }} />
        );

      case 'image':
        return (
          <div 
            key={key} 
            className={`${baseClasses} ${shimmerClasses}`} 
            style={{ width: width || '100%', height: height || '200px' }}
          />
        );

      case 'button':
        return (
          <div 
            key={key} 
            className={`${baseClasses} ${shimmerClasses} rounded-md`}
            style={{ width: width || '120px', height: height || '40px' }}
          />
        );

      default:
        return (
          <div 
            key={key} 
            className={`${baseClasses} ${shimmerClasses}`}
            style={{ width: width || '100%', height: height || '20px' }}
          />
        );
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </>
  );
};

// Specific skeleton components for common use cases
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <SkeletonLoader variant="product-card" className={className} />
);

export const ProductGridSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 4, 
  className = '' 
}) => (
  <SkeletonLoader variant="product-grid" count={count} className={className} />
);

export const HeroSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <SkeletonLoader variant="hero" className={className} />
);

export const SectionHeaderSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <SkeletonLoader variant="section-header" className={className} />
);

export const ReelsGridSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <SkeletonLoader variant="reels-grid" className={className} />
);

export const CategoriesGridSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <SkeletonLoader variant="categories-grid" className={className} />
);

export default SkeletonLoader;
