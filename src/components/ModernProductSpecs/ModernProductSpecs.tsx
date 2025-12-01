import React, { useEffect, useCallback } from 'react';
import { Info, Package, Palette, Ruler, Shirt, Hash, Layers, X } from 'lucide-react';
import type { Product } from '../../types';

interface ModernProductSpecsProps {
  product: Product;
  getCurrentColor: () => string;
  mode?: 'drawer' | 'inline';
  onClose?: () => void;
}

type SpecKey = 'material' | 'color' | 'style' | 'length' | 'blousePiece' | 'designNo';

// Helper to normalize color strings for display
const normalizeColor = (color: string | undefined): string => {
  if (!color) return 'N/A';
  // Capitalize first letter of each word
  return color
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const ModernProductSpecs: React.FC<ModernProductSpecsProps> = ({ 
  product, 
  getCurrentColor, 
  mode = 'inline',
  onClose 
}) => {
  const specIcons: Record<SpecKey, React.JSX.Element> = {
    material: <Layers className="w-4 h-4" />,
    color: <Palette className="w-4 h-4" />,
    style: <Shirt className="w-4 h-4" />,
    length: <Ruler className="w-4 h-4" />,
    blousePiece: <Package className="w-4 h-4" />,
    designNo: <Hash className="w-4 h-4" />
  };

  const specifications: { key: SpecKey; label: string; value: string }[] = [
    { key: 'material', label: 'Material', value: product?.specifications?.material || 'N/A' },
    { key: 'color', label: 'Color', value: normalizeColor(getCurrentColor()) },
    { key: 'style', label: 'Style', value: product?.specifications?.style || 'N/A' },
    { key: 'length', label: 'Length', value: product?.specifications?.length || 'N/A' },
    { key: 'blousePiece', label: 'Blouse Piece', value: product?.specifications?.blousePiece || 'N/A' },
    { key: 'designNo', label: 'Design No', value: product?.specifications?.designNo || 'N/A' }
  ];

  // Handle Escape key to close drawer
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && mode === 'drawer' && onClose) {
      onClose();
    }
  }, [mode, onClose]);

  useEffect(() => {
    if (mode === 'drawer') {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [mode, handleKeyDown]);

  // Drawer mode wrapper classes
  const drawerClasses = mode === 'drawer' 
    ? 'fixed top-16 right-6 z-50 h-[calc(100vh-4rem)] w-full max-w-md bg-white shadow-2xl rounded-xl overflow-auto p-6'
    : 'mt-8 lg:mt-12 max-w-4xl mx-auto';

  return (
    <div className={drawerClasses} role={mode === 'drawer' ? 'dialog' : undefined} aria-modal={mode === 'drawer' ? 'true' : undefined} aria-label={mode === 'drawer' ? 'Product Specifications' : undefined}>
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="px-4 lg:px-6 py-3 lg:py-4 bg-gradient-to-r from-red-50 to-red-100">
            <div className="flex items-center justify-between gap-2 text-[#7F1416] text-sm lg:text-base font-medium">
              <div className="flex items-center gap-2 flex-1 justify-center">
                <Info className="w-4 h-4" />
                Product Specifications
              </div>
              {mode === 'drawer' && onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-[#7F1416] hover:bg-red-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Close specifications panel"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            {/* Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specifications.map((spec, index) => (
                <div
                  key={spec.key}
                  className="group p-4 rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:from-red-50 hover:to-white"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="text-[#7F1416] group-hover:text-[#651012]">
                        {specIcons[spec.key]}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        {spec.label}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {spec.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Features */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#7F1416] to-[#5D0F11] rounded-2xl text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Key Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl text-[#7F1416] font-bold">100%</div>
                  <div className="text-sm opacity-90 text-[#7F1416]">Authentic</div>
                </div>
                <div className="text-center p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-[#7F1416]">{product?.specifications?.length || '5.5m'}</div>
                  <div className="text-sm opacity-90 text-[#7F1416]">Length</div>
                </div>
                <div className="text-center p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-[#7F1416]">Premium</div>
                  <div className="text-sm opacity-90 text-[#7F1416]">Quality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Indicators */}
      <div className="bg-gray-50 rounded-b-2xl border-t border-gray-100 px-8 py-6">
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#7F1416] rounded-full"></div>
            <span>Authentic Product</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#A91B1E] rounded-full"></div>
            <span>Quality Assured</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D12126] rounded-full"></div>
            <span>Handcrafted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#F02D33] rounded-full"></div>
            <span>Traditional Design</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProductSpecs;