

import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Comment } from '../../types';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Spinner from '../../components/Spinner';

const ManageComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*, users(name), posts(title)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data as any[]);
    }
    setLoading(false);
  };

  const deleteComment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) {
        console.error('Error deleting comment:', error);
      } else {
        fetchComments();
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Manage Comments</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        {loading ? (
          <div className="flex justify-center p-8"><Spinner /></div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Comment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">In Response To</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {comments.map((comment: any) => (
                <tr key={comment.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white line-clamp-2">{comment.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{comment.users?.name || 'Unknown User'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ReactRouterDOM.Link to={`/post/${comment.post_id}`} className="text-sm text-primary-600 hover:underline dark:text-primary-400 line-clamp-1">
                      {comment.posts?.title || 'Unknown Post'}
                    </ReactRouterDOM.Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => deleteComment(comment.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">
                      <Trash2 className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageComments;