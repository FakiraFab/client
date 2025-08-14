interface FilterTabsProps {
  categoryId: string | undefined;
  selectedType: string;
  onSelect: (type: string) => void;
  subCategories: string[];
}

const FilterTabs: React.FC<FilterTabsProps> = ({ categoryId, selectedType, onSelect, subCategories }) => {
  if (!categoryId) return null;

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Filter by:</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {subCategories.length + 1} options
          </span>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            key="All"
            onClick={() => onSelect('All')}
            className={`px-4 py-2.5 text-sm font-medium rounded-full border-2 transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
              selectedType === 'All' 
                ? 'bg-[#7F1416] from-red-900 to-red-800 to-pink-600 text-white border' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-[#7F1416] from-red-900 to-red-800 hover:text-red-900 hover:bg-purple-50'
            }`}
          >
            <span>All</span>
            {selectedType === 'All' && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {subCategories.map((subCategory) => (
            <button
              key={subCategory}
              onClick={() => onSelect(subCategory)}
              className={`px-4 py-2.5 text-sm font-medium rounded-full border-2 transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                selectedType === subCategory 
                  ? 'bg-[#7F1416] from-red-900 to-red-800 text-white border-black-600 ' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-[#7F1416] from-red-900 to-red-800 hover:text-red-900  hover:bg-purple-50'
              }`}
            >
              <span>{subCategory}</span>
              {selectedType === subCategory && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
        
        {/* Active filter indicator */}
        {selectedType !== 'All' && (
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">
              Currently showing: <span className="font-medium text-[#7F1416]">{selectedType}</span>
            </span>
            <button 
              onClick={() => onSelect('All')}
              className="text-xs text-gray-400 hover:text-purple-600 transition-colors"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
      
      {/* <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style> */}
    </div>
  );
};

export default FilterTabs;