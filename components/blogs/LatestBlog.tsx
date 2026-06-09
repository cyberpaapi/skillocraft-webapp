"use client";

import Image from "next/image";
import { Lobster } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import BlogCard from "@/components/common/card/Blog";
import { useEffect, useState } from "react";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { toast } from "sonner";
import { BlogListResponseData } from "@/types";

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
});

// const blogData = [
//   {
//     imageSrc: "/blogs/a1.jpg",
//     tagText: "Online Business",
//     title: "Elitty: Shark Tank India Season 3",
//     titleLink: "/blogs/1",
//     description: "Lorem ipsum dolor sit amet consectetur. Nunc elementum et nibh amet pellentesque duis. Egestas et porta non leo. Et vitae accumsan nulla nec euismod eu urna metus.",
//   },
//   {
//     imageSrc: "/blogs/a2.jpg",
//     tagText: "Online Business",
//     title: "Elitty: Shark Tank India Season 3",
//     titleLink: "/blogs/2",
//     description: "Lorem ipsum dolor sit amet consectetur. Nunc elementum et nibh amet pellentesque duis. Egestas et porta non leo. Et vitae accumsan nulla nec euismod eu urna metus.",
//   },
//   {
//     imageSrc: "/blogs/a3.jpg",
//     tagText: "Online Business",
//     title: "Elitty: Shark Tank India Season 3",
//     titleLink: "/blogs/3",
//     description: "Lorem ipsum dolor sit amet consectetur. Nunc elementum et nibh amet pellentesque duis. Egestas et porta non leo. Et vitae accumsan nulla nec euismod eu urna metus.",
//   },
//   {
//     imageSrc: "/blogs/a2.jpg",
//     tagText: "Online Business",
//     title: "Elitty: Shark Tank India Season 3",
//     titleLink: "/blogs/4",
//     description: "Lorem ipsum dolor sit amet consectetur. Nunc elementum et nibh amet pellentesque duis. Egestas et porta non leo. Et vitae accumsan nulla nec euismod eu urna metus.",
//   },
// ];

const BlogLatest = () => {
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
          blog.status === 'ACTIVE'
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
    <section className="relative lg:py-24 py-12">
      <Image
        src="/bg/ptrn/2.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto lg:mb-20  mb-12">
          <h5 className="md:text-2xl text-lg font-medium text-primary text-center">
            All the Blogs contains resources and data’s to start home business and to become a successful entrepreneur.{" "}
            <span className={`inline-block text-secondary ${lobster.className}`}>
              #So start your learning now.
            </span>
          </h5>
        </div>
        {/* Section Title */}
        <div className="md:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-semibold text-secondary text-center">
            Latest{" "}<span className="inline-block text-primary">Blogs</span>{" "}
          </h2>
        </div>
        {blogs.length > 0 && (
        <Swiper
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
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
          modules={[Pagination, Autoplay]}
          className="pb-10"
        >
          {blogs?.map((blog, index) => (
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

export default BlogLatest;
