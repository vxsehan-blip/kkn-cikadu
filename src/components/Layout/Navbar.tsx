import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useScrollShrink } from '../../hooks/useScrollShrink';

// Import logo sebagai URL - sesuaikan path dengan struktur folder
import logoUrl from '../../assets/logo-new.svg';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const isScrolled = useScrollShrink();
  const location = useLocation();

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/about' },
    { name: 'Berita', path: '/news' },
    { name: 'Ekonomi', path: '/business' },
    { name: 'Peta', path: '/map' },
  ];

  const isHomePage = location.pathname === '/';

  // Simplified background logic - always show background except home page when not scrolled
  const showSolidBackground = !isHomePage || isScrolled || isOpen;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolidBackground
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-black/20 to-transparent'
      } py-3`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative">
              <img
                src={logoUrl}
                alt="Logo Desa Cikadu"
                className="h-10 w-10 sm:h-12 sm:w-12 transition-all duration-300 drop-shadow-sm"
              />
            </div>
            <div className="hidden sm:block">
              <span
                className={`text-xl font-bold transition-colors duration-300 ${
                  showSolidBackground
                    ? 'text-gray-900 dark:text-white'
                    : 'text-white drop-shadow-md'
                }`}
              >
                KKN Desa Cikadu
              </span>
              <p
                className={`text-xs transition-colors duration-300 ${
                  showSolidBackground
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-white/80 drop-shadow-sm'
                }`}
              >
                Pelabuhanratu, Sukabumi
              </p>
            </div>
            {/* Mobile title */}
            <span
              className={`sm:hidden text-lg font-bold transition-colors duration-300 ${
                showSolidBackground
                  ? 'text-gray-900 dark:text-white'
                  : 'text-white drop-shadow-md'
              }`}
            >
              KKN Desa Cikadu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                data-scroll-to-top="true"
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? showSolidBackground
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/20 text-white backdrop-blur-sm border border-white/30'
                    : showSolidBackground
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'
                    : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              data-scroll-to-top="false"
              className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                showSolidBackground
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 shadow-sm border border-emerald-200 dark:border-emerald-700/50'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg'
              }`}
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </motion.div>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              data-scroll-to-top="false"
              className={`md:hidden p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                showSolidBackground
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 shadow-sm border border-emerald-200 dark:border-emerald-700/50'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg'
              }`}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={false}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-6 space-y-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  data-scroll-to-top="true"
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-emerald-600 text-white shadow-md transform scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 hover:pl-6'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;