'use client';

import { columns } from "@/components/tables/featureBrands/column";
import DataTable from "@/components/tables/featureBrands/DataTable";
import { Button } from "@/components/ui/button";
import { axiosPublic } from "@/services/axiosService";
import { FeaturedBand } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FeaturedBrandsPage() {
    //const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<FeaturedBand[]>([]);

    const { data: response, isFetching: isLoading } = useQuery({
      queryKey: ["featured-brands"],
      queryFn: async () => {
        try {
          const response = await axiosPublic.get<{ data: FeaturedBand[] }>("/feature-brands");
          return response.data;
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err.response?.data?.message || 'Failed to fetch featured brands');
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
          <h1 className="text-2xl font-bold">Awards logo</h1>
          <p className="text-muted-foreground">Manage Awards logo</p>
        </div>
        <Link href="/admin/featured-brands/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Awards logo
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
