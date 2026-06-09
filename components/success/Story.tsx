"use client";

import * as React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import StoryCard from "@/components/common/card/Story";
import { SuccessStory } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { toast } from "sonner";

// const storyData = [
//   {
//     imageSrc: "/story/a1.jpg",
//     avatarSrc: "/avatar/5.png",
//     founderName: "Darrell Steward",
//     brand: "Nsd Pvt.Ltd",
//     revenue: "15,000",
//     description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis fugit ipsum praesentium. Laboriosam odit accusantium fugit eveniet adipisci cumque iure nesciunt, consequuntur earum nihil vero quibusdam numquam rem rerum et, laborum, voluptatem tempora molestias harum? Voluptatibus sunt quisquam porro fugiat.",
//     courseName: "Baking",
//     courseLink: "/success/inside",
//   },
//   {
//     imageSrc: "/story/a2.jpg",
//     avatarSrc: "/avatar/6.png",
//     founderName: "Darrell Steward",
//     brand: "Nsd Pvt.Ltd",
//     revenue: "15,000",
//     description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis fugit ipsum praesentium. Laboriosam odit accusantium fugit eveniet adipisci cumque iure nesciunt, consequuntur earum nihil vero quibusdam numquam rem rerum et, laborum, voluptatem tempora molestias harum? Voluptatibus sunt quisquam porro fugiat.",
//     courseName: "Baking",
//     courseLink: "/success/inside",
//   },
//   {
//     imageSrc: "/story/a3.jpg",
//     avatarSrc: "/avatar/7.png",
//     founderName: "Darrell Steward",
//     brand: "Nsd Pvt.Ltd",
//     revenue: "15,000",
//     description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis fugit ipsum praesentium. Laboriosam odit accusantium fugit eveniet adipisci cumque iure nesciunt, consequuntur earum nihil vero quibusdam numquam rem rerum et, laborum, voluptatem tempora molestias harum? Voluptatibus sunt quisquam porro fugiat.",
//     courseName: "Baking",
//     courseLink: "/success/inside",
//   },
//   {
//     imageSrc: "/story/a1.jpg",
//     avatarSrc: "/avatar/5.png",
//     founderName: "Darrell Steward",
//     brand: "Nsd Pvt.Ltd",
//     revenue: "15,000",
//     description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis fugit ipsum praesentium. Laboriosam odit accusantium fugit eveniet adipisci cumque iure nesciunt, consequuntur earum nihil vero quibusdam numquam rem rerum et, laborum, voluptatem tempora molestias harum? Voluptatibus sunt quisquam porro fugiat.",
//     courseName: "Baking",
//     courseLink: "/success/inside",
//   },
// ];

const StorySuccess = () => {
  const [successStory, setSuccessStory] = useState<SuccessStory[]>([]);

  const { data: response } = useQuery({
    queryKey: ["SuccessStory"],
    queryFn: async () => {
      try {
        const response = await axiosHomePublic.get<{ data: SuccessStory[] }>("/success");
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
    if (response?.data) {
      setSuccessStory(response.data);
    }
  }, [response]);

  return (
    <section className="relative lg:pb-24 pb-12">
      <Image
        src="/bg/ptrn/3.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8 text-center">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-medium text-secondary">
            True{" "}<span className="inline-block font-bold text-primary">Success,</span>{" "}True{" "}<span className="inline-block font-bold text-primary">Stories</span>
          </h2>
        </div>

        {/* Story Cards */}
        {successStory.length > 0 && (
          <Swiper
            loop={true}
            spaceBetween={32}
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
          {successStory.map((story, index) => (
            <SwiperSlide key={index}>
              <StoryCard key={index} {...story} />
            </SwiperSlide>
          ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default StorySuccess;
