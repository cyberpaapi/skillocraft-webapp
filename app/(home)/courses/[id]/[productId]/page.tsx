'use client';
//import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';
import { axiosHomePublic, axiosHomeProtected } from '@/services/axiosHomeService';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import VideoPlayer from '@/components/common/VideoPlayer';
import VdoCipherPlayer from '@/components/common/VdoCipherPlayer';
//import { useAuth } from '@/context/AuthContext';

// -----------------------------
// Helper
// -----------------------------
const formatDuration = (duration?: number) => {
  if (!duration) return '0:00';
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  if (hours > 0)
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function ProductPage() {
  const router = useRouter();
  const { id, productId } = useParams<{ id: string; productId: string }>();
  //const { isLoggedIn } = useAuth();
  const [videoError, setVideoError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [captionUrl, setCaptionUrl] = useState<string | null>(null);
  const [vdoOtp, setVdoOtp] = useState<{ otp: string; playbackInfo: string } | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const watchTimeRef = useRef<number>(0);

  // -----------------------------
  // Fetch product details
  // -----------------------------
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await axiosHomePublic.get(`/course/product/${productId}`);
      return response.data?.product || response.data?.data?.product;
    },
  });

  // -----------------------------
  // Get stream URL
  // -----------------------------
  const resolveVideoUrl = (link: string): string => {
    if (!link) return '';
    if (link.startsWith('http://') || link.startsWith('https://')) return link;
    // Relative /uploads/... path — prefix with backend API URL
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return `${api}${link.startsWith('/') ? '' : '/'}${link}`;
  };

  const getStreamUrl = async () => {
    if (!product?.videoLink) return;

    setIsVideoLoading(true);
    setVideoError(null);
    setVdoOtp(null);
    setCaptionUrl(null);

    const resolved = resolveVideoUrl(product.videoLink);

    // Local /uploads/ path — serve directly
    const isLocal = product.videoLink.startsWith('/uploads/') || product.videoLink.startsWith('/');
    if (isLocal) {
      setStreamUrl(resolved);
      setIsVideoLoading(false);
      return;
    }

    try {
      const baseUrl = (process.env.NEXT_PUBLIC_DO_BUCKET_URL || '').replace(/\/$/, '') + '/';
      const videoKey = product.videoLink.startsWith(baseUrl)
        ? product.videoLink.replace(baseUrl, '')
        : product.videoLink;

      const { data } = await axiosHomeProtected.get(`/stream/${encodeURIComponent(videoKey)}`);

      // VdoCipher → OTP-based playback
      if (data?.provider === 'vdocipher' && data?.otp) {
        setVdoOtp({ otp: data.otp, playbackInfo: data.playbackInfo });
      } else {
        const url = data?.url || data;
        if (url && typeof url === 'string') setStreamUrl(url);
        else throw new Error('No URL returned');
        // Same relative form as the video URL, so it resolves the same way
        if (typeof data?.captionUrl === 'string') setCaptionUrl(data.captionUrl);
      }
    } catch {
      setStreamUrl(resolved);
    } finally {
      setIsVideoLoading(false);
    }
  };

  // -----------------------------
  // Get stream URL when product is loaded
  // -----------------------------
  useEffect(() => {
    if (product?.videoLink) {
      getStreamUrl();
    }
  }, [product]);

  // -----------------------------
  // Analytics Sender
  // -----------------------------
  const sendAnalytics = async () => {
    if (!product) return;
    const watchDuration = Math.floor(watchTimeRef.current);
    if (watchDuration <= 0) return;
    try {
      await axiosHomeProtected.post('/analytics', {
        productId,
        courseId: product.course?.id,
        watchDuration,
        totalTime: watchDuration,
      });
    } catch {
      // analytics failure is non-critical
    }
  };

  // -----------------------------
  // Loading states
  // -----------------------------
  if (isLoading || !product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  if (error || !productId)
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading course</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );

  return (
    <div className="overflow-x-hidden bg-[url(/bg/common.jpg)] bg-cover bg-top">
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ---------------- VIDEO SECTION ---------------- */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative">
              {videoError ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-red-400 p-4 text-center">
                  <AlertCircle className="h-10 w-10" />
                  <p className="text-sm">{videoError}</p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-gray-400 break-all max-w-sm">Key: {product.videoLink}</p>
                  )}
                  <Button variant="outline" size="sm" onClick={getStreamUrl} className="mt-2">Retry</Button>
                </div>
              ) : vdoOtp ? (
                /* VdoCipher DRM player */
                <VdoCipherPlayer
                  otp={vdoOtp.otp}
                  playbackInfo={vdoOtp.playbackInfo}
                  className="w-full h-full"
                  onEnded={sendAnalytics}
                />
              ) : streamUrl ? (
                /* HLS / direct video fallback */
                <VideoPlayer
                  src={streamUrl}
                  captionSrc={captionUrl || undefined}
                  className="w-full h-full"
                  onTimeUpdate={(t) => { watchTimeRef.current = t; }}
                  onPause={sendAnalytics}
                  onEnded={sendAnalytics}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {product.name}
            </h2>

            {((product.formattedDuration && product.formattedDuration !== '00:00:00') || (product.duration && product.duration > 0)) && (
              <div className="mt-3 text-sm text-gray-500">
                ⏱ {product.formattedDuration !== '00:00:00' ? product.formattedDuration : formatDuration(product.duration)}
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">About Chapter</h3>
              <p className="text-sm text-gray-700">
                {product.description}
              </p>
            </div>
          </div>

          {/* ---------------- SIDEBAR ---------------- */}
          <div className="space-y-6">
            <section className="bg-gray-100 rounded-2xl shadow-lg p-4">
              {product.course?.product?.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`p-3 rounded-lg ${
                    lesson.id === productId
                      ? 'bg-blue-100'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>
                      {index + 1}. {lesson.name}
                    </span>
                    {lesson.id !== productId && (
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(`/courses/${id}/${lesson.id}`)
                        }
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}