'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Course, Category } from '@/types';
import CourseCard from '@/components/courses/CourseCard';
import CoursesFilter from '@/components/courses/CoursesFilter';
import { Button } from '@/components/ui/button';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import { axiosHomePublic } from '@/services/axiosHomeService';
import { toast } from 'sonner';

function CoursesContent() {
  const searchParams = useSearchParams();
  //const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the full category list once (independent of course filtering) so the
  // filter dropdown always has every category and can resolve the selected one.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosHomePublic.get<{ data: Category[] }>('/categories');
        if (Array.isArray(res.data?.data)) setCategories(res.data.data);
      } catch {
        // non-fatal — dropdown just won't be populated
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);

      const categoryId = searchParams.get('category');
      const searchQuery = searchParams.get('q')?.toLowerCase() || '';
      
      try {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '100');

        if (categoryId && categoryId !== 'all') {
          params.append('category', categoryId);
        }

        const url = `/courses?${params.toString()}`;

        const response = await axiosHomePublic.get<{
          courses: Course[];
          pagination: { page: number; limit: number; total: number };
        }>(url);

        let fetchedCourses = response.data.courses;

        // Apply search filter
        if (searchQuery) {
          fetchedCourses = fetchedCourses.filter(
            (course) =>
              course.name?.toLowerCase().includes(searchQuery) ||
              course.shortDescription?.toLowerCase().includes(searchQuery) ||
              course.creator?.name?.toLowerCase().includes(searchQuery)
          );
        }

        //setCourses(fetchedCourses);
        setFilteredCourses(fetchedCourses);

      } catch (err) {
        const e = err as { response?: { data?: { message?: string } } };
        const msg = e.response?.data?.message || 'Failed to load courses';
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="overflow-x-hidden bg-[url(/bg/common.jpg)] bg-cover bg-top">
        <div className="min-h-screen flex items-center justify-center">
          <FiLoader className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-x-hidden bg-[url(/bg/common.jpg)] bg-cover bg-top">
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
          <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-[url(/bg/common.jpg)] bg-cover bg-top">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CoursesFilter categories={categories} />

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500">
                We could not find any courses matching your search. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}
