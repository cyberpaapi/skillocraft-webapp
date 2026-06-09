'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/admin/common/Sidebar';
import { Header } from '@/components/admin/common/Header';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isCollapsed } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile sidebar when route changes
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  
  useEffect(() => {
    setSidebarOpen(false);
  }, [currentPath]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (sidebarOpen && !target.closest('#mobile-sidebar') && !target.closest('#mobile-menu-button')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-100">
      {/* Mobile sidebar */}
      {/* Mobile sidebar */}
      <div 
        id="mobile-sidebar"
        className={`fixed inset-0 z-40 transform bg-white/80 backdrop-blur-sm transition-all duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div 
          className={`fixed inset-y-0 left-0 flex w-64 transform flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 px-4">
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      </div>

      <div className="relative flex flex-1">
        {/* Desktop sidebar */}
        <div 
          className={cn(
            'fixed inset-y-0 z-10 hidden h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out',
            isCollapsed ? 'w-16' : 'w-64',
            'transform md:block',
            isCollapsed ? 'md:translate-x-0' : 'md:translate-x-0'
          )}
        >
          <Sidebar />
        </div>

        {/* Main content */}
        <div 
          className={cn(
            'flex w-full flex-1 flex-col transition-all duration-300 ease-in-out',
            isCollapsed ? 'md:pl-16' : 'md:pl-64'
          )}
        >
          <div className="sticky top-0 z-10 flex-shrink-0 bg-white">
            <Header onMenuClick={() => setSidebarOpen(true)} />
          </div>
          
          {/* Page content */}
          <main className="flex-1">
            <div className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-6 sm:px-6 md:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}