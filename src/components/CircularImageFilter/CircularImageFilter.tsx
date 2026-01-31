import React from "react";

interface Category {
  name: string;
  img: string;
  value?: string; // Optional value for filtering
}

interface CircularImageFilterProps {
  categories: Category[];
  onCategorySelect?: (category: Category) => void;
  selectedCategory?: string;
}

const CircularImageFilter: React.FC<CircularImageFilterProps> = ({
  categories,
  onCategorySelect,
}) => {
  return (
    <div className="w-full flex flex-col items-center bg-white py-6 md:py-8 overflow-hidden">
      {/* Desktop grid / mobile scroll */}
      <div
        className="
        flex gap-6 md:gap-14 
        overflow-x-auto overflow-y-hidden
        md:overflow-visible 
        py-4 px-4 md:px-0
        w-full md:w-auto
        scrollbar-hide
        scroll-smooth
        snap-x snap-mandatory
      "
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => onCategorySelect?.(cat)}
            className="flex flex-col items-center group flex-shrink-0 opacity-90 hover:opacity-100 snap-center"
          >
            {/* Circle image */}
            <div
              className="
                w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 
                rounded-full overflow-hidden 
                shadow-sm
                transition-all duration-300 
                group-hover:scale-105 group-hover:shadow-md
                group-hover:ring-4 group-hover:ring-[#7F1416]
              "
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Label */}
            <p
              className="
                mt-2 md:mt-3 text-sm sm:text-base md:text-lg lg:text-xl font-normal 
                text-gray-900
                transition-colors duration-200
                group-hover:text-[#7F1416] group-hover:font-semibold
                text-center whitespace-nowrap
                max-w-[80px] sm:max-w-[100px] md:max-w-none
              "
            >
              {cat.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CircularImageFilter;
