import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import logo from "../logo.png";


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: 'category' },
    { name: 'Workshops', href: 'workshops' },
    { name: 'About Us', href: 'about' }
  ];

  const categories = [
    'Sarees',
    'Dress Materials',
    'dupattas',
    'Suits',
    'Bed Sheets',
    'Cut pieces',
    'Fabrics'
  ];

  return (
    <header className="bg-white shadow-md relative z-50">
      {/* Top Bar */}
  <div className="bg-[#7F1416]  from-red-900 to-red-800 text-white py-2">
  <div className="container mx-auto px-4 flex justify-between items-center">
    <div className="flex justify-center w-full">
      <img
        src={logo}
        alt="Fakira Fab Logo"
        className="h-20 mx-auto"
      />
    </div>

    <button className="bg-white text-red-900 px-4 py-1 rounded-full text-sm font-medium hover:bg-red-50 transition-colors duration-200">
      CONTACT US
    </button>
  </div>
</div>


      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-red-900">
            Fakira Fab
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-red-900 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-900 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Category Navigation */}
        <div className="hidden md:flex justify-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-8">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category}`}
                className="text-sm text-gray-600 hover:text-red-900 transition-colors duration-200 py-2"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
          <div className="p-4">
            {/* Mobile Search */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-4 mb-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-gray-700 hover:text-red-900 font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Categories */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">CATEGORIES</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`#${category.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-gray-600 hover:text-red-900 transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
