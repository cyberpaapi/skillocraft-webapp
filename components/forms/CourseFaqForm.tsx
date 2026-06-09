'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { axiosProtected } from '@/services/axiosService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  name: string;  // Changed from title to name to match API response
  description: string;
  // Add other course fields as needed
}

export default function CourseFaqForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    courseId: ''
  });

  // Fetch courses with error handling
  const { data: coursesResponse, isLoading: isLoadingCourses, error: coursesError } = useQuery<{
    status: number;
    message: string;
    courses?: Course[];
    data?: Course[]; // Some APIs might return data instead of courses
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  }>({
    queryKey: ['courses-list'],
    queryFn: async () => {
      try {
        const response = await axiosProtected.get('/courses', {
          params: {
            page: 1,
            limit: 100,
            status: 'ACTIVE'
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
    },
  });

  // Get courses from the response, handling different possible response structures
  const courses = (() => {
    if (!coursesResponse) return [];
    
    // Check different possible response structures
    if (Array.isArray(coursesResponse.courses)) {
      return coursesResponse.courses;
    } else if (Array.isArray(coursesResponse.data)) {
      return coursesResponse.data;
    } else if (Array.isArray(coursesResponse)) {
      return coursesResponse; // In case the API returns the array directly
    }
    
    return [];
  })();
  
  // Debug: Log courses data and error
  console.log('Courses response:', coursesResponse);
  console.log('Courses list:', courses);
  if (coursesError) {
    console.error('Error loading courses:', coursesError);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
      
    setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosProtected.post(
        '/adminpanel/course-faqs',
        {
          question: formData.question,
          answer: formData.answer,
          courseId: formData.courseId
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Course FAQ created successfully');
      router.push('/admin/coursefaq');
      router.refresh();
    } catch (error: unknown) {
      console.error('Error creating course FAQ:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to create course FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="Enter question"
            required
            disabled={loading}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <Label htmlFor="courseId">Course</Label>
            <Select
              name="courseId"
              value={formData.courseId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
              required
              disabled={isLoadingCourses}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoadingCourses ? 'Loading courses...' : 'Select a course'
                } />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}  {/* Changed from title to name to match API response */}
                  </SelectItem>
                ))}
                {courses.length === 0 && !isLoadingCourses && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No courses found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer">Answer</Label>
          <Textarea
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            placeholder="Enter answer"
            className="min-h-[100px]"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Course FAQ'
          )}
        </Button>
      </div>
    </form>
  );
}
