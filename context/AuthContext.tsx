import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
// FIX: Removed imports for AuthChangeEvent, Session, and User as they are not exported in older supabase-js versions.
// import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { LoggedInUser } from '../types';
import type { Session } from '@supabase/supabase-js';


interface AuthContextType {
  user: LoggedInUser | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Replaced supabase.auth.session() with supabase.auth.getSession() for Supabase v2.
    const getInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user as LoggedInUser ?? null);
        setLoading(false);
    }
    
    getInitialSession();

    // FIX: Correctly handle subscription from onAuthStateChange for Supabase v2.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setSession(session);
        setUser(session?.user as LoggedInUser ?? null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
