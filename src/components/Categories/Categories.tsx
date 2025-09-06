import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client'; // Adjust import path as needed

// Define the Category type (adjust according to your API response)
interface Category {
  id: number;
  name: string;
  description?: string;
  categoryImage?: string;
  itemCount?: number;
  slug?: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get('/categories', {
    params: {
      limit: 20,
    }
  });
  return res.data.data;
};

const Categories: React.FC = () => {
  const navigate = useNavigate();

  // Fetch categories from backend
  const { data: categoriesData = [] as Category[], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Function to handle category click and navigate
  const handleCategoryClick = (category: Category) => {
    const categorySlug = category.slug || category.name;
    navigate(`/category/${categorySlug}`);
  };

  // Loading skeleton component
  const CategorySkeleton = () => (
    <div className="bg-white border border-gray-100 overflow-hidden group cursor-pointer">
      <div className="h-80 bg-gray-200 animate-pulse"></div>
      <div className="p-8">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-red-600 tracking-wider uppercase bg-red-50 px-4 py-2">
              Collections
            </span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated collections of premium fabrics,
            each designed to meet your unique style and needs.
          </p>
        </div>

        {/* Loading State */}
        {categoriesLoading && (
          <div className="flex items-center justify-center mb-12">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            <span className="ml-3 text-lg text-gray-600">Loading categories...</span>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoriesLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))
            : categoriesData.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden group cursor-pointer hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden bg-gray-100">
                    {category.categoryImage ? (
                      <img
                        src={category.categoryImage}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-lg font-medium">
                          {category.name}
                        </span>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                    
                    {/* Hover Action */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="bg-white/90 backdrop-blur-sm p-2 shadow-lg">
                        <ArrowRight className="h-5 w-5 text-gray-900" />
                      </div>
                    </div>

                    {/* Item Count Badge */}
                    {category.itemCount && (
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-sm font-medium text-gray-900">
                          {typeof category.itemCount === 'number' 
                            ? `${category.itemCount}+ items` 
                            : category.itemCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-200">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      {category.itemCount && (
                        <span className="text-sm text-gray-500 font-medium">
                          {typeof category.itemCount === 'number' 
                            ? `${category.itemCount}+ items` 
                            : category.itemCount}
                        </span>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryClick(category);
                        }}
                        className="text-red-600 font-semibold text-sm hover:text-red-700 transition-colors duration-200 flex items-center space-x-2 group/btn"
                      >
                        <span>Explore</span>
                        <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Empty State */}
        {!categoriesLoading && categoriesData.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v4h-2m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v4h-2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Categories will appear here once they are added.</p>
          </div>
        )}

        {/* View All Button */}
        {!categoriesLoading && categoriesData.length > 0 && (
          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/category')}
              className="bg-gray-900 text-white px-12 py-4 font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg border-2 border-transparent hover:border-gray-700"
            >
              View All Categories
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;