

import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { FileText, Tags, MessageSquare, ArrowRight } from 'lucide-react';
import Spinner from '../../components/Spinner';

const StatCard = ({ title, value, icon: Icon, link }: { title: string, value: number, icon: React.ElementType, link: string }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-200">
                <Icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
        <div className="mt-4">
            <ReactRouterDOM.Link to={link} className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 flex items-center">
                View all <ArrowRight className="ml-1 w-4 h-4" />
            </ReactRouterDOM.Link>
        </div>
    </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ posts: 0, categories: 0, comments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { count: postsCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
        const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
        const { count: commentsCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });

        setStats({
          posts: postsCount || 0,
          categories: categoriesCount || 0,
          comments: commentsCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome back, {user?.email}!</p>

      {loading ? (
        <div className="flex justify-center mt-8"><Spinner /></div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Posts" value={stats.posts} icon={FileText} link="/admin/posts" />
            <StatCard title="Total Categories" value={stats.categories} icon={Tags} link="/admin/categories" />
            <StatCard title="Total Comments" value={stats.comments} icon={MessageSquare} link="/admin/comments" />
        </div>
      )}
      
       <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ReactRouterDOM.Link to="/admin/posts/new" className="text-center px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition">
                    Create New Post
                </ReactRouterDOM.Link>
                 <ReactRouterDOM.Link to="/admin/categories" className="text-center px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    Manage Categories
                </ReactRouterDOM.Link>
                 <ReactRouterDOM.Link to="/admin/comments" className="text-center px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    Moderate Comments
                </ReactRouterDOM.Link>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;