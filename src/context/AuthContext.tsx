// src/context/AuthContext.tsx - DEFINITIVE IMPLEMENTATION
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { IUser } from '@/types'; // We will create this type definition next

// Define the shape of the context value
interface AuthContextType {
  user: IUser | null;
  login: (jwt: string, userData: IUser) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// The AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This effect runs once on mount to check for an existing session
    const checkUserSession = async () => {
      const token = getCookie('jwt');
      if (token) {
        try {
          // If a token exists, validate it by fetching user data
          const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user');
          }

          const userData: IUser = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Session validation failed:', error);
          // If validation fails, clear the session
          logout();
        }
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, []);

  const login = (jwt: string, userData: IUser) => {
    // Set the cookie to be stored by the browser
    setCookie('jwt', jwt, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    setUser(userData);
    router.push('/account'); // Redirect to account page after login
  };

  const logout = () => {
    // Delete the cookie and clear the user state
    deleteCookie('jwt');
    setUser(null);
    router.push('/login'); // Redirect to login page after logout
  };

  const value = { user, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
