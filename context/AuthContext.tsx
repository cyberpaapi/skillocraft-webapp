'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import type { LoginUser } from '@/types';

type User = Omit<LoginUser, 'role'> & {
  role: 'CUSTOMER';
};

type LoginParams = {
  token: string;
  userData: Omit<User, 'role'>;
};

type AuthContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => void;
  login: (token: string, userData: Omit<User, 'role'>, refreshToken?: string) => void;
};

const CUSTOMER_TOKEN_KEY = 'user_access_token';
const CUSTOMER_REFRESH_TOKEN_KEY = 'user_refresh_token';
const CUSTOMER_USER_DATA = 'user_data';

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoggedIn: false,
  isLoading: true,
  logout: () => {},
  login: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const login = useCallback((token: string, userData: Omit<User, 'role'>, refreshToken?: string) => {
    // Set tokens with 7 day expiration (align with admin)
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    
    Cookies.set(CUSTOMER_TOKEN_KEY, token, { 
      expires,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    // Also set refresh token if provided
    if (refreshToken) {
      Cookies.set(CUSTOMER_REFRESH_TOKEN_KEY, refreshToken, {
        expires,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    }
    
    // Store user data
    const userWithRole = { ...userData, role: 'CUSTOMER' as const };
    Cookies.set(CUSTOMER_USER_DATA, JSON.stringify(userWithRole), { 
      expires,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    // Also persist non-sensitive user data in localStorage for fallback
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(userWithRole));
    }
    
    setUser(userWithRole);
  }, []);

  const logout = useCallback(() => {
    // Clear all customer auth cookies
    [CUSTOMER_TOKEN_KEY, CUSTOMER_REFRESH_TOKEN_KEY, CUSTOMER_USER_DATA].forEach(cookie => {
      Cookies.remove(cookie, { path: '/' });
    });
    if (typeof window !== 'undefined') localStorage.removeItem('user_data');

    setUser(null);
    router.push('/');
  }, [router]);

  useEffect(() => {
    const token = Cookies.get(CUSTOMER_TOKEN_KEY);
    const userDataCookie = Cookies.get(CUSTOMER_USER_DATA);
    const userDataLocal = typeof window !== 'undefined' ? localStorage.getItem('user_data') : null;

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const rawData = userDataCookie || userDataLocal;
      if (rawData) {
        const parsedUser = JSON.parse(rawData);
        if (parsedUser.role === 'CUSTOMER') {
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        isLoggedIn: !!user, 
        isLoading,
        logout,
        login
      }}
    >
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