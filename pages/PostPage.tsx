
import React, { useState, useEffect } from 'react';
// FIX: Use named imports for react-router-dom to resolve hook and component properties.
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Post, Comment } from '../types';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import AdSenseBlock from '../components/AdSenseBlock';
import { Calendar, User as UserIcon, Tag, Share2, Twitter, Facebook, MessageCircle, Send, FileText } from 'lucide-react';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (postError) throw postError;
        setPost(postData as Post);
        
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*, users(name)')
          .eq('post_id', id)
          .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;
        setComments(commentsData as unknown as Comment[]);
        
        if (postData.category) {
            const { data: relatedData, error: relatedError } = await supabase
                .from('posts')
                .select('*')
                .eq('category', postData.category)
                .neq('id', id)
                .limit(3);
            if (relatedError) throw relatedError;
            setRelatedPosts(relatedData || []);
        }

      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !post) return;

    setCommenting(true);
    setCommentError(null);
    const { data, error } = await supabase
        .from('comments')
        .insert({
            post_id: post.id,
            user_id: user.id,
            content: newComment,
        })
        .select('*, users(name)')
        .single();
    
    if (error) {
        console.error('Error posting comment:', error);
        setCommentError(`Failed to post comment: ${error.message}`);
    } else if (data) {
        setComments([data as unknown as Comment, ...comments]);
        setNewComment('');
    }
    setCommenting(false);
  };


  if (loading) {
    return <Layout><div className="flex justify-center items-center h-96"><Spinner /></div></Layout>;
  }

  if (!post) {
    return <Layout><div className="text-center">Post not found.</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] leading-tight font-bold text-gray-900 dark:text-white mb-4 font-serif">{post.title}</h1>
          <div className="flex flex-wrap items-center space-x-4 text-gray-500 dark:text-gray-400 mb-6 text-sm">
            <div className="flex items-center space-x-2"><UserIcon className="w-4 h-4" /><span>By {post.author}</span></div>
            <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{new Date(post.created_at).toLocaleDateString()}</span></div>
            <div className="flex items-center space-x-2"><Tag className="w-4 h-4" /><span>{post.category}</span></div>
          </div>

          {post.summary && (
            <div className="my-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-primary-500">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center mb-2"><FileText className="w-5 h-5 mr-2" /> Quick Summary</h3>
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: post.summary.replace(/\n/g, '<br />') }} />
            </div>
          )}

          <img src={post.image_url || `https://picsum.photos/seed/${post.id}/800/400`} alt={post.title} className="w-full h-auto object-contain rounded-lg mb-8" />

          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: post.content }}></div>

          {/* AdSense In-Article Ad - Replace 3456789012 with your ad slot ID */}
          <AdSenseBlock adSlot="3456789012" />

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Share this post</h3>
            <div className="flex space-x-2">
              <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"><Twitter className="w-5 h-5"/></a>
              <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"><Facebook className="w-5 h-5"/></a>
              <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"><Share2 className="w-5 h-5"/></a>
            </div>
          </div>
        </article>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map(related => (
                        <Link to={`/post/${related.id}`} key={related.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                            <img src={related.image_url || `https://picsum.photos/seed/${related.id}/300/200`} alt={related.title} className="w-full h-auto object-contain" />
                            <div className="p-4">
                                <h3 className="font-bold text-md text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors line-clamp-2">{related.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

        {/* Comments Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
            <MessageCircle className="w-6 h-6 mr-3" />Comments ({comments.length})
          </h2>
          
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              ></textarea>
              <button
                type="submit"
                disabled={commenting}
                className="mt-3 px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 disabled:bg-primary-300 flex items-center"
              >
                {commenting ? <Spinner /> : <><Send className="w-4 h-4 mr-2" /> Post Comment</>}
              </button>
              {commentError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{commentError}</p>}
            </form>
          ) : (
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              <Link to="/login" className="text-primary-500 hover:underline">Log in</Link> to post a comment.
            </p>
          )}

          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-200 font-bold">
                    {comment.users?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-baseline space-x-2">
                    <p className="font-semibold text-gray-800 dark:text-white">{comment.users?.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>
                  </div>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostPage;