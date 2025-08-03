import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  discount?: string;
}

interface CategoriesGridProps {
  categories: Category[];
  title?: string;
}

const CategoriesGrid: React.FC<CategoriesGridProps> = ({ categories, title = "Category's" }) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log(categories);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  // Scroll left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
          {/* Arrow Buttons for Desktop */}
          <div className="hidden sm:flex space-x-2">
            <button
              onClick={scrollLeft}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Categories Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide space-x-6 snap-x snap-mandatory pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="relative flex-shrink-0 w-80 h-80 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 snap-center"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/90 mb-4">{category.description}</p>
                {category.discount && (
                  <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    {category.discount}
                  </span>
                )}
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className="w-full bg-red-900 hover:bg-red-800 text-white py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
                >
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow Buttons for Mobile */}
        <div className="flex sm:hidden justify-center space-x-4 mt-4">
          <button
            onClick={scrollLeft}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;