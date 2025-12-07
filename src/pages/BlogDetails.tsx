import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlogBySlug, getBlogById } from '../api/blogApi';
import Seo from '../components/Seo/Seo';
import JsonLd from '../components/Seo/JsonLd';

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch blog by slug first, fallback to ID if needed
  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      if (!id) throw new Error('No blog identifier provided');
      
      // Try to fetch by slug first
      try {
        return await getBlogBySlug(id);
      } catch (slugError) {
        // Fallback to ID-based fetch if slug fails
        console.warn('Slug fetch failed, trying by ID:', slugError);
        return await getBlogById(id);
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });

  // Generate JSON-LD schema for article
  const generateJsonLd = () => {
    if (!blog) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.shortDescription,
      image: blog.image || '',
      author: {
        '@type': 'Person',
        name: blog.author || 'Fakira FAB',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Fakira FAB',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.fakirafab.com/logo.png',
        },
      },
      datePublished: blog.publishedAt || blog.createdAt,
      dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
      articleSection: blog.category,
      keywords: blog.metaKeywords?.join(', ') || blog.tags?.join(', '),
      articleBody: blog.content,
    };
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-32 bg-gray-200 rounded" />
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded w-3/4" />
            <div className="h-12 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="w-full aspect-[16/9] bg-gray-200 rounded-lg" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-16">
        <div className="text-center py-20">
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
            {error instanceof Error ? error.message : 'Blog not found or is not available.'}
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  // Check if blog is published
  if (!blog.published) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-16">
        <div className="text-center py-20">
          <p className="text-gray-600 mb-6">This blog is not available.</p>
          <button
            onClick={() => navigate('/blog')}
            className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const cleanHtml = (html: string) => {
  return html.replace(/^\s+/gm, '').trim();
};

  return (
    <>
      <Seo
        title={blog.metaTitle || `${blog.title} - Fakira FAB Blog`}
        description={blog.metaDescription || blog.shortDescription}
        keywords={blog.metaKeywords?.join(', ') || blog.tags?.join(', ')}
        image={blog.image}
        url={`/blog/${blog.slug}`}
        type="article"
      />
      {blog && <JsonLd data={generateJsonLd()!} />}

      <article className="max-w-4xl mx-auto px-4 lg:px-0 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#1A1A1A] transition-colors duration-300 mb-8 group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Blog</span>
        </button>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#1A1A1A] mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {blog.category && (
              <span className="uppercase tracking-wider font-medium text-[#1A1A1A]">
                {blog.category}
              </span>
            )}
            {blog.author && (
              <>
                <span className="text-gray-400">•</span>
                <span>By {blog.author}</span>
              </>
            )}
            {blog.publishedAt && (
              <>
                <span className="text-gray-400">•</span>
                <time dateTime={blog.publishedAt}>
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </>
            )}
            {blog.views !== undefined && (
              <>
                <span className="text-gray-400">•</span>
                <span>{blog.views} views</span>
              </>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg mb-12">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Short Description */}
        <div className="text-xl text-gray-700 leading-relaxed mb-8 font-serif italic border-l-4 border-gray-300 pl-6">
          {blog.shortDescription}
        </div>

        {/* Main Content */}
       <div
        className="prose prose-lg max-w-none
            prose-headings:font-serif 
            prose-headings:text-[#1A1A1A]
            prose-p:text-gray-700 
            prose-p:leading-relaxed
            prose-a:text-[#1A1A1A]
            prose-a:underline
            prose-a:underline-offset-4
            prose-strong:text-[#1A1A1A]
            prose-em:text-gray-700
            hover:prose-a:text-gray-600"
        dangerouslySetInnerHTML={{ __html: cleanHtml(blog.content) }}
        />


        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/blog')}
            className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            Explore More Stories
          </button>
        </div>
      </article>
    </>
  );
};

export default BlogDetails;
