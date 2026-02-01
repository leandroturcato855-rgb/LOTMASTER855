import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'vendedor' | 'casual';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, role: 'vendedor' | 'admin') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setCasualAccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('casual');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchRole(session.user.id);
      } else {
        const isCasual = localStorage.getItem('loto_casual_access') === 'true';
        if (isCasual) setRole('casual');
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchRole(session.user.id);
      } else {
        setUser(null);
        const isCasual = localStorage.getItem('loto_casual_access') === 'true';
        setRole(isCasual ? 'casual' : 'casual');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setRole(data.role as UserRole);
      } else {
        setRole('casual');
      }
    } catch (err) {
      console.error('Error fetching role:', err);
      setRole('casual');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.user) {
        localStorage.removeItem('loto_casual_access');
        await fetchRole(data.user.id);
      }
      
      return { error };
    } catch (err) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, userRole: 'vendedor' | 'admin') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (!error && data.user) {
        // Create profile with role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              role: userRole,
            }
          ]);
        
        if (profileError) {
          return { error: profileError };
        }
        
        localStorage.removeItem('loto_casual_access');
        await fetchRole(data.user.id);
      }
      
      return { error };
    } catch (err) {
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('loto_casual_access');
    setRole('casual');
    setUser(null);
  };

  const setCasualAccess = () => {
    localStorage.setItem('loto_casual_access', 'true');
    setRole('casual');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signUp, signOut, setCasualAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
