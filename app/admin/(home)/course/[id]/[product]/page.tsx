'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, PlayCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import { AlertModal } from '@/components/ui/alert-modal';
import { cn } from '@/lib/utils';

type Product = {
  id: string;
  name: string;
  description: string;
  videoLink: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  course: {
    id: string;
    name: string;
    shortDescription: string;
    price: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const productId = params.product as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ---------------- VIDEO STREAMING SETUP ---------------- */
const getStreamUrl = useCallback(async () => {
  if (!product?.videoLink) return;

  try {
    setIsVideoLoading(true);
    setVideoError(null);
    // Extract the key from the video link
    const baseUrl = `${process.env.NEXT_PUBLIC_DO_BUCKET_URL}/`;
    const videoKey = product.videoLink.replace(baseUrl, '');
    // Get signed URL from your backend
    const response = await axiosProtected.get(`/stream/${encodeURIComponent(videoKey)}`);
    setStreamUrl(response.data.url);
  } catch (err) {
    console.error('Failed to get stream URL:', err);
    setVideoError('Failed to load video stream');
    setIsVideoLoading(false);
  }
}, [product]);

  /* Get stream URL when product is loaded */
  useEffect(() => {
    if (product?.videoLink) {
      getStreamUrl();
    }
  }, [product, getStreamUrl]);

  /* ---------------- FETCH PRODUCT ---------------- */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosProtected.get(`/course/product/${productId}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  /* ---------------- DELETE ---------------- */

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await axiosProtected.delete(`/products/${productId}`);
      toast.success('Product deleted successfully');
      router.push(`/admin/course/${courseId}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  /* ---------------- UI STATES ---------------- */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  /* ---------------- MAIN RENDER ---------------- */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
          <h1 className="mt-2 text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Product details and information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/course/${courseId}/${productId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* VIDEO SECTION */}
      {product.videoLink && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Video Content</h2>

          <div className="relative aspect-video rounded-md overflow-hidden bg-black">
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}

            {videoError ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-4">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <p className="text-red-500">{videoError}</p>
                <Button variant="outline" size="sm" onClick={getStreamUrl}>
                  Retry
                </Button>
              </div>
            ) : streamUrl ? (
              <video
                ref={videoRef}
                className={cn(
                  'w-full h-full object-contain',
                  isVideoLoading && 'invisible'
                )}
                src={streamUrl}
                controls
                playsInline
                preload="metadata"
                onCanPlay={() => setIsVideoLoading(false)}
                onWaiting={() => setIsVideoLoading(true)}
                onPlaying={() => setIsVideoLoading(false)}
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  console.error('Video error:', target.error);
                  setVideoError('Error playing video');
                  setIsVideoLoading(false);
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>

          <div className="mt-3 flex justify-between text-sm text-muted-foreground">
            <p>HLS video streaming with secure access</p>
            <div className="space-x-2">
              <Button variant="ghost" size="sm" onClick={getStreamUrl}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Refresh Stream
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.open(product.videoLink, '_blank')}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Open Original Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <p className="mt-1">{product.status}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Course</h3>
            <p className="mt-1">{product.course?.name}</p>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="mt-1">{product.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Video Link</h3>
            <p className="mt-1 text-xs break-all">{product.videoLink}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
            <p className="mt-1">
              {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isDeleting}
        title="Are you sure you want to delete this product?"
        description="This action cannot be undone. This will permanently delete the product and all its associated data."
      />
    </div>
  );
}