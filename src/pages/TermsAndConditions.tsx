import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Seo from '../components/Seo/Seo';
import JsonLd from '../components/Seo/JsonLd';

interface Section {
  id: string;
  title: string;
  content: string | string[];
}

const TermsAndConditions: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['introduction']));

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const sections: Section[] = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: 'Fakira Fab is based in Ahmedabad and dedicated to manufacturing and selling premium hand-block-printed fabrics, garments, and accessories. These Terms & Conditions apply to all users, visitors, and customers of the website.'
    },
    {
      id: 'use-of-website',
      title: 'Use of Website',
      content: [
        'The content, images, designs, and products featured on this website are the property of Fakira Fab.',
        'You may not copy, reproduce, modify, or distribute any material without prior written permission from Fakira Fab.',
        'You agree not to misuse the website or engage in any activity that disrupts its functioning.'
      ]
    },
    {
      id: 'products-descriptions',
      title: 'Products & Descriptions',
      content: [
        'We ensure that all products are displayed with accurate descriptions, colors, and details.',
        'As our products are handcrafted using natural dyes, slight variations in color, print, or texture are normal and reflect the authenticity of hand-block printing.',
        'Such natural variations cannot be considered defects.'
      ]
    },
    {
      id: 'pricing-availability',
      title: 'Pricing & Availability',
      content: [
        'All prices listed on the website are final and inclusive of applicable taxes.',
        'Product availability may change based on stock and production cycles.',
        'Fakira Fab reserves the right to update prices or discontinue products without prior notice.'
      ]
    },
    {
      id: 'payment-terms',
      title: 'Payment Terms',
      content: [
        'Only online payment is available.',
        'We accept online payments through secure and trusted payment gateways.',
        'Orders will be processed only after successful payment.',
        'We do not offer Cash on Delivery (COD) or offline payment options.',
        'In case of failed transactions, customers are requested to contact their bank or payment provider.'
      ]
    },
    {
      id: 'shipping-delivery',
      title: 'Shipping & Delivery',
      content: [
        'We dispatch orders within the mentioned processing time.',
        'Delivery timelines may vary depending on location, courier services, and external factors.',
        'Fakira Fab is not responsible for delays caused by logistics partners or circumstances beyond our control.'
      ]
    },
    {
      id: 'returns-exchanges',
      title: 'Returns, Exchanges & Cancellations',
      content: [
        'Due to the nature of handcrafted products, we currently do not offer returns or exchanges unless the product delivered is damaged.',
        'To raise a concern, customers must contact us within 24 hours of delivery with unboxing photos/videos as proof.',
        'Orders once placed cannot be canceled after payment.'
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      content: [
        'All block designs, prints, images, text, brand elements, and product names belong to Fakira Fab.',
        'Any misuse, duplication, or reproduction is strictly prohibited.'
      ]
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      content: [
        'Fakira Fab is not liable for any direct, indirect, incidental, or consequential damages arising from product usage or website access.',
        'We are not responsible for typographical errors or unforeseen technical issues.'
      ]
    },
    {
      id: 'privacy-data',
      title: 'Privacy & Data Security',
      content: [
        'All personal information shared on our website is protected as per our Privacy Policy.',
        'We do not store or misuse payment data; all transactions are handled by secure third-party gateways.'
      ]
    },
    {
      id: 'amendments',
      title: 'Amendments to Terms',
      content: [
        'Fakira Fab may modify or update these Terms & Conditions at any time.',
        'Continued use of the website signifies acceptance of the updated terms.'
      ]
    }
  ];

  return (
    <>
      <Seo
        title="Terms & Conditions | Fakira Fab"
        description="Read our Terms & Conditions for handcrafted fabrics, products, shipping, returns, and policies."
        keywords="terms and conditions, policies, fakira fab"
        url="https://fakira-fab.com/OurPolicy"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Terms & Conditions',
          description: 'Terms and Conditions for Fakira Fab',
          url: 'https://fakira-fab.com/OurPolicy'
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-[#7F1416]  text-white py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-base sm:text-lg text-red-100 max-w-2xl">
              Welcome to Fakira Fab. Please read our Terms & Conditions carefully before making any purchase or using our website.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Intro Box */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 border-l-4 border-red-700">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Fakira Fab</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our website, you agree to follow the Terms & Conditions outlined below. Please read them carefully before making any purchase or using any part of our website.
            </p>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-3 md:space-y-4">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex items-start gap-4 flex-1 text-left">
                    <span className="flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-700 font-bold text-sm">
                      {index + 1}
                    </span>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-red-700 transition-colors duration-200">
                      {section.title}
                    </h3>
                  </div>
                  <span className="flex-shrink-0 ml-4 transition-transform duration-300">
                    {expandedSections.has(section.id) ? (
                      <ChevronUp className="h-5 w-5 md:h-6 md:w-6 text-red-700" />
                    ) : (
                      <ChevronDown className="h-5 w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-red-700" />
                    )}
                  </span>
                </button>

                {/* Section Content */}
                {expandedSections.has(section.id) && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 border-t border-gray-100 animate-in fade-in duration-300">
                    {typeof section.content === 'string' ? (
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        {section.content}
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex gap-3">
                            <span className="flex-shrink-0 inline-block w-2 h-2 rounded-full bg-red-700 mt-2"></span>
                            <span className="text-gray-700 leading-relaxed text-sm md:text-base">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 md:mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 md:p-8 border border-red-200">
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              <span className="font-semibold text-red-700">Last Updated:</span> These Terms & Conditions were last updated in December 2025. We may modify or update these terms at any time. Continued use of the website signifies acceptance of the updated terms. For any questions or concerns regarding these terms, please contact us through our website.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-8 md:mt-12 text-center">
            <p className="text-gray-600 mb-4 text-sm md:text-base">
              Have questions about our Terms & Conditions?
            </p>
            <a
              href="mailto:contact@fakira-fab.com"
              className="inline-flex items-center gap-2 bg-[#7F1416] text-white px-6 md:px-8 py-3  font-medium hover:bg-red-800 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="hidden md:block fixed bottom-0 right-0 opacity-5 pointer-events-none">
          <svg
            className="w-96 h-96 text-red-700"
            fill="currentColor"
            viewBox="0 0 200 200"
          >
            <path d="M100,10 Q150,50 150,100 Q150,150 100,190 Q50,150 50,100 Q50,50 100,10 Z" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
