'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Testimonial } from '@/types';
import { useEffect, useState } from 'react';
import DataTable from '@/components/tables/testimonials/DataTable';
import { columns } from '@/components/tables/testimonials/column';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { axiosHomePublic } from '@/services/axiosHomeService';


export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const { data: response, isFetching: isLoading } = useQuery({
    queryKey: ["Testimonials"],
    queryFn: async () => {
      try {
        const response = await axiosHomePublic.get<{ data: Testimonial[] }>("/testimonials");
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
      setTestimonials(response.data);
    }
  }, [response]);
    
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Manage Testimonials</p>
        </div>
        <Link href="/admin/testimonials/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <DataTable columns={columns} data={testimonials} />
              )}
          </div>
        </div>
    </div>
  );
}
