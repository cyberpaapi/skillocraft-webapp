'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Category } from '@/types';
import { useEffect, useState } from 'react';
import DataTable from '@/components/tables/categories/DataTable';
import { columns } from '@/components/tables/categories/columns';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const { data: response, isFetching: isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await axiosProtected.get<{ 
          status: number;
          message: string;
          data: Category[];
        }>('/categories');
        return response.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch categories');
        return { data: [] };
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (response?.data) {
      setCategories(response.data);
    }
  }, [response]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage Categories</p>
        </div>
        <Link href="/admin/categories/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Category
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
            <DataTable columns={columns} data={categories} />
          )}
        </div>
      </div>
    </div>
  );
}