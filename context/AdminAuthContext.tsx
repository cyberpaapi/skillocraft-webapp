'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER' | string;
};

type AdminAuthContextType = {
  isLoading: boolean;
  user: User | null;
  isAdmin: boolean;
  setUser: (u: User | null) => void;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>({
  user: null,
  setUser: () => {},
  isLoading: true,
  isAdmin: false,
  logout: () => {},
});

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();

  const logout = useCallback(() => {
    Cookies.remove("admin_access_token");
    Cookies.remove("admin_refresh_token");
    Cookies.remove("admin_user_email");
    Cookies.remove("admin_user_data");
    setUser(null);
    setIsAdmin(false);
    router.push('/admin/auth');
  }, [router]);

  const fetchUser = useCallback(async () => {
    const token = Cookies.get("admin_access_token");
    const userData = Cookies.get("admin_user_data");
    
    if (!token) {
      setIsLoading(false);
      setUser(null);
      setIsAdmin(false);
      return;
    }

    try {
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'ADMIN');
      } else {
        // If no user data in cookies but we have a token, clear auth
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // If there's an error, clear the invalid tokens
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AdminAuthContext.Provider value={{ isLoading, user, setUser, logout, isAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
