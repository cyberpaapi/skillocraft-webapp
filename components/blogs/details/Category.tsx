"use client";

import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import CategoryCard from "@/components/common/card/Category";
import { useEffect, useState } from "react";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { toast } from "sonner";

// const categoryData = [
//   {
//     imageSrc: "/category/1.jpg",
//     title: "Baking",
//     link: "/",
//     overlayColorClass: "bg-primary/85",
//     titleColorClass: "text-white",
//   },
//   {
//     imageSrc: "/category/1.jpg",
//     title: "Cosmetology",
//     link: "/",
//     overlayColorClass: "bg-white/85",
//     titleColorClass: "text-primary",
//   },
//   {
//     imageSrc: "/category/1.jpg",
//     title: "Occult",
//     link: "/",
//     overlayColorClass: "bg-primary/85",
//     titleColorClass: "text-white",
//   },
//   {
//     imageSrc: "/category/1.jpg",
//     title: "Handicraft",
//     link: "/",
//     overlayColorClass: "bg-white/85",
//     titleColorClass: "text-primary",
//   },
//   {
//     imageSrc: "/category/1.jpg",
//     title: "Baking",
//     link: "/",
//     overlayColorClass: "bg-primary/85",
//     titleColorClass: "text-white",
//   },
// ];

const CategoryBlogInside = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  
    const { data: response } = useQuery({
      queryKey: ['categories'],
      queryFn: async () => {
        try {
          const response = await axiosHomePublic.get<{ 
            status: number;
            message: string;
            data: Category[];
          }>('/categories');
          return response.data;
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err.response?.data?.message || 'Failed to fetch categories');
          return { data: [] };
        }
      },
      refetchOnWindowFocus: false,
    });
  
    useEffect(() => {
      if (response?.data) {
        setCategories(response.data);
      }
    }, [response]);
    
  return (
    <section className="relative lg:pb-24 pb-12">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-medium text-secondary text-center">
            Popular{" "}<span className="inline-block font-bold text-primary">Categories</span>{" "}of Skillocraft
          </h2>
        </div>
        
        {/* Category Cards Slider */}
        <div className="columns-1">
          <Swiper
            modules={[Pagination, Autoplay]}
            loop={true}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              1024: { slidesPerView: 4 },
              768: { slidesPerView: 3 },
              640: { slidesPerView: 2 },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            speed={3000}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {categories.map((category, index) => {
              const isEven = index % 2 === 0;

              const overlayColorClass = isEven
                ? "bg-white/85"
                : "bg-primary/85";
          
              const titleColorClass = isEven
                ? "text-primary"
                : "text-white";
              return (
                <SwiperSlide key={index}>
                  <CategoryCard key={index} {...category} 
                  overlayColorClass={overlayColorClass}
                  titleColorClass={titleColorClass}/>
                </SwiperSlide>
                )
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CategoryBlogInside;
