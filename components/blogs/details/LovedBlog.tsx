"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import BlogCard from "@/components/common/card/Blog";
import { useEffect, useState } from "react";
import { BlogListResponseData } from "@/types";
import { useSearchParams } from "next/navigation";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { toast } from "sonner";

// const blogData = [
//   {
//     imageSrc: "/blogs/1.jpg",
//     tagText: "Online Business",
//     title: "Elitty: Shark Tank India Season 3",
//     titleLink: "/blogs/inside",
//     description: "Lorem ipsum dolor sit amet consectetur. Nunc elementum et nibh amet pellentesque duis. Egestas et porta non leo. Et vitae accumsan nulla nec euismod eu urna metus.",
//   },
//   {
//     imageSrc: "/blogs/2.jpg",
//     tagText: "Online Business",
//     title: "Elitty: Shark Tank India Season 3",
//     titleLink: "/blogs/inside",
//     description: "Lorem ipsum dolor sit amet consectetur. Nunc elementum et nibh amet pellentesque duis. Egestas et porta non leo. Et vitae accumsan nulla nec euismod eu urna metus.",
//   },
//   {
//     imageSrc: "/blogs/3.jpg",
//     tagText: "Online Business",
//     title: "Elitty: Shark Tank India Season 3",
//     titleLink: "/blogs/inside",
//     description: "Lorem ipsum dolor sit amet consectetur. Nunc elementum et nibh amet pellentesque duis. Egestas et porta non leo. Et vitae accumsan nulla nec euismod eu urna metus.",
//   },
//   {
//     imageSrc: "/blogs/4.jpg",
//     tagText: "Online Business",
//     title: "Elitty: Shark Tank India Season 3",
//     titleLink: "/blogs/inside",
//     description: "Lorem ipsum dolor sit amet consectetur. Nunc elementum et nibh amet pellentesque duis. Egestas et porta non leo. Et vitae accumsan nulla nec euismod eu urna metus.",
//   },
// ];

const BlogLovedInside = () => {
  const [blogs, setBlogs] = useState<BlogListResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '10');
        const url = `/blogs?${params.toString()}`;
        const response = await axiosHomePublic.get<{
          data: BlogListResponseData[];
          pagination: { page: number; limit: number; total: number };
        }>(url);

        //let fetchedBlogs = response.data.data;
        const fetchedBlogs = response.data.data.filter((blog: BlogListResponseData) => 
          blog.featured === true && blog.status === 'ACTIVE'
        );
        //setCourses(fetchedCourses);
        setBlogs(fetchedBlogs);

      } catch (err) {
        const e = err as { response?: { data?: { message?: string } } };
        const msg = e.response?.data?.message || 'Failed to load courses';
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [searchParams]);

  useEffect(() => {
  if (error) {
    toast.error('Failed to load blogs');
  }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <section className="relative lg:py-24 py-12">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-medium text-secondary">
            Most{" "}<span className="inline-block text-primary font-bold">Loved Blogs</span>{" "}
          </h2>
        </div>

        {/* Blog Cards Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          loop={true}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { 
              slidesPerView: 1,
            },
            768: { 
              slidesPerView: 2,
            },
            1024: { 
              slidesPerView: 3,
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={3000}
          pagination={{ clickable: true }}
          className="pb-12"
        >
          {blogs.map((blog, index) => (
            <SwiperSlide key={index}>
              <BlogCard key={index} {...blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BlogLovedInside;
