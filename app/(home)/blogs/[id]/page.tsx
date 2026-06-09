'use client';

import { useParams } from 'next/navigation';
//import { toast } from 'sonner';
import HeroBlogInside from '@/components/blogs/details/Hero';
import BlogDetails from '@/components/blogs/details/Details';
import FaqBlogDetails from '@/components/blogs/details/Faq';
import CategoryBlogInside from '@/components/blogs/details/Category';
import CoursesBlog from '@/components/blogs/details/Courses';
import BlogLovedInside from '@/components/blogs/details/LovedBlog';
import TaglineBlogInside from '@/components/blogs/details/Tagline';
import { BlogDetailsResponseData } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { axiosHomePublic } from '@/services/axiosHomeService';

export default function BlogDetailsPage() {
  const { id } = useParams();

  const { data: blogData, isLoading, error } = useQuery<BlogDetailsResponseData>({
    queryKey: ['blogDetails', id],
    queryFn: async () => {
      try {
        const response = await axiosHomePublic.get(`/blogs/${id}`);
        return response.data.data;
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        throw new Error(error.response?.data?.message || 'Failed to fetch course details');
      }
    },
  });

  console.log('Blog Data:', blogData);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Error loading blog: {error.message}</div>;
  }

  if (!blogData) {
    return <div className="text-center p-8">No blog data found</div>;
  }

  return (
    <>
      <HeroBlogInside />
      <TaglineBlogInside />
      <BlogDetails {...blogData} />
      <FaqBlogDetails />
      <CoursesBlog />
      <BlogLovedInside />
      <CategoryBlogInside />
    </>
  );
}
