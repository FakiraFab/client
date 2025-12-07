import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '../api/blogApi';
import type { Blog } from '../types';
import BlogCard from '../components/BlogCard';
import BlogSkeleton from '../components/BlogCard/BlogSkeleton';
import Seo from '../components/Seo/Seo';

const BlogList: React.FC = () => {
  const ITEMS_PER_PAGE = 10;
  const page = 1;

  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['blogs', page],
    queryFn: () => getBlogs(page, ITEMS_PER_PAGE),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });

  return (
    <>
      <Seo
        title="Blog - Fakira FAB | Fashion Stories, Styling Tips & Traditions"
        description="Explore the latest in Indian fashion, styling tips, fabric guides, and cultural traditions. Discover stories that celebrate craftsmanship and timeless elegance."
        url="/blog"
        type="website"
        keywords="fashion blog, styling tips, Indian fashion, fabric guide, traditional wear, design inspiration"
      />

      <section className="max-w-7xl mx-auto px-4 lg:px-0 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#1A1A1A] mb-4">
            Stories & Style
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the art of fashion, tradition, and timeless elegance
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            <BlogSkeleton count={ITEMS_PER_PAGE} />
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-gray-600 mb-6">
                {error instanceof Error
                  ? error.message
                  : 'Failed to load blogs. Please try again later.'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && !isError && blogs.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {blogs.map((blog: Blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              No published blogs available at the moment.
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default BlogList;
