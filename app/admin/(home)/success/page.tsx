'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable from '@/components/tables/success/DataTable';
import { columns } from '@/components/tables/success/column';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosPublic } from '@/services/axiosService';
import { SuccessStory } from '@/types';


export default function SuccessPage() {
    //const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<SuccessStory[]>([]);

    const { data: response, isFetching: isLoading } = useQuery({
      queryKey: ["success"],
      queryFn: async () => {
        try {
          const response = await axiosPublic.get<{ data: SuccessStory[] }>("/success");
          return response.data.data;
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err.response?.data?.message || 'Failed to fetch success stories');
          return [];
        }
      },
      refetchOnWindowFocus: false,
    });

    useEffect(() => {
      if (response && Array.isArray(response)) {
        setPosts(response);
      }
    }, [response]);
    
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Success Stories</h1>
          <p className="text-muted-foreground">Manage success stories</p>
        </div>
        <Link href="/admin/success/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Success Story
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
