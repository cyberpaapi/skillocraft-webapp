"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Banner } from '@/types';
import { toast } from 'sonner';
import { axiosPublic } from '@/services/axiosService';
import Image from 'next/image';

export default function BannerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['banner', id],
    queryFn: async () => {
      try {
        const response = await axiosPublic.get<{
          status: number;
          message: string;
          data: Banner;
        }>(`/banners/${id}`);
        return response.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch banner details');
        throw error;
      }
    },
  });

  const banner = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !banner) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Banner not found</h2>
        <Link href="/admin/banners">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Banners
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banner Details</h1>
        <Link href="/admin/banners">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Banners
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
              <div className="relative h-64 md:h-80 w-full">
                <Image
                  src={banner.imageLink.startsWith('http') ? banner.imageLink : `${process.env.NEXT_PUBLIC_API_URL}${banner.imageLink}`}
                  alt={banner.name}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={process.env.NODE_ENV !== 'production'}
                  onError={(e) => {
                    console.error('Image failed to load:', e.currentTarget.src);
                  }}
                />
                {/* Debug info - remove in production */}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
                  {`${banner.imageLink}`}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{banner.name}</h2>
                <p className="text-muted-foreground">{banner.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    banner.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {banner.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{banner.bannerLocation}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Created At</p>
                <p>{new Date(banner.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="pt-4">
                <Link href={`/admin/banners/${id}/edit`}>
                  <Button>Edit Banner</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}