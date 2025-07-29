import React from 'react';
import { Phone, Mail, MapPin, ChevronUp, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const catalogues = [
    'Ajrakh Modal Sarees',
    'Gamthi Sarees',
    'Vanajavat Maheshwari Sarees'
  ];

  const quickLinks = [
    'About Us',
    'Our Policy',
    'FAQ'
  ];

  return (
    <footer className="bg-[#7F1416] from-red-900 to-red-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm opacity-90">Call us at</p>
                  <a href="tel:+91-9911-259-2222" className="hover:text-red-200 transition-colors duration-200">
                    +91-9911-259-2222
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm opacity-90">Email us</p>
                  <a href="mailto:Fakirafab@gmail.com" className="hover:text-red-200 transition-colors duration-200">
                    fakirafab@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4 pt-1">
              <a href="#" className="bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Address</h3>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
              <div className="text-sm leading-relaxed">
                <p>Shop no 6/7, Basement, 78 Netajinagar,</p>
                <p>Motiya Khan Rd, Shahjanabad, Kamal Ganj,</p>
                <p>New Delhi</p>
                <p className="mt-2 font-medium">110002</p>
              </div>
            </div>
            <button className="mt-4 border-1 bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200">
              Get Directions
            </button>
          </div>

          {/* Catalogues */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Catalogues</h3>
              <button className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-all duration-200">
                <ChevronUp className="h-5 w-5" />
              </button>
            </div>
            <ul className="space-y-3">
              {catalogues.map((catalogue, index) => (
                <li key={index}>
                  <Link to="#" className="text-sm hover:text-red-200 transition-colors duration-200 block py-1">
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
                  <Link to="#" className="text-sm hover:text-red-200 transition-colors duration-200 block py-1">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Back to Top */}
            <div className="pt-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm hover:text-red-200 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>Back To Top</span>
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-red-700 mt-12 pt-8 text-center">
          <p className="text-sm opacity-75">
            © 2024 Fakira FAB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
