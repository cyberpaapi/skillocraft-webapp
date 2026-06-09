'use client';

import DataTable from '@/components/tables/users/DataTable';
import { columns } from '@/components/tables/users/columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import { User } from '@/types';

interface StaffAPIResponse {
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
      role: 'STAFF';
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

export default function StaffPage() {
  const { data: staffData, isLoading } = useQuery<StaffAPIResponse>({
    queryKey: ['admin-staff', { page: 1, limit: 20 }],
    queryFn: async () => {
      try {
        const res = await axiosProtected.get('/adminpanel/staff', {
          params: { page: 1, limit: 20 },
        });
        return res.data as StaffAPIResponse;
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch staff';
        toast.error(message);
        throw err;
      }
    },
  });

  // Transform API data to match User interface
  const staff: User[] = useMemo(() => {
    const items = staffData?.data || [];
    return items.map((staffMember): User => ({
      id: staffMember.id,
      name: staffMember.name,
      email: staffMember.user.email,
      role: 'staff',
      status: staffMember.status.toLowerCase() as 'active' | 'inactive' | 'suspended',
      createdAt: staffMember.createdAt,
      updatedAt: staffMember.updatedAt,
      phone: staffMember.user.contact,
    }));
  }, [staffData]);
  return(
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff</h1>
          <p className="text-muted-foreground">Manage staff members</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/staff/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Staff
          </Link>
        </Button>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <DataTable columns={columns} data={staff} />
                  )}
              </div>
            </div>
      {/* Your existing table/list of staff */}
    </div>
    )
}
