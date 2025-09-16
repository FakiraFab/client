import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../logo.png";
import SearchModal from '../SearchModal';
import { useCart } from '../../context/CartContext';
import CartModal from '../CartModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { toggleCart, getCartItemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'All Products', href: 'all-products' },
    { name: 'Categories', href: 'category' },
    { name: 'Workshops', href: 'workshops' },
    { name: 'About Us', href: 'about' }
  ];

  const categories = [
    'Sarees',
    'Unstitch Fabrics',
    'dupattas',
    'Suits',
    'Bed Sheets',
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
      {/* Main Header */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between py-4 relative min-h-[80px]">
            {/* Mobile Menu Button - Only visible on mobile */}
            <div className="md:hidden flex items-center flex-shrink-0">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-red-700 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Logo - Responsive sizing and positioning */}
            <Link 
              to="/" 
              className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none z-10"
            >
              <img
                src={logo}
                alt="Fakira Fab Logo"
                className={`h-12 sm:h-14 md:h-16 transition-all duration-300 object-contain max-w-full ${
                  scrolled ? 'h-10 sm:h-12 md:h-12' : 'h-12 sm:h-14 md:h-16'
                }`}
                style={{
                  maxHeight: scrolled ? '48px' : '64px',
                  width: 'auto'
                }}
              />
            </Link>

            {/* Desktop Navigation - Hidden on smaller screens to prevent overflow */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8 mx-4 xl:mx-8 flex-shrink-0">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-800 hover:text-red-700 font-medium transition-colors duration-200 relative group text-sm uppercase tracking-wider whitespace-nowrap"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Desktop Search Bar - Responsive width */}
            <div className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-xl min-w-0">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search sarees, dress materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={() => setIsSearchModalOpen(true)}
                  className="w-full py-2 px-4 pr-10 xl:pr-16 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-red-300 hover:shadow-sm text-sm"
                  readOnly
                />
                <button 
                  onClick={() => setIsSearchModalOpen(true)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-700 text-white p-1 rounded-full hover:bg-red-800 hover:scale-110 transition-all duration-200"
                >
                  <Search className="h-4 w-4" />
                </button>
                {/* Keyboard shortcut indicator - Only on larger screens */}
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 hidden xl:block">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600">⌘K</kbd>
                </div>
              </div>
            </div>

            {/* Icons - Responsive spacing and sizing */}
            <div className="flex items-center space-x-2 md:space-x-3 xl:space-x-4 flex-shrink-0">
              {/* Mobile Search Icon */}
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="lg:hidden p-2 text-gray-700 hover:text-red-700 transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist Icon */}
              <Link 
                to="/wishlist" 
                className="p-2 text-gray-700 hover:text-red-700 relative transition-colors duration-200"
                aria-label="Wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-[16px]">0</span>
              </Link>

              {/* Cart Icon */}
              <button 
                onClick={toggleCart}
                className="p-2 text-gray-700 hover:text-red-700 relative cursor-pointer transition-colors duration-200"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-[16px]">
                  {getCartItemCount()}
                </span>
              </button>
            </div>
          </div>

          {/* Category Navigation - Desktop only, responsive text */}
          <div className="hidden md:flex justify-center py-3 border-t border-gray-100 overflow-x-auto">
            <div className="flex space-x-4 lg:space-x-6 px-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category}`}
                  className="text-xs font-medium text-gray-600 hover:text-red-700 transition-colors duration-200 uppercase tracking-wider whitespace-nowrap"
                >
                  {category}
                </Link>
              ))}
            </div>
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
                      to={`/category/${category}`}
                      className="text-sm py-2 px-3 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-md transition-colors duration-200 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="truncate">{category}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto opacity-70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="flex justify-center">
                  <Link
                    to="/account"
                    className="py-2 px-4 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-md transition-colors duration-200 text-center text-sm font-medium flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" /> My Account
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Cart Modal */}
      <CartModal />
    </header>
  );
};

export default Header;