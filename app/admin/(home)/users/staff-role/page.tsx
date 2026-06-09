'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { StaffRole } from '@/types';
import { useEffect, useState } from 'react';
import DataTable from '@/components/tables/staffRole/DataTable';
import { columns } from '@/components/tables/staffRole/column';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';

export default function StaffRolesPage() {
    //const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<StaffRole[]>([]);

    const { data: response, isFetching: isLoading } = useQuery({
      queryKey: ["staff-role"],
      queryFn: async () => {
        try {
          const response = await axiosProtected.get<{ data: StaffRole[] }>("/staff-roles");
          return response.data;
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err.response?.data?.message || 'Failed to fetch staff role');
          return { data: [] };
        }
      },
      refetchOnWindowFocus: false,
    });

    useEffect(() => {
      if (response?.data && Array.isArray(response.data)) {
        setPosts(response.data);
      }
    }, [response]);
    
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Role</h1>
          <p className="text-muted-foreground">Manage Staff Role</p>
        </div>
        <Link href="/admin/users/staff-role/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Staff role
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
                <DataTable columns={columns} data={posts} />
              )}
          </div>
        </div>
    </div>
  );
}
