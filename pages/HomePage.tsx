

import React, { useState, useEffect } from 'react';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Post, Category, Advertisement } from '../types';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import AdSenseBlock from '../components/AdSenseBlock';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const AdvertisementCard = ({ ad }: { ad: Advertisement }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col">
        <a href={ad.ad_link} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
            <img src={ad.image_url} alt={ad.title} className="w-full h-auto object-contain" />
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">{ad.title}</h3>
                {ad.ad_description && <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2 flex-grow">{ad.ad_description}</p>}
                <div className="mt-4 text-primary-600 dark:text-primary-400 font-semibold text-sm flex items-center">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                </div>
            </div>
        </a>
    </div>
);


const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [contentWithAds, setContentWithAds] = useState<(Post | Advertisement)[]>([]);

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

  useEffect(() => {
    const newContentWithAds: (Post | Advertisement)[] = [];
    if (advertisements.length > 1) {
        let adIndex = 1; // Start from the second ad for in-feed placement
        for (let i = 0; i < filteredPosts.length; i++) {
            newContentWithAds.push(filteredPosts[i]);
            if ((i + 1) % 3 === 0 && adIndex < advertisements.length) {
                newContentWithAds.push(advertisements[adIndex]);
                adIndex++;
            }
        }
    } else {
        newContentWithAds.push(...filteredPosts);
    }
    setContentWithAds(newContentWithAds);
  }, [filteredPosts, advertisements]);


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
              <ReactRouterDOM.Link to={`/post/${post.id}`} className="block relative h-64 rounded-lg overflow-hidden group bg-gray-200 dark:bg-gray-700">
                <img src={post.image_url || `https://picsum.photos/seed/${post.id}/500/300`} alt={post.title} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4">
                  <h3 className="text-white text-lg font-bold">{post.title}</h3>
                </div>
              </ReactRouterDOM.Link>
            </SwiperSlide>
          ))}
        </Swiper>
         <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-0 z-10 p-2 bg-white/50 dark:bg-black/50 rounded-full cursor-pointer hover:bg-white dark:hover:bg-black text-gray-800 dark:text-white"><ChevronLeft /></div>
        <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-0 z-10 p-2 bg-white/50 dark:bg-black/50 rounded-full cursor-pointer hover:bg-white dark:hover:bg-black text-gray-800 dark:text-white"><ChevronRight /></div>
        <div className="swiper-pagination"></div>
      </div>

      {/* AdSense Home Page Banner - Replace 4567890123 with your ad slot ID */}
      <AdSenseBlock adSlot="4567890123" />
      
      {advertisements.length > 0 && (
        <div className="mb-12">
            <a href={advertisements[0].ad_link} target="_blank" rel="noopener noreferrer" className="block group">
                <img 
                    src={advertisements[0].image_url} 
                    alt={advertisements[0].title} 
                    className="w-full h-auto object-contain rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
                />
            </a>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contentWithAds.length > 0 ? (
                contentWithAds.map((item, index) => {
                  if ('ad_link' in item) { // Type guard for Advertisement
                    return <AdvertisementCard key={`ad-${item.id}-${index}`} ad={item} />;
                  } else { // It's a Post
                    return <PostCard key={item.id} post={item} />;
                  }
                })
            ) : (
                 <p className="text-gray-600 dark:text-gray-400 md:col-span-2">{searchQuery ? 'No articles found matching your search.' : 'No articles available.'}</p>
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