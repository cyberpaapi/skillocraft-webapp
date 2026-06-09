'use client';

import { columns } from "@/components/tables/featureGallery/column";
import DataTable from "@/components/tables/featureGallery/DataTable";
import { Button } from "@/components/ui/button";
import { axiosPublic } from "@/services/axiosService";
import { FeatureGallery } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FeaturedBrandsPage() {
    //const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<FeatureGallery[]>([]);

    const { data: response, isFetching: isLoading } = useQuery({
      queryKey: ["featured-gallery"],
      queryFn: async () => {
        try {
          const response = await axiosPublic.get<{ data: FeatureGallery[] }>("/feature-gallery");
          return response.data;
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err.response?.data?.message || 'Failed to fetch featured gallery');
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
          <h1 className="text-2xl font-bold">Awards gallery</h1>
          <p className="text-muted-foreground">Manage Awards gallery</p>
        </div>
        <Link href="/admin/featured-gallery/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Awards gallery
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
