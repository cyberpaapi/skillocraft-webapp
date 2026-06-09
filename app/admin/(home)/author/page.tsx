'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Author } from '@/types';
import { useEffect, useState } from 'react';
import DataTable from '@/components/tables/author/DataTable';
import { columns } from '@/components/tables/author/column';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosPublic } from '@/services/axiosService';

export default function AuthorPage() {
    //const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<Author[]>([]);

    const { data: response, isFetching: isLoading } = useQuery({
      queryKey: ["authors"],
      queryFn: async () => {
        try {
          const response = await axiosPublic.get<{ data: Author[] }>("/author");
          return response.data;
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err.response?.data?.message || 'Failed to fetch authors');
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
          <h1 className="text-2xl font-bold">Authors</h1>
          <p className="text-muted-foreground">Manage Authors</p>
        </div>
        <Link href="/admin/author/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Author
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
