import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Post, Category, Advertisement } from '../types';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { Search, ChevronRight, ChevronLeft, Twitter, Facebook, Instagram } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const PostCard = ({ post }: { post: Post }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <Link to={`/post/${post.id}`}>
        <img src={post.image_url || `https://picsum.photos/seed/${post.id}/400/250`} alt={post.title} className="w-full h-48 object-cover" />
        <div className="p-5">
          <span className="text-sm text-primary-500 dark:text-primary-400 font-semibold">{post.category || 'Uncategorized'}</span>
          <h3 className="mt-2 text-lg font-bold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">{post.title}</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{post.content.substring(0, 100)}...</p>
          <div className="mt-4 text-primary-600 dark:text-primary-400 font-semibold text-sm flex items-center">
            Read More <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </Link>
    </div>
);

const Sidebar = ({ categories, popularPosts, searchQuery, setSearchQuery }: { categories: Category[], popularPosts: Post[], searchQuery: string, setSearchQuery: (query: string) => void }) => (
  <aside className="space-y-8">
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
            <img src={post.image_url || `https://picsum.photos/seed/${post.id}/100/100`} alt={post.title} className="w-16 h-16 rounded-md object-cover" />
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
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500"><Twitter /></a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500"><Facebook /></a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500"><Instagram /></a>
        </div>
    </div>
  </aside>
);


const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData || []);
        setTrendingPosts(postsData.slice(0, 5) || []);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        const { data: adsData, error: adsError } = await supabase
            .from('advertisements')
            .select('*')
            .eq('status', true);

        if (adsError) throw adsError;
        setAdvertisements(adsData || []);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
        setFilteredPosts(posts);
    } else {
        setFilteredPosts(
            posts.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }
  }, [searchQuery, posts]);


  if (loading) {
    return <Layout><div className="flex justify-center items-center h-96"><Spinner /></div></Layout>;
  }

  return (
    <Layout>
      <div className="mb-12 relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Trending Blogs</h2>
         <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{ clickable: true, el: '.swiper-pagination' }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="mySwiper"
        >
          {trendingPosts.map(post => (
            <SwiperSlide key={post.id}>
              <Link to={`/post/${post.id}`} className="block relative h-64 rounded-lg overflow-hidden group">
                <img src={post.image_url || `https://picsum.photos/seed/${post.id}/500/300`} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4">
                  <h3 className="text-white text-lg font-bold">{post.title}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
         <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-0 z-10 p-2 bg-white/50 dark:bg-black/50 rounded-full cursor-pointer hover:bg-white dark:hover:bg-black text-gray-800 dark:text-white"><ChevronLeft /></div>
        <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-0 z-10 p-2 bg-white/50 dark:bg-black/50 rounded-full cursor-pointer hover:bg-white dark:hover:bg-black text-gray-800 dark:text-white"><ChevronRight /></div>
        <div className="swiper-pagination"></div>
      </div>

      {advertisements.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advertisements.map(ad => (
              <a href={ad.ad_link} key={ad.id} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <img src={ad.image_url} alt={ad.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">{ad.title}</h3>
                  <div className="mt-4 text-primary-600 dark:text-primary-400 font-semibold text-sm flex items-center">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
            ) : (
                 <p className="text-gray-600 dark:text-gray-400 md:col-span-2">No articles found matching your search.</p>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <Sidebar categories={categories} popularPosts={posts.slice(0, 4)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;