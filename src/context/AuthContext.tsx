'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { IUser } from '@/types';

interface AuthContextType {
  user: IUser | null;
  login: (jwt: string, userData: IUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Helper to fetch fresh user data
  const fetchUser = async (token: string) => {
    try {
      // REVERTED: Back to standard endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/users/me?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store', 
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const userData: IUser = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Session validation failed:', error);
      logout();
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      const token = getCookie('jwt');
      if (token) {
        await fetchUser(token);
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, []);

  const login = (jwt: string, userData: IUser) => {
    setCookie('jwt', jwt, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    
    fetchUser(jwt).then(() => {
        router.push('/account');
    });
  };

  const logout = () => {
    deleteCookie('jwt');
    setUser(null);
    window.dispatchEvent(new Event('auth:logout'));
    router.push('/login');
  };

  const value = { user, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
