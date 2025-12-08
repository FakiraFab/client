import React from 'react';
import { Phone, Mail, MapPin, ChevronUp, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link} from 'react-router-dom';

const Footer: React.FC = () => {
  const catalogues = [
    'Sarees',
    'dupattas',
    'Bed Sheets',
  ];

  const quickLinks = [
    'about',
    'OurPolicy',
    'FAQ',
    'Blog'
  ];

  return (
    <footer className="bg-[#7F1416] text-white w-full">
      {/* Main Footer Content */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm opacity-90">Call us at</p>
                    <a 
                      href="tel:+91-99980-42577" 
                      className="hover:text-red-200 transition-colors duration-200 text-sm break-all"
                    >
                      +91-99980-42577
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm opacity-90">Email us</p>
                    <a 
                      href="mailto:fakirafab@gmail.com" 
                      className="hover:text-red-200 transition-colors duration-200 text-sm break-all"
                    >
                      fakirafab2410@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex space-x-4 pt-1">
                <a 
                  href="https://www.instagram.com/fakira_fab16/?hl=en" 
                  className="p-2  bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.facebook.com/61579176027688/" 
                  className="p-2  bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="p-2  bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Address</h3>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <div className="text-sm leading-relaxed min-w-0">
                  <p>Shop number 7, 1 Besides Ashapuranagar,</p>
                  <p>Khodiyar Nagar Rd, Khodiyarnagar, Behrampura,</p>
                  <p>Ahmedabad, Gujarat 382405</p>
                  <p className="mt-2 font-medium">382405</p>
                </div>
              </div>
              <div className="mt-4">
                <a 
                  href="https://share.google/gX6wW8ruKmNVmUhXs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block border border-white border-opacity-150  bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  View on Google Maps
                </a>
              </div>
            </div>

            {/* Catalogues */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Catalogues</h3>
                <button 
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-all duration-200 lg:hidden"
                  aria-label="Toggle catalogues"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
              <ul className="space-y-3">
                {catalogues.map((catalogue, index) => (
                  <li key={index}>
                    <Link 
                      to={`/category/${catalogue}`} 
                      className="text-sm hover:text-red-200 transition-colors duration-200 block py-1"
                    >
                      {catalogue}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link} 
                      className="text-sm hover:text-red-200 transition-colors duration-200 block py-1"
                    >
                      {link.charAt(0).toUpperCase() + link.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Back to Top */}
              <div className="pt-4">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm hover:text-red-200 transition-colors duration-200 flex items-center space-x-1"
                  aria-label="Back to top"
                >
                  <span>Back To Top</span>
                  <ChevronUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Full Width */}
      <div className="w-full border-t border-red-700 border-opacity-50">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <div className="text-center">
            <p className="text-sm opacity-75">
              © 2025 Fakira FAB. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;