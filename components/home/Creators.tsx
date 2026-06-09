"use client";

import * as React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import CreatorCard from "@/components/common/card/Creator";
import { FC, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { toast } from "sonner";
import { Creator } from "@/types";

// const creatorData = [
//   {
//     imageSrc: "/creators/a1.jpg",
//     name: "RESHMI YADAV",
//     designation: "(MAKEOVER COURSE FACULTY)",
//     description: "8+ years experience on make over industry & taught more than 5000+ student in her own academy.",
//   },
//   {
//     imageSrc: "/creators/a2.jpg",
//     name: "NISHANT DAVE",
//     designation: "(PERFUME AND ATAR MAKING COURSE FACULTY)",
//     description: "Run his own brand which is one of the highest- selling perfume brands in the e-commerce industry, taught more than 8000+ Students to start their own perfume and soap brand.",
//   },
//   {
//     imageSrc: "/creators/a3.jpg",
//     name: "DAKSHITA SHASTRI",
//     designation: "(ASTROLOGY COURSE FACULTY)",
//     description: "Famous astrologer from bengal with 10+ years of experience and 90% success rate to solve her client's issues. One of the highest-paid astrologers in Astrotalk.",
//   },
//   {
//     imageSrc: "/creators/a2.jpg",
//     name: "RESHMI YADAV",
//     designation: "(MAKEOVER COURSE FACULTY)",
//     description: "8+ years experience on make over industry & taught more than 5000+ student in her own academy.",
//   },
// ];

interface CreatorListResponse {
  status: number;
  message: string;
  data: Creator[];
}

const CreatorHome:FC = () => {

      const [creator, setCreator] = useState<Creator[]>([]);
  

  const { data: response } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      try {
        const response = await axiosHomePublic.get<CreatorListResponse>("/creators");
        return response.data.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch creators');
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (response && Array.isArray(response)) {
      setCreator(response);
    }
  }, [response]);
  
  return (
    <section className="relative lg:pb-24 pb-12">
      <Image
        src="/bg/ptrn/7.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-semibold text-secondary">
            Our{" "}<span className="inline-block text-primary">Creators</span>
          </h2>
        </div>

        {/* Creator Cards */}
        <div className="max-w-4xl mx-auto md:p-8 p-4 md:rounded-3xl rounded-2xl shadow-xl bg-white">
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
            {creator.map((creator, index) => (
              <SwiperSlide key={index}>
                <CreatorCard key={index} {...creator} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CreatorHome;
