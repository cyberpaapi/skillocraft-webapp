'use client';

import { columns } from '@/components/tables/users/columns';
import DataTable from '@/components/tables/users/DataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import { User } from '@/types';

interface AdminsAPIResponse {
  status: number;
  message: string;
  data: Array<{
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
      contact: string;
      role: 'ADMIN';
      status: 'ACTIVE' | 'INACTIVE';
      createdAt: string;
      updatedAt: string;
    };
    address: unknown[];
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function AdminsPage() {
  const { data: adminsData, isLoading } = useQuery<AdminsAPIResponse>({
    queryKey: ['admin-admins', { page: 1, limit: 20 }],
    queryFn: async () => {
      try {
        const res = await axiosProtected.get('/adminpanel/admins', {
          params: { page: 1, limit: 20 },
        });
        return res.data as AdminsAPIResponse;
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch admins';
        toast.error(message);
        throw err;
      }
    },
  });

  // Transform API data to match User interface
  const admins: User[] = useMemo(() => {
    const items = adminsData?.data || [];
    return items.map((admin): User => ({
      id: admin.id,
      name: admin.name,
      email: admin.user.email,
      role: 'admin',
      status: admin.status.toLowerCase() as 'active' | 'inactive' | 'suspended',
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      phone: admin.user.contact,
    }));
  }, [adminsData]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admins</h1>
          <p className="text-muted-foreground">Manage admin users</p>
        </div>
        <Link href="/admin/users/admins/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Admin
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <DataTable columns={columns} data={admins} />
            )}
        </div>
      </div>
    </div>
  );
}
