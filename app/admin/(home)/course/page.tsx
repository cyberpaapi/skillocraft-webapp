'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import DataTable from '@/components/tables/course/DataTable';
import { columns } from '@/components/tables/course/column';
import { Course } from '@/types';

type Category = {
  id: string;
  name: string;
};

export default function CoursePage() {
  // State for data and loading
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  
  // Update URL when pagination or category changes
  useEffect(() => {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    });
    
    if (activeCategory !== 'all') {
      params.set('category', activeCategory);
    }
    
    // Update URL without causing a page reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }, [pagination.page, pagination.limit, activeCategory]);
  
  // Initialize state from URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const page = parseInt(params.get('page') || '1', 10);
      const limit = parseInt(params.get('limit') || '10', 10);
      const category = params.get('category') || 'all';
      
      setPagination(prev => ({
        ...prev,
        page: isNaN(page) ? 1 : page,
        limit: isNaN(limit) ? 10 : limit,
      }));
      
      if (category) {
        setActiveCategory(category);
      }
    }
  }, []);

  // Fetch categories for the tab menu
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await axiosProtected.get<{ 
          status: number;
          message: string;
          data: Category[] | undefined;
        }>('/categories');
        
        // Ensure we always return an array, even if data is undefined or null
        return Array.isArray(response.data?.data) ? response.data.data : [];
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch categories');
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  // Ensure categories is always an array
  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];

  // Fetch courses with pagination and category filter
  const { data: coursesData, isLoading, refetch } = useQuery({
    queryKey: ['courses', pagination.page, pagination.limit, activeCategory],
    queryFn: async ({ queryKey }) => {
      const [, page, limit, category] = queryKey as [string, number, number, string];
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        });
        
        if (category && category !== 'all') {
          params.append('category', category);
        }
        
        const url = `/courses?${params.toString()}`;

        const response = await axiosProtected.get<{ 
          status: number;
          message: string;
          courses: Course[];
          pagination: {
            page: number;
            limit: number;
            total: number;
          };
        }>(url);
        
        return response.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch courses');
        return { 
          courses: [], 
          pagination: { ...pagination, total: 0 } 
        };
      }
    },
    refetchOnWindowFocus: false,
  });

  // Update pagination when data is fetched
  useEffect(() => {
    if (coursesData?.pagination) {
      setPagination(prev => ({
        ...prev,
        ...coursesData.pagination
      }));
    }
  }, [coursesData?.pagination]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Reset to first page when changing categories
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    // Trigger a refetch when category changes
    refetch();
  };

  // Handle page size change
  const handlePageSizeChange = (limit: number) => {
    setPagination(prev => ({
      ...prev,
      limit,
      page: 1 // Reset to first page when changing page size
    }));
  };

  if (isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage your courses and their content</p>
        </div>
        <Link href="/admin/course/create" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <Tabs 
            value={activeCategory} 
            onValueChange={handleCategoryChange}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <DataTable 
            columns={columns} 
            data={coursesData?.courses || []} 
            isLoading={isLoading}
          />
          
          <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              'Loading...'
            ) : (
              `Showing ${coursesData?.courses?.length || 0} of ${pagination.total} courses`
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= (pagination.total || 0) || isLoading}
            >
              Next
            </Button>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={pagination.limit}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={isLoading}
            >
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
            </select>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
