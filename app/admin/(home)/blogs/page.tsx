'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import DataTable from '@/components/tables/blog/DataTable';
import { columns } from '@/components/tables/blog/column';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosProtected } from '@/services/axiosService';
import { toast } from 'sonner';
import { BlogListResponseData } from '@/types';

interface BlogListResponse {
  status: number;
  data: BlogListResponseData[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery<BlogListResponse>({
    queryKey: ['blogs', page],
    queryFn: async () => {
      const response = await axiosProtected.get(`/blogs?page=${page}&limit=${limit}`);
      return response.data;
    },
  });

  useEffect(() => {
  if (isError) {
    toast.error('Failed to load blogs');
  }
  }, [isError]);

  // Map the API response to match the BlogListResponseData type
  const tableData: BlogListResponseData[] = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blogs</h1>
          <p className="text-muted-foreground">Manage Posts</p>
        </div>
        <Link href="/admin/blogs/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Post
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
          <DataTable 
            columns={columns} 
              data={tableData} 
            pageCount={data?.pagination?.pages || 1}
            pageIndex={page - 1}
            onPageChange={(newPage) => setPage(newPage + 1)}
            isLoading={isLoading}
          />
          )}
        </div>
      </div>
    </div>
  );
}
