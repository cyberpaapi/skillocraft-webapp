'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Banner } from '@/types';
import { useEffect, useState } from 'react';
import DataTable from '@/components/tables/banners/DataTable';
import { columns } from '@/components/tables/banners/column';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosPublic } from '@/services/axiosService';

// const posts:Banner[]=[
//     {
//         id:"1",
//         name:"Post 1",
//         description:"Description 1",
//         bannerLocation:"Category 1",
//         status:"published"
//     },{
//         id:"2",
//         name:"Post 2",
//         description:"Description 2",
//         bannerLocation:"Category 2",
//         status:"draft"
//     },{
//         id:"3",
//         name:"Post 3",
//         description:"Description 3",
//         location:"Category 3",
//         status:"published"
//     }
// ]

export default function BannersPage() {
    //const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<Banner[]>([]);

    const { data: response, isFetching: isLoading } = useQuery({
      queryKey: ["banners"],
      queryFn: async () => {
        try {
          const response = await axiosPublic.get<{ data: Banner[] }>("/banners");
          return response.data;
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err.response?.data?.message || 'Failed to fetch banners');
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
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-muted-foreground">Manage Banners</p>
        </div>
        <Link href="/admin/banners/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Banner
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
