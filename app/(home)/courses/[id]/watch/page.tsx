'use client';

import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { CourseDetails, Product } from '@/types';
import { axiosHomePublic, axiosHomeProtected } from '@/services/axiosHomeService';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Lock, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import VideoPlayer from '@/components/common/VideoPlayer';
import VdoCipherPlayer from '@/components/common/VdoCipherPlayer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { FaWhatsapp } from 'react-icons/fa';
import { imgSrc } from '@/lib/imgSrc';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface CourseDownloadItem { id: string; fileName: string; fileUrl: string; fileSize?: string; }

const formatDuration = (duration?: number) => {
  if (!duration) return '';
  const h = Math.floor(duration / 3600);
  const m = Math.floor((duration % 3600) / 60);
  const s = duration % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function CourseWatchPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [captionUrl, setCaptionUrl] = useState<string | null>(null);
  const [vdoOtp, setVdoOtp] = useState<{ otp: string; playbackInfo: string } | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [ordered, setOrdered] = useState(false);
  const [waLink, setWaLink] = useState('');
  const [waImage, setWaImage] = useState('');
  const watchTimeRef = useRef<number>(0);

  // Doubt clearing + certificate request
  const [doubtOpen, setDoubtOpen] = useState(false);
  const [doubtMessage, setDoubtMessage] = useState('');
  const [submittingDoubt, setSubmittingDoubt] = useState(false);
  const [requestingCert, setRequestingCert] = useState(false);
  const [certRequested, setCertRequested] = useState(false);

  const submitDoubt = async () => {
    setSubmittingDoubt(true);
    try {
      await axiosHomeProtected.post('/doubt-requests', { courseId: id, message: doubtMessage.trim() || undefined });
      toast.success('Your doubt clearing request has been submitted!');
      setDoubtOpen(false);
      setDoubtMessage('');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit request.';
      toast.error(msg);
    } finally {
      setSubmittingDoubt(false);
    }
  };

  const requestCertificate = async () => {
    setRequestingCert(true);
    try {
      await axiosHomeProtected.post('/certificate-requests', { courseId: id });
      toast.success('Certificate request submitted! We will email it to you.');
      setCertRequested(true);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to request certificate.';
      toast.error(msg);
    } finally {
      setRequestingCert(false);
    }
  };

  // Fetch course (with chapters)
  const { data: course, isLoading, error } = useQuery<CourseDetails>({
    queryKey: ['course-watch', id],
    queryFn: async () => {
      const response = await axiosHomePublic.get(`/courses/${id}`);
      return response.data.data;
    },
  });

  // Downloads
  const { data: downloads } = useQuery<CourseDownloadItem[]>({
    queryKey: ['course-downloads-watch', id],
    queryFn: async () => {
      const res = await axiosHomePublic.get(`/courses/${id}/downloads`);
      return res.data?.data || [];
    },
    enabled: !!id,
  });

  // Verify the course is purchased
  useEffect(() => {
    const check = async () => {
      if (authLoading || !isLoggedIn || !id) return;
      try {
        const res = await axiosHomeProtected.get(`/orders/check/${id}`);
        if (res.data && typeof res.data.ordered === 'boolean') setOrdered(res.data.ordered);
      } catch {
        // ignore
      }
    };
    check();
  }, [authLoading, isLoggedIn, id]);

  // WhatsApp group join block (admin-configured via site settings)
  useEffect(() => {
    axiosHomePublic
      .get('/site-settings?keys=course_whatsapp_link,course_whatsapp_image')
      .then(({ data }) => {
        const d = data?.data || {};
        if (d.course_whatsapp_link) setWaLink(d.course_whatsapp_link);
        if (d.course_whatsapp_image) setWaImage(d.course_whatsapp_image);
      })
      .catch(() => {});
  }, []);

  const products: Product[] = course?.products || [];
  const activeProduct = products.find((p) => p.id === activeId) || products[0] || null;

  // Default to first chapter once loaded
  useEffect(() => {
    if (!activeId && products.length > 0) setActiveId(products[0].id);
  }, [products, activeId]);

  // Resolve a stream URL for the active chapter
  useEffect(() => {
    const resolveVideoUrl = (link: string): string => {
      if (!link) return '';
      if (link.startsWith('http://') || link.startsWith('https://')) return link;
      return `${API_BASE}${link.startsWith('/') ? '' : '/'}${link}`;
    };

    const load = async () => {
      setStreamUrl(null);
      setVdoOtp(null);
      setCaptionUrl(null);
      setVideoError(null);
      const link = activeProduct?.videoLink;
      if (!link) return;

      const resolved = resolveVideoUrl(link);
      const isLocal = link.startsWith('/uploads/') || link.startsWith('/');
      if (isLocal) { setStreamUrl(resolved); return; }

      try {
        const baseUrl = (process.env.NEXT_PUBLIC_DO_BUCKET_URL || '').replace(/\/$/, '') + '/';
        const videoKey = link.startsWith(baseUrl) ? link.replace(baseUrl, '') : link;
        const { data } = await axiosHomeProtected.get(`/stream/${encodeURIComponent(videoKey)}`);
        if (data?.provider === 'vdocipher' && data?.otp) {
          setVdoOtp({ otp: data.otp, playbackInfo: data.playbackInfo });
        } else {
          const url = data?.url || data;
          if (url && typeof url === 'string') setStreamUrl(url);
          else throw new Error('No URL');
          // Same relative form as the video URL, so it resolves the same way
          if (typeof data?.captionUrl === 'string') setCaptionUrl(data.captionUrl);
        }
      } catch {
        setStreamUrl(resolved);
      }
    };
    load();
  }, [activeProduct?.id]);

  const sendAnalytics = async () => {
    if (!activeProduct) return;
    const watchDuration = Math.floor(watchTimeRef.current);
    if (watchDuration <= 0) return;
    try {
      await axiosHomeProtected.post('/analytics', {
        productId: activeProduct.id,
        courseId: id,
        watchDuration,
        totalTime: watchDuration,
      });
    } catch {
      // non-critical
    }
  };

  if (isLoading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading course</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  // Gate: must be logged in & have purchased
  if (!authLoading && (!isLoggedIn || !ordered)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <Lock className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">This course is locked</h2>
        <p className="text-gray-500 mb-4">Purchase this course to start watching.</p>
        <Button onClick={() => router.push(`/courses/${id}`)}>Go to course page</Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-[url(/bg/common.jpg)] bg-cover bg-top">
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-4">
          <button
            onClick={() => router.push(`/courses/${id}`)}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to course
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Player */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden relative">
                {videoError ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2 text-red-400 p-4 text-center">
                    <AlertCircle className="h-10 w-10" />
                    <p className="text-sm">{videoError}</p>
                  </div>
                ) : vdoOtp ? (
                  <VdoCipherPlayer otp={vdoOtp.otp} playbackInfo={vdoOtp.playbackInfo} className="w-full h-full" onEnded={sendAnalytics} />
                ) : streamUrl ? (
                  <VideoPlayer
                    src={streamUrl}
                    captionSrc={captionUrl || undefined}
                    className="w-full h-full"
                    onTimeUpdate={(t) => { watchTimeRef.current = t; }}
                    onPause={sendAnalytics}
                    onEnded={sendAnalytics}
                  />
                ) : activeProduct ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No lessons available yet
                  </div>
                )}
              </div>

              <h1 className="mt-4 text-2xl font-bold text-gray-800">{course.name}</h1>
              {activeProduct && (
                <h2 className="mt-1 text-lg font-medium text-primary">{activeProduct.name}</h2>
              )}
              {/* About Course */}
              {course.longDescription && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">About Course</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{course.longDescription}</p>
                </div>
              )}

              {activeProduct?.description && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">About this lesson</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{activeProduct.description}</p>
                </div>
              )}

              {/* Download Content */}
              {downloads && downloads.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Download Content</h3>
                  <p className="text-xs text-gray-500 mb-2">Select and download the materials you need.</p>
                  <div className="space-y-2">
                    {downloads.map((dl) => {
                      const href = dl.fileUrl.startsWith('http') ? dl.fileUrl : `${API_BASE}${dl.fileUrl}`;
                      return (
                        <a key={dl.id} href={href} download target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 border border-orange-500 text-orange-500 hover:bg-orange-50 font-medium py-2 px-3 rounded-lg text-sm transition-colors">
                          <span className="flex items-center gap-2 min-w-0"><span>📄</span><span className="truncate">{dl.fileName}</span></span>
                          <span className="shrink-0 text-xs font-semibold">Download</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Request Certificate */}
              <div className="mt-6 bg-white rounded-2xl shadow p-4">
                <h3 className="text-base font-semibold text-gray-800">Course Certificate</h3>
                <p className="text-sm text-gray-500 mt-0.5">Finished the course? Request your certificate and our team will email it to you.</p>
                <button
                  onClick={requestCertificate}
                  disabled={requestingCert || certRequested}
                  className="mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-60"
                >
                  {certRequested ? '✓ Certificate Requested' : requestingCert ? 'Requesting…' : '🎓 Request Certificate'}
                </button>
              </div>

              {/* WhatsApp group join block — shown on every course watch page, below the certificate */}
              <div className="mt-6 bg-white rounded-2xl shadow border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <FaWhatsapp className="text-green-500" /> WhatsApp
                  </h3>
                  <p className="mt-1 text-lg text-gray-600">Join Skillocraft Group</p>
                  <a
                    href={waLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 self-start inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
                  >
                    <FaWhatsapp /> Join Now
                  </a>
                </div>
                {waImage ? (
                  <div className="relative min-h-[180px] bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc(waImage)}
                      alt="Join Skillocraft WhatsApp group"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative min-h-[180px] flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
                    <FaWhatsapp className="text-white/90 text-7xl" />
                  </div>
                )}
              </div>
            </div>

            {/* Chapter list */}
            <div className="space-y-3">
              <div className="bg-white rounded-2xl shadow p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Course content
                  <span className="ml-2 text-sm font-normal text-gray-500">{products.length} chapters</span>
                </h3>
                <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                  {products.map((lesson, index) => {
                    const isActive = lesson.id === activeProduct?.id;
                    const dur = (lesson.formattedDuration && lesson.formattedDuration !== '00:00:00')
                      ? lesson.formattedDuration
                      : formatDuration(lesson.duration);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveId(lesson.id)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors ${
                          isActive ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <span className={`shrink-0 mt-0.5 ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
                          {isActive ? <Play className="h-4 w-4 fill-orange-500" /> : <CheckCircle2 className="h-4 w-4" />}
                        </span>
                        <span className="flex-1">
                          <span className={`block text-sm ${isActive ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {index + 1}. {lesson.name}
                          </span>
                          <span className="flex items-center gap-2 mt-0.5">
                            {isActive && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                                Watching
                              </span>
                            )}
                            {dur && <span className="text-xs text-gray-400">⏱ {dur}</span>}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                  {products.length === 0 && (
                    <p className="text-sm text-gray-500 py-4 text-center">No chapters available yet.</p>
                  )}
                </div>
              </div>

              {/* Doubt Clearing Session */}
              <div className="bg-white rounded-2xl shadow p-5 text-center">
                <h3 className="text-lg font-bold text-secondary">Doubt Clearing Session</h3>
                <p className="text-sm text-gray-500 mt-1">Stuck somewhere? Request a callback and our team will help you.</p>
                <button
                  onClick={() => setDoubtOpen(true)}
                  className="mt-3 w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  💬 Join Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doubt Clearing Modal */}
      {doubtOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDoubtOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-gray-800">Request for Doubt Clearing</h3>
              <button onClick={() => setDoubtOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Our team will reach out to help you with <span className="font-medium">{course.name}</span>. Add a note about what you&apos;re stuck on (optional).</p>
            <textarea
              placeholder="Describe your doubt (optional)"
              value={doubtMessage}
              onChange={(e) => setDoubtMessage(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none mb-3"
            />
            <button
              onClick={submitDoubt}
              disabled={submittingDoubt}
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-2 rounded-lg disabled:opacity-60"
            >
              {submittingDoubt ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
