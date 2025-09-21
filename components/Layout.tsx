import React, { ReactNode, useState, useEffect } from 'react';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '../services/supabaseClient';
import { Advertisement } from '../types';
import AdSenseBlock from './AdSenseBlock';

const TopAdBanner = () => {
    const [ad, setAd] = useState<Advertisement | null>(null);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const { data, error } = await supabase
                    .from('advertisements')
                    .select('*')
                    .eq('status', true);
                
                if (error) throw error;

                if (data && data.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.length);
                    setAd(data[randomIndex]);
                }
            } catch (error) {
                console.error("Error fetching advertisement:", error);
            }
        };

        fetchAd();
    }, []);

    if (!ad) {
        return null;
    }

    return (
        <div className="mb-8">
            <a href={ad.ad_link} target="_blank" rel="noopener noreferrer" className="block group">
                <img 
                    src={ad.image_url} 
                    alt={ad.title} 
                    className="w-full h-auto object-contain rounded-lg shadow-md group-hover:shadow-xl transition-shadow" 
                />
            </a>
        </div>
    );
};


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = ReactRouterDOM.useLocation();
  
  // Define paths where top banner ads should not be displayed.
  const adFreePaths = [
    '/',           // Home page
    '/about',      // About page
    '/contact',    // Contact page
    '/categories', // All categories page
  ];

  // Ads are hidden on exact paths in adFreePaths and on any path starting with '/category/'.
  const showAds = !adFreePaths.includes(location.pathname) && !location.pathname.startsWith('/category/');
  
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAds && (
          <>
            <TopAdBanner />
            {/* AdSense Top Banner - Replace 1234567890 with your ad slot ID */}
            <AdSenseBlock adSlot="1234567890" />
          </>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;