// components/admin/common/Header.tsx
'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAdminAuth();

  return (
    <header className="flex h-16 w-full items-center bg-white shadow-sm">
      {/* Mobile menu button */}
      <button
        type="button"
        id="mobile-menu-button"
        className="inline-flex h-12 w-12 items-center justify-center border-r border-gray-200 text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>

      <div className="flex flex-1 items-center justify-end px-4">
        {/* Right side - User menu */}
        <div className="flex items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {user?.name || 'Admin'}
            </span>
            <button
              onClick={logout}
              className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}