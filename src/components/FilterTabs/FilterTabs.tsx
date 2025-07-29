interface FilterTabsProps {
    categoryId: string | undefined;
    selectedType: string;
    onSelect: (type: string) => void;
    subCategories: string[];
  }
  
  const FilterTabs: React.FC<FilterTabsProps> = ({ categoryId, selectedType, onSelect, subCategories }) => {
    if (!categoryId) return null;
  
    return (
      <div className="bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              key="All"
              onClick={() => onSelect('All')}
              className={`px-4 py-2 text-sm rounded-full border ${
                selectedType === 'All' ? 'bg-gray-200 text-gray-700' : 'bg-white text-gray-700 border-gray-300'
              } whitespace-nowrap`}
            >
              All
            </button>
            {subCategories.map((subCategory) => (
              <button
                key={subCategory}
                onClick={() => onSelect(subCategory)}
                className={`px-4 py-2 text-sm rounded-full border ${
                  selectedType === subCategory ? 'bg-gray-200 text-gray-700' : 'bg-white text-gray-700 border-gray-500'
                } whitespace-nowrap`}
              >
                {subCategory}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default FilterTabs;