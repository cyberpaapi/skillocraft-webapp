"use client";

import * as React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import TestimonialCard from "@/components/common/card/Review";
import { FC, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@/types";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { toast } from "sonner";

// Group into sets of 4 (like original design)
const groupIntoSlides = (arr: Testimonial[], size = 4) => {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
};


const TestimonialHome:FC = () => {

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const { data: response } = useQuery({
    queryKey: ["Testimonials"],
    queryFn: async () => {
      try {
        const response = await axiosHomePublic.get<{ data: Testimonial[] }>("/testimonials");
        return response.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch banners');
        return { data: [] };
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (response?.data && Array.isArray(response.data)) {
      setTestimonials(response.data);
    }
  }, [response]);

  const testimonialSlides = groupIntoSlides(testimonials, 6);

  return (
    // <section className="relative lg:pb-24 pb-12">
    //   <Image
    //     src="/bg/ptrn/8.svg"
    //     width={500}
    //     height={500}
    //     alt=""
    //     className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
    //   />

    //   <div className="container mx-auto">
    //     {/* Section Title */}
    //     <div className="md:mb-12 mb-8">
    //       <span className="text-xs">TESTIMONIAL</span>
    //       <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-semibold text-secondary">
    //         What They Say?
    //       </h2>
    //     </div>

    //     {/* Testimonial Cards */}
    //     <Swiper
    //       loop={true}
    //       spaceBetween={16}
    //       slidesPerView={1}
    //       autoplay={{
    //         delay: 3000,
    //         disableOnInteraction: false,
    //       }}        
    //       speed={3000}
    //       pagination={{
    //         clickable: true,
    //         dynamicBullets: true,
    //         renderBullet: (index, className) => 
    //           `<span class="${className} custom-bullet">${index + 1}</span>`,
    //       }}
    //       modules={[Pagination, Autoplay]}
    //       className="pb-10"
    //     >
    //       <SwiperSlide>
    //         <div className="flex flex-wrap justify-center -mx-2 gap-y-5">
    //           <div className="md:w-1/3 sm:w-1/2 w-full px-2">
    //             <TestimonialCard
    //               imageSrc="/avatar/1.png"
    //               rating={4.5}
    //               description="Learn to cook with me - I love to teach cooking to my students - so many techniques and recipes! See you in the kitchen!"
    //             />
    //           </div>
    //           <div className="md:w-1/3 sm:w-1/2 w-full px-2">
    //             <TestimonialCard
    //               imageSrc="/avatar/2.png"
    //               rating={4.5}
    //               description="Learn to cook with me - I love to teach cooking to my students - so many techniques and recipes! See you in the kitchen!"
    //             />
    //           </div>
    //           <div className="md:w-1/3 sm:w-1/2 w-full px-2">
    //             <TestimonialCard
    //               imageSrc="/avatar/3.png"
    //               rating={4.5}
    //               description="Learn to cook with me - I love to teach cooking to my students - so many techniques and recipes! See you in the kitchen!"
    //             />
    //           </div>
    //           <div className="md:w-1/3 sm:w-1/2 w-fullpx-2">
    //             <TestimonialCard
    //               imageSrc="/avatar/4.png"
    //               rating={4.5}
    //               description="Learn to cook with me - I love to teach cooking to my students - so many techniques and recipes! See you in the kitchen!"
    //             />
    //           </div>
    //         </div>
    //       </SwiperSlide>
    //       <SwiperSlide>
    //         <div className="flex flex-wrap justify-center -mx-2 gap-y-5">
    //           <div className="md:w-1/3 sm:w-1/2 w-full px-2">
    //             <TestimonialCard
    //               imageSrc="/avatar/1.png"
    //               rating={4.5}
    //               description="Learn to cook with me - I love to teach cooking to my students - so many techniques and recipes! See you in the kitchen!"
    //             />
    //           </div>
    //           <div className="md:w-1/3 sm:w-1/2 w-full px-2">
    //             <TestimonialCard
    //               imageSrc="/avatar/2.png"
    //               rating={4.5}
    //               description="Learn to cook with me - I love to teach cooking to my students - so many techniques and recipes! See you in the kitchen!"
    //             />
    //           </div>
    //           <div className="md:w-1/3 sm:w-1/2 w-full px-2">
    //             <TestimonialCard
    //               imageSrc="/avatar/3.png"
    //               rating={4.5}
    //               description="Learn to cook with me - I love to teach cooking to my students - so many techniques and recipes! See you in the kitchen!"
    //             />
    //           </div>
    //           <div className="md:w-1/3 sm:w-1/2 w-full px-2">
    //             <TestimonialCard
    //               imageSrc="/avatar/4.png"
    //               rating={4.5}
    //               description="Learn to cook with me - I love to teach cooking to my students - so many techniques and recipes! See you in the kitchen!"
    //             />
    //           </div>
    //         </div>
    //       </SwiperSlide>
    //     </Swiper>
    //   </div>
    // </section>
    <section className="relative lg:pb-24 pb-12">
      <Image
        src="/bg/ptrn/8.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8">
          <span className="text-xs">TESTIMONIAL</span>
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-semibold text-secondary">
            What They Say?
          </h2>
        </div>

        {/* Testimonial Slider */}
        <Swiper
          loop={true}
          spaceBetween={16}
          slidesPerView={1}
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
          {testimonialSlides.map((group, slideIndex) => (
            <SwiperSlide key={slideIndex}>
              <div className="flex flex-wrap justify-center -mx-2 gap-y-4">
                {group.map((testimonial, i) => (
                  <div
                    key={i}
                    className="md:w-1/3 w-1/2 px-2"
                  >
                    <TestimonialCard {...testimonial} />
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialHome;
