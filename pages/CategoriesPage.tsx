

import React, { useState, useEffect } from 'react';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Category } from '../types';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { Hash } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Layout><div className="flex justify-center items-center h-96"><Spinner /></div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center font-serif">
          All Categories
        </h1>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <ReactRouterDOM.Link
                to={`/category/${category.name}`}
                key={category.id}
                className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-center items-center mb-4">
                    <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-200 group-hover:bg-primary-200 dark:group-hover:bg-primary-700 transition-colors">
                        <Hash className="h-6 w-6" />
                    </div>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h2>
              </ReactRouterDOM.Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No categories found.</p>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesPage;