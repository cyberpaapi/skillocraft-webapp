"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Grid } from "swiper/modules";
import BlogCard from "@/components/common/card/Blog";
import { useEffect, useState } from "react";
import { BlogListResponseData } from "@/types";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { toast } from "sonner";

const BlogLoved = () => {
  const [blogs, setBlogs] = useState<BlogListResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const fetchedBlogs = response.data.data.filter((blog: BlogListResponseData) => 
          blog.featured === true && blog.status === 'ACTIVE'
        );
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
  }, []);

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
    <section className="relative lg:pb-24 pb-12">
      <Image
        src="/bg/ptrn/4.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-semibold text-secondary text-center">
            Most{" "}<span className="inline-block text-primary">Loved Blogs</span>{" "}
          </h2>
        </div>
        {blogs.length > 0 && (
          <Swiper
            loop={true}
            spaceBetween={20}
            slidesPerView={1}
            grid={{
              rows: 3,
              fill: "row",
            }}
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
            pagination={{
              clickable: true,
              dynamicBullets: true,
              renderBullet: (index, className) =>
                `<span class="${className} custom-bullet">${index + 1}</span>`,
            }}
            modules={[Grid, Pagination, Autoplay]}
            className="pb-10"
          >
            {blogs.map((blog, index) => (
              <SwiperSlide key={index}>
                <BlogCard key={index} {...blog} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default BlogLoved;
