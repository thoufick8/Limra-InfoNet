

import React, { useState } from 'react';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const activeLinkClass = "text-primary-500 dark:text-primary-400";
  const inactiveLinkClass = "text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <ReactRouterDOM.Link to="/" className="flex items-center space-x-2">
              <img 
                className="h-10 w-auto" 
                src="https://i.postimg.cc/Y060Kbvp/Picsart-25-09-18-07-38-03-872.png" 
                alt="Limra InfoNet Logo" 
              />
              <span className="font-serif font-bold text-xl text-gray-800 dark:text-white">Limra InfoNet</span>
            </ReactRouterDOM.Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <ReactRouterDOM.NavLink 
                key={link.name} 
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} font-medium transition-colors`}
              >
                {link.name}
              </ReactRouterDOM.NavLink>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Open menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <ReactRouterDOM.NavLink 
                key={link.name} 
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary-50 dark:bg-gray-800 ' + activeLinkClass : inactiveLinkClass}`}
              >
                {link.name}
              </ReactRouterDOM.NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;