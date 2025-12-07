import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Blog } from '../../types';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Use slug for SEO-friendly URL
    navigate(`/blog/${blog.slug}`);
  };

  // Fallback image if not provided
  const imageUrl = blog.image || '/placeholder-blog.jpg';

  // Fallback description
  const description = blog.shortDescription || blog.content?.substring(0, 150) + '...';

  return (
    <article
      onClick={handleClick}
      className="cursor-pointer transition-opacity duration-300 hover:opacity-90 group"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
        <img
          src={imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-blog.jpg';
          }}
        />
      </div>

      {/* Content */}
      <div className="mt-4">
        {/* Title */}
        <h2 className="text-xl font-medium text-[#1A1A1A] mb-2 leading-snug font-serif group-hover:underline underline-offset-4 transition-all">
          {blog.title}
        </h2>

        {/* Short Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Meta Info */}
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 flex-wrap">
          {blog.category && (
            <span className="uppercase tracking-wider font-medium">
              {blog.category}
            </span>
          )}
          {blog.author && (
            <>
              <span className="text-gray-400">•</span>
              <span>{blog.author}</span>
            </>
          )}
          {blog.publishedAt && (
            <>
              <span className="text-gray-400">•</span>
              <time dateTime={blog.publishedAt}>
                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
