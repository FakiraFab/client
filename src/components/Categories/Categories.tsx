import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Categories: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const categories = [
    {
      id: 1,
      name: 'Sarees',
      description: 'Traditional and contemporary sarees',
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
      itemCount: '150+ items'
    },
    {
      id: 2,
      name: 'Dress Materials',
      description: 'Premium unstitched fabrics',
      image: 'https://images.pexels.com/photos/6764045/pexels-photo-6764045.jpeg?auto=compress&cs=tinysrgb&w=800',
      itemCount: '200+ items'
    },
    {
      id: 3,
      name: 'Dupattas',
      description: 'Elegant dupattas and stoles',
      image: 'https://images.pexels.com/photos/9594454/pexels-photo-9594454.jpeg?auto=compress&cs=tinysrgb&w=800',
      itemCount: '80+ items'
    },
    {
      id: 4,
      name: 'Suits',
      description: 'Designer suit collections',
      image: 'https://images.pexels.com/photos/8532657/pexels-photo-8532657.jpeg?auto=compress&cs=tinysrgb&w=800',
      itemCount: '120+ items'
    },
    {
      id: 5,
      name: 'Bed Sheets',
      description: 'Comfortable home textiles',
      image: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800',
      itemCount: '60+ items'
    },
    {
      id: 6,
      name: 'Cut Pieces',
      description: 'Fabric cuts for your projects',
      image: 'https://images.pexels.com/photos/6621387/pexels-photo-6621387.jpeg?auto=compress&cs=tinysrgb&w=800',
      itemCount: '300+ items'
    }
  ];

  // Function to handle category click and navigate
  const handleCategoryClick = (categoryName: string) => {
    // Create a URL-friendly slug from the category name
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collections of premium fabrics,
            each designed to meet your unique style and needs.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              // Add onClick handler for navigation
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Overlay Content */}
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.itemCount}</span>
                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-900 transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.itemCount}</span>
                  {/* This button is redundant if the whole div is clickable, consider removing or changing its purpose */}
                  <button
                     onClick={(e) => {
                       e.stopPropagation(); // Prevent the div's click from firing
                       handleCategoryClick(category.name);
                     }}
                     className="text-red-900 font-semibold text-sm hover:text-red-700 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button - This button could also navigate to the main /category page */}
        <div className="text-center mt-12">
          <button
             onClick={() => navigate('/category')} // Navigate to the main categories page
             className="bg-red-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-all duration-200 transform hover:scale-105"
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;