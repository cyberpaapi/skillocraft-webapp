'use client';

import { columns } from "@/components/tables/generalFaq/column";
import DataTable from "@/components/tables/generalFaq/DataTable";
import { Button } from "@/components/ui/button";
import { axiosPublic } from "@/services/axiosService";
import { GeneralFaq } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function GeneralFaqPage() {
    //const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<GeneralFaq[]>([]);

    const { data: response, isFetching: isLoading } = useQuery({
      queryKey: ["GeneralFaq"],
      queryFn: async () => {
        try {
          const response = await axiosPublic.get<{ data: GeneralFaq[] }>("/general-faqs");
          return response.data;
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err.response?.data?.message || 'Failed to fetch course faqs');
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
          <h1 className="text-2xl font-bold">General Faqs</h1>
          <p className="text-muted-foreground">Manage General Faqs</p>
        </div>
        <Link href="/admin/generalfaq/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add General FAQ
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
