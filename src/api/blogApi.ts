import apiClient from './client';
import type { Blog, ApiResponse } from '../types';

/**
 * Fetch all blogs from the API with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Promise with array of blogs and pagination metadata
 */
export const getBlogs = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await apiClient.get<ApiResponse<Blog[]>>('/blogs', {
      params: {
        page,
        limit,
        published: true,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

/**
 * Fetch a single blog by slug
 * @param slug - Blog slug (SEO-friendly identifier)
 * @returns Promise with blog data
 */
export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  try {
    const response = await apiClient.get<ApiResponse<Blog>>(
      `/blogs/slug/${slug}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching blog with slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Fetch a single blog by ID (MongoDB ObjectId)
 * @param id - Blog ID
 * @returns Promise with blog data
 */
export const getBlogById = async (id: string): Promise<Blog> => {
  try {
    const response = await apiClient.get<ApiResponse<Blog>>(
      `/blogs/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    throw error;
  }
};
