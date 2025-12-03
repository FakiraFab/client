import React, { useState } from 'react';
import { ChevronDown, Palette, Ruler, Shirt, Hash, Layers, Package } from 'lucide-react';

interface ModernProductSpecsProps {
  product: any;
  getCurrentColor: () => string;
}

type SpecKey = 'material' | 'color' | 'style' | 'length' | 'blousePiece' | 'designNo';

const AccordionItem: React.FC<{
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  showChevron?: boolean;
}> = ({ title, children, isOpen, onToggle, showChevron = true }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full px-4 lg:px-6 py-4 flex items-center justify-between hover:bg-gray-100 hover:bg-opacity-5 transition-colors text-left"
    >
      <span className="font-medium text-gray-900 text-sm lg:text-base">{title}</span>
      {showChevron && (
        <ChevronDown
          className={`w-5 h-5 text-[#7F1416] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      )}
    </button>
    {isOpen && (
      <div className="px-4 lg:px-6 py-4  bg-opacity-5 text-black-700 text-sm border-t border-gray-200">
        {children}
      </div>
    )}
  </div>
);

const ModernProductSpecs: React.FC<ModernProductSpecsProps> = ({ product, getCurrentColor }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    productDescription: false,
    productSpecifications: false,
    disclaimer: false,
    shippingPolicy: false,
    returnPolicy: false,
    washCare: false,
    reviews: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const specIcons: Record<SpecKey, React.JSX.Element> = {
    material: <Layers className="w-4 h-4" />,
    color: <Palette className="w-4 h-4" />,
    style: <Shirt className="w-4 h-4" />,
    length: <Ruler className="w-4 h-4" />,
    blousePiece: <Package className="w-4 h-4" />,
    designNo: <Hash className="w-4 h-4" />
  };

  const specifications: { key: SpecKey; label: string; value: string }[] = [
    { key: 'material', label: 'Material', value: product.specifications?.material },
    { key: 'color', label: 'Color', value: getCurrentColor() },
    { key: 'style', label: 'Style', value: product.specifications?.style },
    { key: 'length', label: 'Length', value: product.specifications?.length },
    { key: 'blousePiece', label: 'Blouse Piece', value: product.specifications?.blousePiece },
    { key: 'designNo', label: 'Design No', value: product.specifications?.designNo }
  ];

  const reviewCount = product.reviewCount || 525;

  return (
    <div className="mt-8 lg:mt-12 max-w-full">
      <div className="bg-white  rounded-lg overflow-hidden">
        {/* Material - Non-collapsible */}
        <div className="px-4 lg:px-6 py-4   bg-opacity-5">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium font-semibold text-[#7F1416]">Material:</span>
            <span className="text-sm lg:text-base font-semibold text-[#7F1416]">
              {product.specifications?.material || 'N/A'}
            </span>
          </div>
        </div>

        {/* Accordion Items */}
        <div>
          {/* Product Description */}
          <AccordionItem
            title="Product Description"
            isOpen={expandedSections.productDescription}
            onToggle={() => toggleSection('productDescription')}
          >
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {product.fullDescription || product.description || 'No description available'}
            </p>
          </AccordionItem>

          {/* Product Specifications */}
          <AccordionItem
            title="Product Specifications"
            isOpen={expandedSections.productSpecifications}
            onToggle={() => toggleSection('productSpecifications')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specifications.map((spec) => (
                spec.value && (
                  <div key={spec.key} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="flex-shrink-0 text-gray-600 mt-0.5">
                      {specIcons[spec.key]}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-0.5">
                        {spec.label}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {spec.value}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </AccordionItem>

          {/* Disclaimer */}
          <AccordionItem
            title="Disclaimer"
            isOpen={expandedSections.disclaimer}
            onToggle={() => toggleSection('disclaimer')}
          >
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {product.disclaimer || 'Slight irregularities, color variations, and smudges are natural signs of authentic handmade work. Actual colors may vary. Size may differ by 1–2 inches.'}
            </p>
          </AccordionItem>

          {/* Shipping Policy */}
          <AccordionItem
            title="Shipping Policy"
            isOpen={expandedSections.shippingPolicy}
            onToggle={() => toggleSection('shippingPolicy')}
          >
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {product.shippingPolicy || 'Ships in 2–4 working days. Delivery in 4–8 days. Tracking provided. Secure packaging.'}
            </p>
          </AccordionItem>

          {/* Return Policy */}
          <AccordionItem
            title="Return Policy"
            isOpen={expandedSections.returnPolicy}
            onToggle={() => toggleSection('returnPolicy')}
          >
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {product.returnPolicy || 'Accepted only for damaged, defective, or incorrect items with an unboxing video within 24 hours. No returns for minor variations. Used or washed items are not eligible.'}
            </p>
          </AccordionItem>

          {/* Wash Care & Manufacturer Info */}
          <AccordionItem
            title="Wash Care and Manufacturer Info"
            isOpen={expandedSections.washCare}
            onToggle={() => toggleSection('washCare')}
          >
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {product.washcare || 'Hand wash separately in cold water. Use mild detergent. Do not bleach. Dry in shade. Iron on low/medium heat. Avoid soaking during the first wash.'}
            </p>
          </AccordionItem>

          {/* Reviews */}
          <AccordionItem
            title={`Reviews (${reviewCount})`}
            isOpen={expandedSections.reviews}
            onToggle={() => toggleSection('reviews')}
          >
            <div className="text-center py-8 text-gray-500">
              Reviews section coming soon. Total reviews: {reviewCount}
            </div>
          </AccordionItem>
        </div>
      </div>
    </div>
  );
};

export default ModernProductSpecs;