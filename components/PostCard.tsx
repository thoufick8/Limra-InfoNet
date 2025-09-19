
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { ChevronRight } from 'lucide-react';

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

export default PostCard;
