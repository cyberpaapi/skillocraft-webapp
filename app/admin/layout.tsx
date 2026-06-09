'use client';

import { QueryProvider } from '@/lib/QueryProvider';
import { Toaster } from 'sonner';
import { AdminAuthProvider } from '@/context/AdminAuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-gray-100">
      <QueryProvider>
        <AdminAuthProvider>
          <Toaster richColors position="bottom-right" />
          <div className="min-h-full">
            {children}
          </div>
        </AdminAuthProvider>
      </QueryProvider>
    </div>
  );
}
