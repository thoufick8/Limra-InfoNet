

import React, { useState } from 'react';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for EmailJS integration
    console.log(`Subscribing with email: ${email}`);
    setMessage('Thank you for subscribing!');
    setEmail('');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">About Limra InfoNet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Limra InfoNet is your premier destination for AI-powered insights, covering everything from the latest in technology and Islamic knowledge to trending news and lifestyle tips. Our mission is to provide high-quality, informative, and engaging content.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><ReactRouterDOM.Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-500">About Us</ReactRouterDOM.Link></li>
              <li><ReactRouterDOM.Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-500">Contact</ReactRouterDOM.Link></li>
              <li><ReactRouterDOM.Link to="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-primary-500">Privacy Policy</ReactRouterDOM.Link></li>
              <li><ReactRouterDOM.Link to="/copyright" className="text-gray-600 dark:text-gray-400 hover:text-primary-500">Copyright</ReactRouterDOM.Link></li>
              <li><ReactRouterDOM.Link to="/terms-and-conditions" className="text-gray-600 dark:text-gray-400 hover:text-primary-500">Terms & Conditions</ReactRouterDOM.Link></li>
              <li><ReactRouterDOM.Link to="/admin" className="text-gray-600 dark:text-gray-400 hover:text-primary-500">Admin Panel</ReactRouterDOM.Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Stay updated with our latest articles.</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-white"
                required
              />
              <button
                type="submit"
                className="bg-primary-600 text-white p-3 rounded-r-md hover:bg-primary-700 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Limra InfoNet. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;