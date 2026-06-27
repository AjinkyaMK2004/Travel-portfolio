import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: User | { email: string; id: string } | null;
  session: Session | { access_token: string } | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isMock: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { email: string; id: string } | null>(null);
  const [session, setSession] = useState<Session | { access_token: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Live Supabase Auth setup
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. Mock Auth Setup for preview mode
      const savedMockSession = localStorage.getItem('mock_admin_session');
      if (savedMockSession) {
        try {
          const sessionData = JSON.parse(savedMockSession);
          setSession({ access_token: sessionData.token });
          setUser({ email: sessionData.email, id: 'mock-admin-uuid-12345' });
        } catch (e) {
          localStorage.removeItem('mock_admin_session');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && !isMock) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSession(data.session);
        setUser(data.user);
      } else {
        // Mock Login Flow
        if (email === 'admin@euroventure.com' && password === 'password123') {
          const mockSession = { token: 'mock-token-xyz-987', email };
          localStorage.setItem('mock_admin_session', JSON.stringify(mockSession));
          setSession({ access_token: mockSession.token });
          setUser({ email: mockSession.email, id: 'mock-admin-uuid-12345' });
          setIsMock(true);
        } else {
          throw new Error('Invalid mock credentials. Try: admin@euroventure.com / password123');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && !isMock) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      // Clean up mock state regardless
      localStorage.removeItem('mock_admin_session');
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = !!user;

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, login, logout, isMock }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
