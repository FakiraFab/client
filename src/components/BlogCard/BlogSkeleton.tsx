import React from 'react';

interface BlogSkeletonProps {
  count?: number;
}

const BlogSkeleton: React.FC<BlogSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Image Skeleton */}
          <div className="w-full aspect-[16/10] bg-gray-200 rounded-lg" />

          {/* Content Skeleton */}
          <div className="mt-4 space-y-3">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-4/5" />
            <div className="h-6 bg-gray-200 rounded w-3/5" />

            {/* Description lines */}
            <div className="space-y-2 pt-1">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-3" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogSkeleton;
