import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Phone, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../logo.png";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: 'category' },
    { name: 'Workshops', href: 'workshops' },
    { name: 'About Us', href: 'about' }
  ];

  const categories = [
    'Sarees',
    'Dress Materials',
    'Dupattas',
    'Suits',
    'Bed Sheets',
    'Cut Pieces',
    'Fabrics'
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <header className={`sticky top-0 bg-white shadow-sm transition-all duration-300 z-50 ${scrolled ? 'py-2 shadow-md' : 'py-0'}`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 text-white">
        <div className="container mx-auto px-4 flex justify-between items-center py-1">
          <div className="flex items-center space-x-2 text-xs">
            <Phone className="h-3 w-3" />
            <span>+91 1234567890</span>
          </div>
          <div className="text-xs">
            Free shipping on orders over ₹999
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <Link to="/account" className="flex items-center hover:underline">
              <User className="h-3 w-3 mr-1" /> My Account
            </Link>
            <Link to="/cart" className="flex items-center hover:underline">
              <ShoppingCart className="h-3 w-3 mr-1" /> Cart (0)
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="Fakira Fab Logo"
              className={`h-16 transition-all duration-300 ${scrolled ? 'h-12' : 'h-16'}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 mx-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-800 hover:text-red-700 font-medium transition-colors duration-200 relative group text-sm uppercase tracking-wider"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search sarees, dress materials, fabrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-700 text-white p-1 rounded-full hover:bg-red-800 transition-colors duration-200">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-4 ml-4">
            <Link to="/wishlist" className="p-2 text-gray-700 hover:text-red-700 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </Link>
            <Link to="/cart" className="p-2 text-gray-700 hover:text-red-700 relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-red-700 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Category Navigation */}
        <div className="hidden md:flex justify-center py-3 border-t border-gray-100">
          <div className="flex space-x-6">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase().replace(' ', '-')}`}
                className="text-xs font-medium text-gray-600 hover:text-red-700 transition-colors duration-200 uppercase tracking-wider"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-white z-50 mt-20 overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Search */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative mb-6"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-700">
                  <Search className="h-5 w-5" />
                </button>
              </motion.div>

              {/* Mobile Navigation */}
              <motion.nav 
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2 mb-8"
              >
                {navigationItems.map((item) => (
                  <motion.div key={item.name} variants={itemVariants}>
                    <Link
                      to={item.href}
                      className="block py-3 px-4 text-gray-800 hover:bg-red-50 hover:text-red-700 font-medium rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Mobile Categories */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="border-t pt-6"
              >
                <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">SHOP BY CATEGORY</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase().replace(' ', '-')}`}
                      className="text-sm py-2 px-3 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-md transition-colors duration-200 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{category}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Account Links */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="border-t pt-6 mt-6"
              >
                <div className="flex space-x-4">
                  <Link
                    to="/account"
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-md transition-colors duration-200 text-center text-sm font-medium flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" /> Account
                  </Link>
                  <Link
                    to="/cart"
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-md transition-colors duration-200 text-center text-sm font-medium flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> Cart (0)
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;