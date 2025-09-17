
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Post } from '../types';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { ChevronRight } from 'lucide-react';

const PostCard = ({ post }: { post: Post }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <Link to={`/post/${post.id}`}>
        <img src={post.image_url || `https://picsum.photos/seed/${post.id}/400/250`} alt={post.title} className="w-full h-48 object-cover" />
        <div className="p-5">
          <h3 className="mt-2 text-lg font-bold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">{post.title}</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{post.content.substring(0, 100)}...</p>
          <div className="mt-4 text-primary-600 dark:text-primary-400 font-semibold text-sm flex items-center">
            Read More <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </Link>
    </div>
);

const CategoryPage = () => {
  const { name } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      if (!name) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('category', name)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error("Error fetching posts by category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByCategory();
  }, [name]);

  if (loading) {
    return <Layout><div className="flex justify-center items-center h-96"><Spinner /></div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Category: <span className="text-primary-600 dark:text-primary-400">{name}</span></h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">No posts found in this category yet.</p>
      )}
    </Layout>
  );
};

export default CategoryPage;
