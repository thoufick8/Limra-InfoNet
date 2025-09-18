// import { User } from '@supabase/supabase-js';

// FIX: Define User interface locally, as it is not exported from '@supabase/supabase-js' in older versions.
export interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

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

// FIX: Changed from an interface to a type alias to fix property inheritance issues from the Supabase `User` type.
export type LoggedInUser = User & {
    // you can add custom properties here if needed
};

export interface Advertisement {
  id: number;
  created_at: string;
  title: string;
  ad_description: string;
  image_url: string;
  ad_link: string;
  status: boolean;
}