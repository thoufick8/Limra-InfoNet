
import React from 'react';
import { Link } from 'react-router-dom';
import { Category, Post } from '../types';
import { Search, Youtube, Facebook, Instagram } from 'lucide-react';
import AdSenseBlock from './AdSenseBlock';

interface SidebarProps {
    categories: Category[];
    popularPosts: Post[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, popularPosts, searchQuery, setSearchQuery }) => (
  <aside className="space-y-8 sticky top-20">
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Search</h3>
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search articles..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 pl-4 pr-10 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Categories</h3>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat.id}>
            <Link to={`/category/${cat.name}`} className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">{cat.name}</Link>
          </li>
        ))}
      </ul>
    </div>
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Popular Posts</h3>
      <div className="space-y-4">
        {popularPosts.map(post => (
          <Link to={`/post/${post.id}`} key={post.id} className="flex items-center space-x-3 group">
            <img src={post.image_url || `https://picsum.photos/seed/${post.id}/100/100`} alt={post.title} className="w-16 h-16 rounded-md object-contain bg-gray-200 dark:bg-gray-700" />
            <div>
              <h4 className="font-semibold text-sm text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors line-clamp-2">{post.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Follow Us</h3>
        <div className="flex space-x-4">
            <a href="https://www.youtube.com/@towardsdawahislamic12" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-primary-500"><Youtube /></a>
            <a href="https://www.youtube.com/redirect?event=channel_description&redir_token=QUFFLUhqazkzODZ2MHMwN0dyejY4UGp5N0cxQnZzOHJod3xBQ3Jtc0tscUl0eTFpaEJHVFRyVUkyNE0xMmN0X0Y0QkRPOEthRXhHaV9QUlVOMkJGVG1uUWZBaFk5MU9HMmp1LXZjbVY0UGwwTjNUMm5fLTZvQW9RZW5HaS04YVdpbFJmOGdsOTZGUkt1em9ueFhvcHQ0T0YxOA&q=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100089623753108%26mibextid%3DZbWKwL" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-primary-500"><Facebook /></a>
            <a href="https://www.youtube.com/redirect?event=channel_description&redir_token=QUFFLUhqa0ZLcjBIV0hYS0h2My1uNE9MNVRnaXRJTkg4QXxBQ3Jtc0tudzNGOTh3MXl2WUk4U2kwUXdBcThVX3B6UFFDT1V1RS1HQ0s4c2FwZGU4RVczYTdrMWNwd3VGU1VyQTZxTGhPdmlEZHlld0JhNWNQY2pnQ0lSaWRPWV9DODc3eFpRaHpXUTlfMEJlZlAyRFk2aDVDQQ&q=https%3A%2F%2Finstagram.com%2Ftowards_dawah_12" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-primary-500"><Instagram /></a>
        </div>
    </div>
    {/* AdSense Sidebar Ad - Replace 2345678901 with your ad slot ID */}
    <AdSenseBlock adSlot="2345678901" style={{ display: 'block' }} adFormat="auto" responsive="true" />
  </aside>
);

export default Sidebar;