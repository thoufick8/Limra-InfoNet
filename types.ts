
import { User } from '@supabase/supabase-js';

export interface Post {
  id: number;
  created_at: string;
  title: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  status: 'draft' | 'published';
  summary?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string[] | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  users: { name: string };
}

export interface LoggedInUser extends User {
    // you can add custom properties here if needed
}
