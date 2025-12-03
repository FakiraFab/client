import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface FilterState {
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  attributes?: Record<string, string[]>;
  sort?: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onClear?: () => void;
  initialFilters?: FilterState;
  availableFilters?: {
    subcategories?: string[];
    colors?: string[];
    attributes?: Record<string, string[]>;
  };
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  onApply,
  onClear,
  initialFilters = {},
  availableFilters = {},
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Update internal filters when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus trap: focus first element
      firstFocusableRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {};
    setFilters(clearedFilters);
    if (onClear) {
      onClear();
    } else {
      onApply(clearedFilters);
    }
    onClose();
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFilters(prev => ({
      ...prev,
      subcategory: prev.subcategory === subcategory ? undefined : subcategory,
    }));
  };

  const handleColorChange = (color: string) => {
    setFilters(prev => {
      const colors = prev.colors || [];
      const newColors = colors.includes(color)
        ? colors.filter(c => c !== color)
        : [...colors, color];
      return {
        ...prev,
        colors: newColors.length > 0 ? newColors : undefined,
      };
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue,
    }));
  };

  const handleAttributeChange = (attrName: string, value: string) => {
    setFilters(prev => {
      const attributes = prev.attributes || {};
      const attrValues = attributes[attrName] || [];
      const newValues = attrValues.includes(value)
        ? attrValues.filter(v => v !== value)
        : [...attrValues, value];
      
      const newAttributes = {
        ...attributes,
        [attrName]: newValues,
      };

      // Remove empty attribute arrays
      if (newValues.length === 0) {
        delete newAttributes[attrName];
      }

      return {
        ...prev,
        attributes: Object.keys(newAttributes).length > 0 ? newAttributes : undefined,
      };
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
        className={`fixed inset-y-0 left-0 z-50 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="filter-drawer-title" className="text-xl font-semibold text-gray-900">
            Filters
          </h2>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto h-[calc(100vh-140px)] px-6 py-4">
          {/* Subcategory Filter */}
          {availableFilters.subcategories && availableFilters.subcategories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                {availableFilters.subcategories.map((subcategory) => (
                  <label
                    key={subcategory}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.subcategory === subcategory}
                      onChange={() => handleSubcategoryChange(subcategory)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                      {subcategory}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="min-price" className="block text-xs text-gray-600 mb-1">
                  Min Price
                </label>
                <input
                  id="min-price"
                  type="number"
                  min="0"
                  step="100"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  placeholder="₹0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="block text-xs text-gray-600 mb-1">
                  Max Price
                </label>
                <input
                  id="max-price"
                  type="number"
                  min="0"
                  step="100"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  placeholder="₹10000"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Color Filter */}
          {availableFilters.colors && availableFilters.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Colors</h3>
              <div className="space-y-2">
                {availableFilters.colors.map((color) => (
                  <label
                    key={color}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.colors?.includes(color) || false}
                      onChange={() => handleColorChange(color)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                      {color}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Attributes */}
          {availableFilters.attributes &&
            Object.entries(availableFilters.attributes).map(([attrName, attrValues]) => (
              <div key={attrName} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 capitalize">
                  {attrName}
                </h3>
                <div className="space-y-2">
                  {attrValues.map((value) => (
                    <label
                      key={value}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.attributes?.[attrName]?.includes(value) || false}
                        onChange={() => handleAttributeChange(attrName, value)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                        {value}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Footer - Fixed */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
