import React, { useState } from 'react';
import { Package, Truck, Heart } from 'lucide-react';

const ProductInfoTabs = () => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'DESCRIPTION', icon: null },
    { id: 'washcare', label: 'WASH CARE', icon: null },
    { id: 'shipping', label: 'SHIPPING & RETURNS', icon: null },
    { id: 'mindful', label: 'BE MINDFUL OF', icon: null }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">Slight variation in color and print is the part of process.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">100% cotton, hand block printed with natural dyes.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">2 Side pockets.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">Full Length is 46"-48".</span>
              </li>
            </ul>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Package className="w-5 h-5" />
                <span>Free shipping on order above 2000</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Package className="w-5 h-5" />
                <span>COD available</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Heart className="w-5 h-5" />
                <span>Use code VBLOVE on your first buy</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="w-5 h-5" />
                <span>Express Delivery</span>
              </div>
            </div>
          </div>
        );
      
      case 'washcare':
        return (
          <div className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">Gentle hand wash (separately in cold water) or dry clean only.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">Do not soak, do not dry in direct sunlight.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">Do not use fabric softeners, bleach or starch.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">
                  For more information please visit{' '}
                  <a href="#" className="text-blue-600 underline hover:text-blue-800">
                    Product Care
                  </a>
                </span>
              </li>
            </ul>
          </div>
        );
      
      case 'shipping':
        return (
          <div className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">Your order will reach you in 4-12 business days.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">We happily accept exchanges within 3 days of order receipt or give a store credit of 12 months validity.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">We do not offer Refunds.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">
                  For more information please visit{' '}
                  <a href="#" className="text-blue-600 underline hover:text-blue-800">
                    Shipping & Returns
                  </a>
                </span>
              </li>
            </ul>
          </div>
        );
      
      case 'mindful':
        return (
          <div className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">This product is hand block printed with natural dyes and there might be slight irregularities in color and prints.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">The colors seen in the image may vary from the actual product due to different screen resolutions/displays and also because the products are photographed under controlled lighting.</span>
              </li>
            </ul>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto ">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-gray-800 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductInfoTabs;


