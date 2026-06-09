'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Clock, Users, BookOpen, Award, Tag, Plus, Star, User, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/tables/product/DataTable';
import { getProductColumns } from '@/components/tables/product/column';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import { CourseDetails, Category } from '@/types';
import Link from 'next/link';
import { CourseEditForm } from '@/components/forms/course-edit-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { CourseCustomer } from '@/types';

// Interfaces for video analytics API response
interface VideoAnalytics {
  id: string;
  userId: string;
  productId: string;
  courseId: string;
  deviceType: string;
  operatingSystem: string;
  browser: string;
  watchDuration: number;
  totalTime: number;
  completionRate: number;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    customer: {
      name: string;
    };
  };
  product: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
}

interface AnalyticsSummary {
  totalViews: number;
  totalWatchTime: number;
  averageWatchTime: number;
  averageCompletionRate: number;
}

interface AnalyticsDistribution {
  [key: string]: number;
}

interface VideoAnalyticsResponse {
  status: number;
  message: string;
  data: {
    analytics: VideoAnalytics[];
    summary: AnalyticsSummary;
    deviceDistribution: AnalyticsDistribution;
    osDistribution: AnalyticsDistribution;
    browserDistribution: AnalyticsDistribution;
  };
}

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  //const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const queryClient = useQueryClient();
  
  // State for review creation
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customerId: '',
    courseId: id as string,
    details: '',
    ratting: '',
  });
  
  // Mutation for creating review
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: {
      customerId: string;
      courseId: string;
      details: string;
      ratting: number;
    }) => {
      const response = await axiosProtected.post('/adminpanel/reviews', reviewData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Review created successfully');
      setIsReviewDialogOpen(false);
      setReviewForm({
        customerId: '',
        courseId: id as string,
        details: '',
        ratting: '',
      });
      // Invalidate and refetch reviews if needed
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to create review');
    },
  });
  
  // Fetch customers for dropdown
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['course-customers', id],
    queryFn: async () => {
      try {
        const response = await axiosProtected.get(`/courses/${id}/customers`);
        return response.data.data;
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || 'Failed to fetch customers');
        return { customers: [] };
      }
    },
  });
  
  // Transform customers to combobox options
  const customerOptions = customersData?.customers?.map((customer: CourseCustomer) => ({
    value: customer.id,
    label: customer.user?.email || `${customer.name} (${customer.id})`
  })) || [];
  
  const handleCreateReview = () => {
    if (!reviewForm.customerId || !reviewForm.details || !reviewForm.ratting) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Convert rating to number as expected by the API
    const reviewData = {
      ...reviewForm,
      ratting: parseInt(reviewForm.ratting, 10)
    };
    
    createReviewMutation.mutate(reviewData);
  };

  // Fetch categories and subcategories for the edit form
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        //const [categoriesResponse, subcategoriesResponse] = await Promise.all([
        const [categoriesResponse] = await Promise.all([
          axiosProtected.get('/categories'),
          //axiosProtected.get('/adminpanel/subcategories')
        ]);
        setCategories(categoriesResponse.data.data || []);
        //setSubcategories(subcategoriesResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    fetchFormData();
  }, []);

  // Define interface for course update data
  interface CourseUpdateData {
    title?: string;
    description?: string;
    shortDescription?: string;
    price?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    featured?: boolean;
    categoryId?: string;
    subCategoryId?: string;
    image?: File;
    language?: string;
  }

  // Mutation for updating course
  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CourseUpdateData }) => {
      const formData = new FormData();
      
      // Append all form fields to formData
      (Object.keys(data) as Array<keyof CourseUpdateData>).forEach(key => {
        const value = data[key];
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await axiosProtected.put(
        `/adminpanel/courses/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Course updated successfully');
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      setIsEditModalOpen(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      console.error('Error updating course:', error);
      toast.error(error.response?.data?.message || 'Failed to update course');
    },
  });

  const handleEditSubmit = async (formData: CourseUpdateData) => {
    await updateCourseMutation.mutateAsync({
      id: id as string,
      data: formData
    });
  };

  // Fetch course details
  const { data: course, isLoading, error } = useQuery<CourseDetails>({
    queryKey: ['course', id],
    queryFn: async () => {
      try {
        const response = await axiosProtected.get(`/courses/${id}`);
        return response.data.data;
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        throw new Error(error.response?.data?.message || 'Failed to fetch course details');
      }
    },
  });

  // Fetch video analytics
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery<VideoAnalyticsResponse>({
    queryKey: ['video-analytics', id],
    queryFn: async () => {
      try {
        const response = await axiosProtected.get(`/adminpanel/video-analytics/course/${id}`);
        return response.data;
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || 'Failed to fetch video analytics');
        return {
          status: 0,
          message: 'Failed to fetch analytics',
          data: {
            analytics: [],
            summary: {
              totalViews: 0,
              totalWatchTime: 0,
              averageWatchTime: 0,
              averageCompletionRate: 0,
            },
            deviceDistribution: {},
            osDistribution: {},
            browserDistribution: {},
          },
        };
      }
    },
    enabled: !!id, // Only fetch when course ID is available
  });

  // Format price with Indian Rupees (INR)
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      //maximumFractionDigits: 0, // No paise needed
    }).format(Number(price));
  };

  // Handle delete course
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axiosProtected.delete(`/adminpanel/course/${id}`);
        toast.success('Course deleted successfully');
        router.push('/admin/course');
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !course) {
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
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-1">{course.name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button 
            size="sm" 
            asChild
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href={`/admin/course/${id}/create`} className="flex items-center justify-center">
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Add Product</span>
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            <Edit className="h-4 w-4 mr-1.5" />
            <span>Edit Course</span>
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Course details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Teaser Video */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-card bg-black">
            {course.teaserVideo ? (
              <video
                src={`${course.teaserVideo}`}
                controls
                className="absolute inset-0 w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <span className="text-muted-foreground">No teaser video available</span>
              </div>
            )}
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Course Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Short Description</h3>
                <p className="mt-1">{course.shortDescription}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">{formatPrice(course.price)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{course.category?.name || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Subcategory</p>
                    <p className="font-medium">{course.subCategory?.name || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs for additional content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <div className="space-y-6">
                {/* Course Overview Section */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-medium mb-4">Course Overview</h3>
                  <div className="prose max-w-none">
                    {course.longDescription ? (
                      <div className="whitespace-pre-line">{course.longDescription}</div>
                    ) : (
                      <p className="text-muted-foreground">No description available for this course.</p>
                    )}
                  </div>
                </div>
                
                {/* Curriculum Section */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-medium mb-6">Course Curriculum</h3>
                  <DataTable 
                    columns={getProductColumns(id as string)} 
                    data={course.products || []} 
                    searchKey="name"
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </TabsContent>
            
            
            <TabsContent value="reviews" className="pt-4">
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Student Reviews</h3>
                  <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create New Review</DialogTitle>
                        <DialogDescription>
                          Add a new review for this course. Fill in all the required information.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="customerId" className="text-right">
                            Customer
                          </Label>
                          <div className="col-span-3">
                            <Combobox
                              options={customerOptions}
                              value={reviewForm.customerId}
                              onValueChange={(value) => setReviewForm({ ...reviewForm, customerId: value })}
                              placeholder="Select a customer..."
                              searchPlaceholder="Search customers by email..."
                              emptyMessage="No customers found."
                              disabled={isLoadingCustomers}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="ratting" className="text-right">
                            Rating
                          </Label>
                          <Select
                            value={reviewForm.ratting}
                            onValueChange={(value) => setReviewForm({ ...reviewForm, ratting: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Star</SelectItem>
                              <SelectItem value="2">2 Stars</SelectItem>
                              <SelectItem value="3">3 Stars</SelectItem>
                              <SelectItem value="4">4 Stars</SelectItem>
                              <SelectItem value="5">5 Stars</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="details" className="text-right">
                            Review
                          </Label>
                          <Textarea
                            id="details"
                            value={reviewForm.details}
                            onChange={(e) => setReviewForm({ ...reviewForm, details: e.target.value })}
                            className="col-span-3"
                            placeholder="Enter review details"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleCreateReview}
                          disabled={createReviewMutation.isPending}
                        >
                          {createReviewMutation.isPending ? 'Creating...' : 'Create Review'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-4">
                  {course.reviews && course.reviews.data && course.reviews.data.length > 0 ? (
                    <div className="rounded-lg border">
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold">Student Reviews ({course.reviews.count})</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {course.reviews.data.map((review) => (
                            <div key={review.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= review.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium">{review.rating}/5</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="relative">
                                  {review.customer?.user?.avatarUrl ? (
                                    <Image
                                      src={`${review.customer?.user?.avatarUrl}`}
                                      alt={review.customer?.name || 'Customer'}
                                      width={32}
                                      height={32}
                                      className="rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  {review.customer?.name || 'Anonymous'}
                                </p>
                              </div>
                              <p className="text-sm">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No reviews yet. Be the first to add a review!</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="pt-4">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-medium mb-6">Video Analytics</h3>
                
                {isLoadingAnalytics ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : analyticsData?.data ? (
                  <div className="space-y-6">
                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                            <p className="text-2xl font-bold">{analyticsData.data.summary.totalViews}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Clock className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-muted-foreground">Total Watch Time</p>
                            <p className="text-2xl font-bold">{Math.round(analyticsData.data.summary.totalWatchTime / 60)}m</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-muted-foreground">Avg. Watch Time</p>
                            <p className="text-2xl font-bold">{Math.round(analyticsData.data.summary.averageWatchTime / 60)}m</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Award className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-muted-foreground">Avg. Completion</p>
                            <p className="text-2xl font-bold">{analyticsData.data.summary.averageCompletionRate.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Device Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <h4 className="font-medium mb-4">Device Distribution</h4>
                        <div className="space-y-3">
                          {Object.entries(analyticsData.data.deviceDistribution).map(([device, count]) => (
                            <div key={device} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{device}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${(count / analyticsData.data.summary.totalViews) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <h4 className="font-medium mb-4">OS Distribution</h4>
                        <div className="space-y-3">
                          {Object.entries(analyticsData.data.osDistribution).map(([os, count]) => (
                            <div key={os} className="flex items-center justify-between">
                              <span className="text-sm">{os}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${(count / analyticsData.data.summary.totalViews) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <h4 className="font-medium mb-4">Browser Distribution</h4>
                        <div className="space-y-3">
                          {Object.entries(analyticsData.data.browserDistribution).map(([browser, count]) => (
                            <div key={browser} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{browser}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-purple-600 h-2 rounded-full" 
                                    style={{ width: `${(count / analyticsData.data.summary.totalViews) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Detailed Analytics Table */}
                    <div className="rounded-lg border bg-card shadow-sm">
                      <div className="p-4 border-b">
                        <h4 className="font-medium">Detailed Analytics</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-4 text-sm font-medium">User</th>
                              <th className="text-left p-4 text-sm font-medium">Device</th>
                              <th className="text-left p-4 text-sm font-medium">OS</th>
                              <th className="text-left p-4 text-sm font-medium">Browser</th>
                              <th className="text-left p-4 text-sm font-medium">Watch Time</th>
                              <th className="text-left p-4 text-sm font-medium">Completion</th>
                              <th className="text-left p-4 text-sm font-medium">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analyticsData.data.analytics.slice(0, 10).map((analytics) => (
                              <tr key={analytics.id} className="border-b hover:bg-muted/50">
                                <td className="p-4">
                                  <div>
                                    <p className="text-sm font-medium">{analytics.user.customer.name}</p>
                                    <p className="text-xs text-muted-foreground">{analytics.user.email}</p>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="text-sm capitalize">{analytics.deviceType}</span>
                                </td>
                                <td className="p-4">
                                  <span className="text-sm">{analytics.operatingSystem}</span>
                                </td>
                                <td className="p-4">
                                  <span className="text-sm capitalize">{analytics.browser}</span>
                                </td>
                                <td className="p-4">
                                  <span className="text-sm">{Math.round(analytics.watchDuration / 60)}m</span>
                                </td>
                                <td className="p-4">
                                  <span className="text-sm">{(analytics.completionRate * 100).toFixed(1)}%</span>
                                </td>
                                <td className="p-4">
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(analytics.createdAt).toLocaleDateString()}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No analytics data available for this course.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Course stats and actions */}
        <div className="space-y-6">
          {/* Course Image */}
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="font-medium mb-3">Course Image</h3>
            <div className="relative w-full h-40 rounded-md overflow-hidden bg-muted">
              {course.imageLink ? (
                <Image
                  src={`${course.imageLink}`}
                  alt={course.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder image if the image fails to load
                    (e.target as HTMLImageElement).src = '/placeholder-course.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No image available</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="font-medium mb-4">Course Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Total Students</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Total Lessons</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(course.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Last Updated</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(course.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="font-medium mb-4">Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Preview Course
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                View Students
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Course Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Course</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="py-4">
            {/* {course && categories.length > 0 && subcategories.length > 0 ? ( */}
            {course && categories.length > 0 ? (
              <CourseEditForm
                onSubmit={handleEditSubmit}
                isLoading={updateCourseMutation.isPending}
                initialData={{
                  id: course.id,
                  name: course.name,
                  shortDescription: course.shortDescription,
                  longDescription: course.longDescription,
                  price: parseFloat(course.price),
                  language: 'en', // Default language, adjust as needed
                  status: course.status as 'ACTIVE' | 'INACTIVE',
                  featured: course.featured || false ,
                  categoryId: course.category?.id || '',
                  subCategoryId: course.subCategory?.id,
                  imageUrl: course.imageLink
                }}
                categories={categories}
              />
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
