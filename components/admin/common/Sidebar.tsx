'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/context/SidebarContext';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { axiosProtected } from '@/services/axiosService';
import { useAdminAuth } from '@/context/AdminAuthContext';

type NavItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
  subItems?: Array<{ name: string; href: string; icon?: React.ReactNode }>;
};

const staticNavItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: (
      <svg
        className="h-5 w-5 ml-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    subItems: [
      {
        name: 'Staff Roles',
        href: '/admin/users/staff-role',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        name: 'Admins',
        href: '/admin/users/admins',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
      {
        name: 'Staff',
        href: '/admin/users/staff',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        name: 'Customers',
        href: '/admin/users/customers',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    name: 'User Portal Management',
    href: '#',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    subItems: [
      {
        name: 'Banners',
        href: '/admin/banners',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        name: 'Testimonials',
        href: '/admin/testimonials',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        ),
      },
      {
        name: 'General FAQ',
        href: '/admin/generalfaq',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-.554 1.396-.918 2.347-.918 1.12 0 2.1.61 2.628 1.518.529-.908 1.508-1.518 2.627-1.518 1.12 0 2.1.61 2.628 1.518.529-.908 1.508-1.518 2.627-1.518.95 0 1.798.364 2.347.918M3 12h.01M7 12h.01m-4.01 0H3m18 0h-.01M7 15h10m4 0h.01M3 15h.01m-2.99 0H3m18 0h.01M7 18h10m4 0h.01M3 18h.01m-2.99 0H3m18-9a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        name: 'Success Story',
        href: '/admin/success',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        name: 'Awards Logo',
        href: '/admin/featured-brands',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        name: 'Awards Gallery',
        href: '/admin/featured-gallery',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    name: 'Course Management',
    href: '#',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
        />
      </svg>
    ),
    subItems: [
      {
        name: 'Categories',
        href: '/admin/categories',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      },
      {
        name: 'Creators',
        href: '/admin/creator',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        ),
      },
      {
        name: 'Courses',
        href: '/admin/course',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        ),
      },
      {
        name: 'Courses FAQ',
        href: '/admin/coursefaq',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
      },
    ],
  },
  {
    name: 'Blog Management',
    href: '#',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
    subItems: [
      {
        name: 'Authors',
        href: '/admin/author',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
      {
        name: 'Blog Posts',
        href: '/admin/blogs',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
      },
    ],
  },
  {
    name: 'Sales Management',
    href: '#',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    subItems: [
      {
        name: 'Orders',
        href: '/admin/orders',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
      },
      {
        name: 'Revenue',
        href: '/admin/revenue',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    name: 'Marketplace Management',
    href: '#',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    subItems: [
      {
        name: 'Products',
        href: '/admin/marketplace',
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      },
    ],
  },
  // {
  //   name: 'Settings',
  //   href: '/admin/settings',
  //   icon: (
  //     <svg
  //       className="h-5 w-5 ml-1"
  //       fill="none"
  //       stroke="currentColor"
  //       viewBox="0 0 24 24"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={2}
  //         d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  //       />
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={2}
  //         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  //       />
  //     </svg>
  //   ),
  // },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const { user } = useAdminAuth();
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const checkAndUpdateStaffAccess = async () => {
    try {
      // Get user data from cookie
      const userRole = user?.role;
      if (userRole === 'ADMIN') {
        // For admin: Get all valid submenu items and post them
        const allSubItems = staticNavItems
          .filter(item => item.subItems && item.subItems.length > 0)
          .flatMap(item => 
            item.subItems
              ?.filter(subItem => subItem.name && subItem.href && subItem.href !== '#')
              .map(subItem => ({
                routeName: subItem.name,
                routeUrl: subItem.href
              })) || []
          );
        if (allSubItems.length > 0) {
          await axiosProtected.post('/staff-access', allSubItems);
        }
        setFilteredNavItems(staticNavItems);
      } 
      else if (userRole === 'STAFF') {
        // For staff: Get allowed routes and filter the sidebar
        const { data } = await axiosProtected.get('/staff-access');
        const allowedRoutes = data.data || [];
        
        const filteredItems = staticNavItems.map(item => {
          // Keep items with no subItems (like Dashboard)
          if (!item.subItems) return item;
          
          // Filter subItems based on allowed routes
          const filteredSubItems = item.subItems.filter(subItem => 
            // Keep items with empty href or items present in allowedRoutes
            !subItem.href || 
            subItem.href === '#' || 
            allowedRoutes.some((route: { routeUrl: string }) => 
              route.routeUrl === subItem.href
            )
          );
          // Only include the item if it has subItems or is a main item
          return filteredSubItems.length > 0 
            ? { ...item, subItems: filteredSubItems } 
            : null;
        }).filter(Boolean) as NavItem[];
        setFilteredNavItems(filteredItems);
      } 
      else {
        // For other roles, show no items
        setFilteredNavItems([]);
      }
    } catch (error) {
      console.error('Error managing staff access:', error);
      // Fallback to showing all items if there's an error
      setFilteredNavItems(staticNavItems);
    }
  };

  useEffect(() => {
    // const checkAndUpdateStaffAccess = async () => {
    //   try {
    //     // First, get the current staff access list
    //     const { data } = await axiosProtected.get('/adminpanel/staff-access');
    //     // If data array is empty, we need to update it
    //     if (data.status === 1 && Array.isArray(data.data) && data.data.length === 0) {
    //       // Extract all submenu items from staticNavItems
    //       const allSubItems = staticNavItems
    //         .filter(item => item.subItems && item.subItems.length > 0)
    //         .flatMap(item => 
    //           item.subItems?.map(subItem => ({
    //             routeName: subItem.name,
    //             routeUrl: subItem.href
    //           })) || []
    //         );
    //       // Filter out any items with empty names or URLs
    //       const validSubItems = allSubItems.filter(
    //         item => item.routeName && item.routeUrl && item.routeUrl !== '#'
    //       );
    //       // Make the POST request to update staff access
    //       await axiosProtected.post(
    //         '/adminpanel/staff-access',
    //         validSubItems
    //       );
    //     }
    //   } catch (error) {
    //     console.error('Error managing staff access:', error);
    //     // Optionally show an error toast/message
    //   } 
    // };
    checkAndUpdateStaffAccess();
  }, []);

  // Auto-expand submenu if current path matches any subitem
  useEffect(() => {
    // const currentItem = staticNavItems.find(item => 
    const currentItem = filteredNavItems.find(item => 
      item.subItems?.some(subItem => pathname === subItem.href)
    );
    if (currentItem) {
      setOpenSubmenu(currentItem.name);
    }
  }, [pathname,filteredNavItems]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {/* {staticNavItems.map((item) => { */}
          {filteredNavItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isActive = pathname === item.href || 
              (hasSubItems && item.subItems?.some(subItem => pathname === subItem.href));
            const isExpanded = openSubmenu === item.name;

            return (
              <div key={item.name}>
                <div
                  className={cn(
                    'flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md',
                    isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    isCollapsed ? 'justify-center px-2' : ''
                  )}
                  onClick={() => hasSubItems && toggleSubmenu(item.name)}
                >
                  <Link 
                    href={hasSubItems ? '#' : item.href}
                    className={cn('flex items-center w-full', hasSubItems ? 'cursor-default' : '')}
                    onClick={(e) => hasSubItems && e.preventDefault()}
                  >
                    <span className={cn('flex-shrink-0', isCollapsed ? 'mx-auto' : 'ml-1 mr-3')}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="flex-1">{item.name}</span>
                    )}
                  </Link>
                  
                  {!isCollapsed && hasSubItems && (
                    <ChevronDown 
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        isExpanded ? 'transform rotate-180' : ''
                      )} 
                    />
                  )}
                </div>

                {!isCollapsed && item.subItems && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1 pl-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm rounded-md',
                          pathname === subItem.href
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        )}
                      >
                        {subItem.icon && (
                          <span className="mr-3 flex-shrink-0">
                            {subItem.icon}
                          </span>
                        )}
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
