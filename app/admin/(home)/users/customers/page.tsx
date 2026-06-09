'use client';

import { columns } from '@/components/tables/users/columns';
import DataTable from '@/components/tables/users/DataTable';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosProtected } from '@/services/axiosService';
import { toast } from 'sonner';
import type { User } from '@/types';

type CustomerAPIItem = {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    contact: string;
    role: 'CUSTOMER';
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
  };
  address: unknown[];
  counts: { orders: number; wishlist: number; reviews: number };
};

type CustomersAPIResponse = {
  status: number;
  message: string;
  data: CustomerAPIItem[];
  pagination: { page: number; limit: number; total: number };
};

export default function CustomersPage() {
  const { data, isLoading } = useQuery<CustomersAPIResponse>({
    queryKey: ['admin-customers', { page: 1, limit: 20 }],
    queryFn: async () => {
      try {
        const res = await axiosProtected.get('/adminpanel/customers', {
          params: { page: 1, limit: 20 },
        });
        return res.data as CustomersAPIResponse;
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch customers';
        toast.error(message);
        throw err;
      }
    },
  });

  const customers: User[] = useMemo(() => {
    const items = data?.data || [];
    return items.map((c): User => ({
      id: c.id,
      name: c.name,
      email: c.user.email,
      role: 'customer',
      status: c.status.toLowerCase() === 'active' ? 'active' : 'inactive',
      createdAt: c.createdAt,
    }));
  }, [data]);

  return(
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer accounts</p>
        </div>
        {/* <Button asChild>
          <Link href="/admin/users/customers/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Customer
          </Link>
        </Button> */}
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <DataTable columns={columns} data={customers} />

            )}
        </div>
      </div>
      {/* Your existing table/list of customers */}
    </div>
  )
}
