import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AboutFakiraFab: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    story: true,
    range: false,
    legacy: false,
    sustainability: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-gray-50 to-red-50 py-12 md:py-20 mt-16">
      {/* Header Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="inline-block bg-gradient-to-r from-[#7F1416] to-red-500 bg-clip-text text-transparent text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3">
            Our Heritage
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-[#7F1416]">Fakira Fab</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            The Heritage of Hand Block Printing
          </p>
          <div className="mt-6 w-20 h-1 bg-[#7F1416]  mx-auto "></div>
        </div>

        {/* Intro Text */}
        <div className="prose prose-lg max-w-3xl mx-auto mb-8">
          <p className="text-gray-700 leading-relaxed text-center">
            At Fakira Fab, we celebrate the soul of Indian craftsmanship through our exquisite range of hand-block-printed fabrics, sarees, unstitched materials, dupattas, menswear, and bedsheets. As one of the leading manufacturers, retailers, and wholesalers of premium hand-block-printed textiles, Fakira Fab stands as a proud symbol of India's artistic legacy—reimagined for the modern world.
          </p>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Our Roots Section */}
        <div className="mb-4 bg-white  shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <button
            onClick={() => toggleSection('story')}
            className="w-full px-6 py-5 sm:py-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Our Roots—From Udaipur's Tradition to Ahmedabad's Growth</h3>
            </div>
            <div className="ml-4 flex-shrink-0">
              {expandedSections.story ? (
                <ChevronUp className="w-6 h-6 text-[#7F1416]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </button>
          {expandedSections.story && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-4">
                The story of Fakira Fab begins in the heart of Udaipur, Rajasthan, where our family has been part of the traditional block printing community for generations. In search of better opportunities and a wider platform to share our craft, our family migrated to Ahmedabad in 1960. This move marked the beginning of a journey that connected deep-rooted tradition with modern textile innovation.
              </p>
              <p className="text-gray-700 leading-relaxed">
                In 2001, the brand "Fakira Fab" was formally introduced, evolving from our earlier identity known for "Fakira Print" and "Banjara Dyeing." With this foundation, Fakira Fab began its journey as a trusted name in handcrafted textile artistry, offering authenticity, creativity, and unmatched quality.
              </p>
            </div>
          )}
        </div>

        {/* Craftsmanship Section */}
        <div className="mb-4 bg-white  shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <button
            onClick={() => toggleSection('legacy')}
            className="w-full px-6 py-5 sm:py-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Craftsmanship and Quality—The Heart of Fakira Fab</h3>
            </div>
            <div className="ml-4 flex-shrink-0">
              {expandedSections.legacy ? (
                <ChevronUp className="w-6 h-6 text-[#7F1416]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </button>
          {expandedSections.legacy && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-4">
                At Fakira Fab, every fabric tells a story. Our collections are created using traditional wooden blocks, each intricately carved by skilled artisans to form unique and detailed patterns. These blocks are carefully dipped into natural dyes—derived from plants, minerals, and other organic sources—and pressed onto fabrics by hand. This process, repeated with patience and precision, gives each creation its distinct charm and character.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We take pride in following traditional methods that have been passed down for generations. From Ajrakh and Bagru prints to Sanganeri, Bagh, Fakira, Jahota, Vanaspati, and Flamingo Batik designs, every style reflects a region's heritage and artistic depth. Our use of natural dyes not only enhances the aesthetic appeal but also supports eco-friendly and sustainable textile production—a philosophy deeply embedded in our values.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our team ensures that every step, from printing to finishing, follows strict quality standards and process checks. At Fakira Fab, we believe customers deserve the best value for their money—not only through product quality but also through the story, effort, and art behind every piece.
              </p>
            </div>
          )}
        </div>

        {/* Our Range Section */}
        <div className="mb-4 bg-white  shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <button
            onClick={() => toggleSection('range')}
            className="w-full px-6 py-5 sm:py-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Our Range—From Fabric to Fashion</h3>
            </div>
            <div className="ml-4 flex-shrink-0">
              {expandedSections.range ? (
                <ChevronUp className="w-6 h-6 text-[#7F1416]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </button>
          {expandedSections.range && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-4">
                Fakira Fab offers an extensive collection that caters to both individual customers and bulk buyers across India and abroad.
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex gap-3">
                  <span className="text-[#7F1416] font-bold flex-shrink-0">●</span>
                  <div>
                    <strong className="text-gray-900">Hand Block Printed Fabrics:</strong>
                    <p className="text-gray-700">Our unstitched cotton fabrics are the core of our production. Known for their softness, natural texture, and breathable quality, they are perfect for designers, tailors, and boutique owners who value craftsmanship.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#7F1416] font-bold flex-shrink-0">●</span>
                  <div>
                    <strong className="text-gray-900">Premium Sarees:</strong>
                    <p className="text-gray-700">From elegant Ajrakh and Indigo sarees to the soft grace of Mul Mul and luxurious Saudagiri Assam Silk, our saree collection blends tradition with timeless style.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#7F1416] font-bold flex-shrink-0">●</span>
                  <div>
                    <strong className="text-gray-900">Dupattas:</strong>
                    <p className="text-gray-700">Each hand-block-printed dupatta is designed to complement both ethnic and contemporary outfits, carrying motifs that express art, grace, and authenticity.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#7F1416] font-bold flex-shrink-0">●</span>
                  <div>
                    <strong className="text-gray-900">Men's Collection:</strong>
                    <p className="text-gray-700">Fakira Fab's menswear includes hand-block-printed shirts and kurtas that combine traditional patterns with modern fits—perfect for those who appreciate heritage with comfort.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#7F1416] font-bold flex-shrink-0">●</span>
                  <div>
                    <strong className="text-gray-900">Bedsheets:</strong>
                    <p className="text-gray-700">Our hand-block-printed bedsheets bring warmth and elegance to every home, made with soft cotton and detailed printing that reflects Indian artistry.</p>
                  </div>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed italic">
                Each product at Fakira Fab is a result of art, patience, and passion—crafted by artisans who pour their heart into every print and color combination.
              </p>
            </div>
          )}
        </div>

        {/* Sustainability Section */}
        <div className="mb-4 bg-white  shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <button
            onClick={() => toggleSection('sustainability')}
            className="w-full px-6 py-5 sm:py-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Sustainability and Culture</h3>
            </div>
            <div className="ml-4 flex-shrink-0">
              {expandedSections.sustainability ? (
                <ChevronUp className="w-6 h-6 text-[#7F1416]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </button>
          {expandedSections.sustainability && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-4">
                At Fakira Fab, sustainability is not just a concept—it's a way of life. By using natural dyes and organic materials, we minimize environmental impact and promote responsible fashion. We honor nature's palette—earthy indigos, soft reds, warm yellows, and serene greens—ensuring every product remains safe for the skin and kind to the planet.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We are deeply committed to preserving and promoting India's block printing culture. In every motif and hue, you'll find traces of tradition—stories of artisans, families, and regions that have nurtured this art for centuries. Fakira Fab is more than a brand; it's a movement to keep India's textile heritage alive, relevant, and respected in today's world.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Closing Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mt-12">
        <div className="bg-[#7F1416] px-6 md:px-8 py-8 md:py-10 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Experience the Art of Handcrafted Tradition</h3>
          <p className="text-white/90 leading-relaxed mb-6">
            Welcome to Fakira Fab, where every print reflects a history of craftsmanship, and every fabric carries the touch of heritage. Discover a world where art meets fabric, where tradition meets trend, and where every creation celebrates the timeless beauty of hand block printing.
          </p>
          <p className="text-sm text-white/75 italic">
            Fakira Fab—Preserving India's textile legacy, one print at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutFakiraFab;
