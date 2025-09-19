
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Post, Category } from '../types';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        const { data: popularPostsData, error: popularPostsError } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(4);
        if (popularPostsError) throw popularPostsError;
        setPopularPosts(popularPostsData || []);

      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };
    fetchSidebarData();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const from = (currentPage - 1) * POSTS_PER_PAGE;
        const to = from + POSTS_PER_PAGE - 1;

        let query = supabase
          .from('posts')
          .select('*', { count: 'exact' })
          .eq('status', 'published');
          
        if (searchQuery.trim() !== '') {
            query = query.textSearch('title', `'${searchQuery.trim()}'`);
        }
        
        query = query.order('created_at', { ascending: false }).range(from, to);

        const { data, error, count } = await query;
        
        if (error) throw error;
        
        setPosts(data || []);
        setTotalPosts(count || 0);

      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const debounceFetch = setTimeout(() => {
        fetchPosts();
    }, 300); // Debounce search input

    return () => clearTimeout(debounceFetch);
  }, [currentPage, searchQuery]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const Pagination = () => (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <button
        onClick={() => setCurrentPage(p => p - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 flex items-center"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
      </button>
      <span className="text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(p => p + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 flex items-center"
      >
        Next <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );

  return (
    <Layout>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">All Blog Posts</h1>
           {loading ? (
                <div className="flex justify-center items-center h-96"><Spinner /></div>
            ) : posts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                    {totalPages > 1 && <Pagination />}
                </>
            ) : (
                <p className="text-center text-gray-600 dark:text-gray-400 md:col-span-2">No articles found.</p>
            )}
        </div>
        <div className="lg:col-span-1">
          <Sidebar categories={categories} popularPosts={popularPosts} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
