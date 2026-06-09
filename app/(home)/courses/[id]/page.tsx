'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { CourseDetails, CourseAnalytics, Product } from '@/types';
import { axiosHomePublic, axiosHomeProtected } from '@/services/axiosHomeService';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { useInvalidateNavbarData } from '@/hooks/useInvalidateNavbarData';

// Define FAQ type
interface FAQ {
  id: string;
  question: string;
  answer: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

interface FAQResponse {
  status: number;
  message: string;
  data: FAQ[];
}

const formatDuration = (duration?: number) => {
  if (!duration || duration <= 0) return null;
  const h = Math.floor(duration / 3600);
  const m = Math.floor((duration % 3600) / 60);
  const s = Math.floor(duration % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
};

const calculateTotalDuration = (products?: Array<Product>) => {
  if (!products || products.length === 0) return null;
  const totalSeconds = products.reduce((sum, p) => sum + (p.duration || 0), 0);
  if (totalSeconds === 0) return null;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h}h ${m}m`;
};

export default function CoursePage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [inCart, setInCart] = useState<boolean>(false);
  const [ordered, setOrdered] = useState<boolean>(false);
  const { openModal } = useModal();
  const { invalidateNavbarData } = useInvalidateNavbarData();
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading, error } = useQuery<CourseDetails>({
    queryKey: ['course', id],
    queryFn: async () => {
      try {
        const response = await axiosHomePublic.get(`/courses/${id}`);
        return response.data.data;
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        throw new Error(error.response?.data?.message || 'Failed to fetch course details');
      }
    },
  });

  // Fetch FAQs for the course
  const { data: faqsData, isLoading: isLoadingFaqs } = useQuery<FAQResponse>({
    queryKey: ['course-all-faqs', id],
    queryFn: async () => {
      try {
        const response = await axiosHomePublic.get(`/course-all-faqs/${id}`);
        return response.data;
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
        return { status: 0, message: 'Failed to fetch FAQs', data: [] };
      }
    },
    enabled: !!id, // Only fetch if we have a course ID
  });

  // Use API data if available, otherwise fall back to default FAQs
  const faqs = faqsData?.data?.length ? faqsData.data : [];

  // Check if course is already in cart for logged-in users
  useEffect(() => {
    const checkInCart = async () => {
      if (authLoading || !isLoggedIn || !id) return;
      try {
        const res = await axiosHomeProtected.get(`/cart/check/${id}`);
        if (res.data && typeof res.data.inCart === 'boolean') {
          setInCart(res.data.inCart);
        }
      } catch (err) {
        // Silently ignore cart check errors
        console.warn('Cart check failed', err);
      }
    };
    checkInCart();
  }, [authLoading, isLoggedIn, id]);

  // Check if course is already purchased for logged-in users
  useEffect(() => {
    const checkOrdered = async () => {
      if (authLoading || !isLoggedIn || !id) return;
      try {
        const res = await axiosHomeProtected.get(`/orders/check/${id}`);
        if (res.data && typeof res.data.ordered === 'boolean') {
          setOrdered(res.data.ordered);
        }
      } catch (err) {
        console.warn('Order check failed', err);
      }
    };
    checkOrdered();
  }, [authLoading, isLoggedIn, id]);

  // Fetch course analytics for logged-in users who have purchased the course
  const { data: courseAnalytics } = useQuery<CourseAnalytics>({
    queryKey: ['course-analytics', id],
    queryFn: async () => {
      console.log('🔍 Calling analytics API for course:', id);
      try {
        const response = await axiosHomeProtected.get(`/customer/video-analytics/course/${id}`);
        console.log('✅ Analytics API response:', response.data);
        console.log('📋 Full response structure:', {
          status: response.data?.status,
          message: response.data?.message,
          data: response.data?.data,
          hasDataProperty: !!response.data?.data,
          hasDirectProperties: !!response.data?.courseSummary
        });
        
        // Check if data is nested under .data or direct
        const analyticsData = response.data?.data || response.data;
        console.log('🎯 Final analytics data to return:', analyticsData);
        return analyticsData;
      } catch (err) {
        console.error('❌ Analytics API error:', err);
        const error = err as { response?: { data?: { message?: string } } };
        throw new Error(error.response?.data?.message || 'Failed to fetch course analytics');
      }
    },
    enabled: isLoggedIn && ordered && !!id, // Only fetch when user is logged in and has purchased the course
  });

  // Debug: Log the conditions for API call
  console.log('📊 Analytics API Conditions:', {
    isLoggedIn,
    ordered,
    hasCourseId: !!id,
    shouldFetch: isLoggedIn && ordered && !!id,
    courseId: id
  });

  // Debug: Log the analytics data when it changes
  console.log('🔍 Course Analytics Data:', {
    courseAnalytics,
    hasCourseSummary: courseAnalytics?.courseSummary,
    totalProductsAvailable: courseAnalytics?.courseSummary?.totalProductsAvailable,
    totalVideoTimeFormatted: courseAnalytics?.courseSummary?.totalVideoTimeFormatted
  });

  // Show loading state while data is being fetched
  if (isLoading || !course || !course.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }
  
  // Show error state if data fetching failed
  if (error || !course || !course.id) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading course details</p>
          <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      );
    }
    
  return (
    <div className="overflow-x-hidden bg-[url(/bg/common.jpg)] bg-cover bg-top">
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Video + Info */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden">
              {course?.teaserVideo ? (
                <video
                  controls
                  className="w-full h-full object-cover"
                  poster={course?.imageLink ? `${course.imageLink}` : undefined}
                >
                  <source
                    src={course.teaserVideo.startsWith('http') ? course.teaserVideo : `${process.env.NEXT_PUBLIC_API_URL}${course.teaserVideo}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : course?.imageLink ? (
                <Image
                  src={course.imageLink.startsWith('http') 
                    ? course.imageLink 
                    : `${process.env.NEXT_PUBLIC_API_URL}${course.imageLink}`}
                  alt="Course Image"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-course.jpg'; // Fallback to placeholder
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="text-4xl mb-2">📚</div>
                    <p>Course Image</p>
                  </div>
                </div>
              )}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {course?.name}
            </h2>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              {/* Left: Author Info */}
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9">
                  {course?.creator?.imageLink ? (
                    <Image
                      src={course.creator.imageLink.startsWith('http') 
                        ? course.creator.imageLink 
                        : `${process.env.NEXT_PUBLIC_API_URL}${course.creator.imageLink}`}
                      alt="Author"
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  {/* Fallback User icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{course?.creator?.name}</span>
                  <span className="text-xs text-gray-400">Skillocraft</span>
                </div>
              </div>

              {/* Right: Course Summary from Analytics */}
              {courseAnalytics?.courseSummary ? (
                <div className="flex flex-col items-end text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1 mb-1">
                    🎥 <span>{courseAnalytics.courseSummary.totalProductsAvailable || 0} videos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    ⏱️ <span>{courseAnalytics.courseSummary.totalVideoTimeFormatted || '0:00'}</span>
                  </div>
                </div>
              ) : courseAnalytics ? (
                // Analytics data exists but courseSummary is missing - show loading/error state
                <div className="flex flex-col items-end text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center gap-1 mb-1">
                    📊 <span>Loading analytics...</span>
                  </div>
                </div>
              ) : (
                // No analytics data available - show fallback
                <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    👁️ <span>2.3k views</span>
                  </span>
                  <span className="flex items-center gap-1">
                    ❤️ <span>1.4k likes</span>
                  </span>
                </div>
              )}
            </div>



            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">About Course</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {course?.longDescription}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
                {course?.reviews?.count > 0 && course?.reviews?.data && course.reviews.data.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        // Calculate average rating from all reviews
                        const averageRating = course.reviews.data.reduce((sum, review) => sum + review.rating, 0) / course.reviews.data.length;
                        return (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= averageRating
                                ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm text-gray-600">
                      {course.reviews?.count || 0} {course.reviews?.count === 1 ? 'Review' : 'Reviews'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-5">
                {course?.reviews?.data && course.reviews.data.length > 0 ? (
                  course.reviews.data.map((review) => (
                    <div key={review.id} className="flex items-start gap-3">
                      <div className="relative">
                        {review.customer?.user?.avatarUrl ? (
                          <Image
                            src={review.customer?.user?.avatarUrl.startsWith('http') 
                              ? review.customer?.user?.avatarUrl 
                              : `${process.env.NEXT_PUBLIC_API_URL}${review.customer?.user?.avatarUrl}`}
                            alt={review.customer?.name || 'Customer'}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-[#3DCBB1]">
                            {review.customer?.name || 'Anonymous'}
                          </p>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {review.comment}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Star className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No reviews yet. Be the first to review this course!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits */}
            <h3 className="mt-10 text-lg font-semibold text-secondary mb-6">
                This course offers the following <span className="text-primary">benefits for FREE</span>
            </h3>
            <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <span className="text-2xl mb-2">📘</span>
                  <p className="font-medium">Study Material</p>
                </div>
                <div className="flex flex-col items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <span className="text-2xl mb-2">💡</span>
                  <p className="font-medium">Doubt Solving</p>
                </div>
                <div className="flex flex-col items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <span className="text-2xl mb-2">🔒</span>
                  <p className="font-medium">Lifetime Recording</p>
                </div>
              </div>
            </div>

            {/* Learn by Doing Section */}
            <section className="bg-gray-100 py-10 px-6 sm:px-10 rounded-2xl mt-12 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
                Learn by doing with video lessons
              </h2>

              <div className="space-y-3">
                {course?.products && course.products.length > 0 && course.products.map((product,index) => (
                  <details
                    key={index}
                    className="group bg-white rounded-xl overflow-hidden"
                  >
                    <summary className="flex justify-between items-center px-4 py-3 cursor-pointer list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm">{index + 1}</span>
                        <span className="font-medium text-gray-800">{product.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        {(product.formattedDuration && product.formattedDuration !== '00:00:00') || formatDuration(product.duration)
                          ? <span>{product.formattedDuration !== '00:00:00' ? product.formattedDuration : formatDuration(product.duration)}</span>
                          : null}
                        <span className="transition-transform duration-300 group-open:rotate-90">▶️</span>
                      </div>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-gray-600">
                      {product.description}
                    </div>
                  </details>
                ))}
              </div>
            </section>
            {/* Certificates */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-secondary mb-2">Online Certificates to <span className="text-primary">Prove Your Skills</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
                <Image src="/certifiacte.png" alt="Certificate" width={300} height={200} className="rounded" />
                <div className="col-span-2 text-sm">
                  <p>✅ Official and Validated</p>
                  <p>✨ Share with ease</p>
                  <p>🏆 Gain recognition</p>
                </div>
              </div>
            </div>
            {/* FAQs */}
            <div className="mt-16">
              <div className="max-w-4xl mx-auto">
                <div className="md:mb-4 mb-2">
                  <span className="text-sm font-light text-primary">FAQs</span>
                  <h3 className="text-lg font-semibold text-secondary">
                    Frequently
                    <span className="text-primary pl-2">
                      Asked Questions
                    </span>
                  </h3>
                </div>
                {isLoadingFaqs ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-full mt-3"></div>
                        <div className="h-3 bg-gray-100 rounded w-5/6 mt-1"></div>
                      </div>
                    ))}
                  </div>
                ) :  null}
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={faq.id || index} className="group bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      <summary className="flex items-center justify-between p-4 font-medium cursor-pointer list-none text-secondary text-normal text-md hover:bg-gray-50 transition-colors">
                        <span>{faq.question}</span>
                        <span className="transition-transform duration-200 group-open:rotate-180">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <p className="p-4 pt-0 text-gray-600 text-thin text-sm">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
            {/* Recommendations */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-secondary mb-4">Recommended <span className="text-primary">Courses</span> 😍</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {course?.similarCourses?.map((i) => {
                  // Add fallback for image source
                  const imageSrc = i.image 
                    ? `${i.image}`
                    : '/placeholder-course.jpg'; // Add a placeholder image in your public folder
                  
                  return(
                  <div key={i.id} className="bg-white p-3 rounded shadow text-sm">
                    <div className="aspect-video bg-gray-200 mb-2">
                      <Image src={imageSrc} 
                        alt={i.name} 
                        width={300} 
                        height={200} 
                        className="rounded" />
                    </div>
                    <h4 className="font-medium leading-snug">{course.name}</h4>
                    <p className="text-gray-500 text-xs">by Skillocraft</p>
                    <div className="text-primary font-semibold mt-1">₹{course.price}</div>
                  </div>
                )})}
              </div>
            </div>
            <footer className="mt-12 text-sm py-6">
              <p className="font-semibold text-secondary text-4xl">Keep Learning</p>
              <span className="font-semibold text-4xl text-primary pl-20">Keep Growing 🌱</span>
            </footer>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Box */}
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-800">₹{course.price}</div>
                <div className="text-sm bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded">
                  20% OFF
                </div>
              </div>
              <div className="text-xs text-gray-400 line-through mt-1">₹{course.price}</div>
              <button 
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isPlacingOrder}
                onClick={async () => {
                  if (!isLoggedIn) {
                    toast.info('Please login to purchase this course');
                    // Open login modal instead of redirecting
                    openModal('login');
                    return;
                  }
                  // If already purchased, start the course (go to first product)
                  if (ordered) {
                    const firstProductId = course?.products && course.products.length > 0 ? course.products[0].id : null;
                    if (firstProductId) {
                      router.push(`/courses/${id}/${firstProductId}`);
                    } else {
                      toast.error('No lessons available in this course yet');
                    }
                    return;
                  }
                  // If already in cart, redirect to cart page
                  if (inCart) {
                    router.push('/cart');
                    return;
                  }
                  try {
                    setIsPlacingOrder(true);
                    // Add this course to cart
                    const res = await axiosHomeProtected.post('/cart', {
                      courseId: course.id,
                    });
                    if (res.data?.status === 1) {
                      toast.success(res.data?.message || 'Course added to cart successfully');
                      setInCart(true); // Update state so button becomes "Go to cart"
                      invalidateNavbarData(); // Invalidate navbar data to update cart count
                    } else {
                      toast.error(res.data?.message || 'Failed to add to cart');
                    }
                  } catch (e: unknown) {
                    const status = (e as { response?: { status?: number } })?.response?.status;
                    if (status === 401) {
                      toast.info('Please login to add items to your cart');
                      openModal('login');
                      return;
                    }
                    const message = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add to cart';
                    toast.error(message);
                  } finally {
                    setIsPlacingOrder(false);
                  }
                }}
              >
                {isPlacingOrder
                  ? 'Adding to cart...'
                  : ordered
                  ? 'Start'
                  : inCart
                  ? 'Go to cart'
                  : 'Buy'}
              </button>
              <ul className="mt-4 text-sm text-gray-600 space-y-2">
                <li>🎥 {course?.products?.length || 0} Lectures</li>
                {calculateTotalDuration(course?.products) && (
                  <li>⏱️ {calculateTotalDuration(course?.products)} total length</li>
                )}
                <li>🌐 English</li>
                <li>💬 Doubt clearing session available</li>
              </ul>
            </div>
            {/* Instructor Card */}
            <div className="bg-black rounded-2xl text-white overflow-hidden shadow">
              <div className="relative h-48 w-full">
                <Image
                  src="/signup.jpg"
                  alt="Instructor Background"
                  layout="fill"
                  objectFit="cover"
                  className="opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-20 h-20">
                    {course.creator?.imageLink ? (
                      <Image
                        src={`${course.creator.imageLink}`}
                        alt={course.creator?.name || 'Instructor'}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-white"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : 
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-600 rounded-full border-4 border-white">
                      <User className="w-8 h-8 text-gray-300" />
                    </div>}
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="text-lg font-semibold">{course.creator?.name || 'Instructor'}</div>
                <div className="text-xs text-gray-400 mt-1">{course.creator?.designation || 'Course Creator'}</div>
                <hr className="border-gray-700 my-3" />
                <ul className="text-sm text-gray-300 space-y-1">
                  {/* <li>✅ Conducted over 200+ Sessions</li>
                  <li>✅ 7+ Years in English & Hindi</li>
                  <li>✅ Taught over 250K+ students</li> */}
                  <li>{course.creator?.description}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
