import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const KnowYourGarment = ({ 
  title = "Know Your Garment",
  items = [
    {
      id: 1,
      title: "Artisan Made",
      image: "https://media.istockphoto.com/id/2187530158/photo/design-wooden-blocks-for-textile-printing-wooden-handicraft-printing-block.jpg?s=2048x2048&w=is&k=20&c=avlfFz6-wrrsMayp2taXounQk0AkIK88KIAw1voDqUw=",
      description: "Handcrafted by skilled artisans using traditional techniques"
    },
    {
      id: 2,
      title: "Handblock Printed",
      image: "https://dmaasa.com/cdn/shop/files/R-DKQ0049-THUMB.jpg?v=1696241670&width=750",
      description: "Traditional block printing technique for unique patterns"
    },
    {
      id: 3,
      title: "Naturally Dyed",
      image: "https://t4.ftcdn.net/jpg/01/44/24/83/360_F_144248379_GWXH6c2dP86LD5wfLq3Sc4pQjcLQz6M6.jpg",
      description: "Colors derived from natural sources and organic materials"
    },
    {
      id: 4,
      title: "Soaked in Softness",
      image: "https://dmaasa.com/cdn/shop/files/Hand_Block_Printed_Cotton_Green_Leaf_Cushion_Cover_4.webp?v=1746183128&width=750",
      description: "Premium soft materials for ultimate comfort"
    }
  ]
}) => {
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-center mb-8 lg:mb-12 text-gray-900">
          {title}
        </h2>

        {/* Cards Container with Navigation */}
        <div className="relative">
          {/* Navigation Arrows - Hidden on Mobile */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 items-center justify-center group z-20 border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
          </button>

          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 items-center justify-center group z-20 border border-gray-200"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainer}
            className="overflow-x-auto scrollbar-hide mx-0 md:mx-16"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            } as React.CSSProperties}
          >
            <div className="flex space-x-4 md:space-x-6 pb-4 pl-4 md:pl-0">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="flex-shrink-0 w-80 md:w-80 lg:w-96 group cursor-pointer"
                >
                  <div className="bg-white rounded-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="aspect-[1/1] relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                        <h3 className="text-2xl md:text-3xl font-light text-white tracking-wide">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowYourGarment;