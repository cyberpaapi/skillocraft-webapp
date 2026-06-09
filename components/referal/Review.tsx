"use client";

import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import ReviewCardTwo from "../common/card/ReviewTwo";

export const reviews = [
  {
    imageSrc: "/avatar/1.png",
    rating: 4.5,
    name: "Floyd Miles",
    description:
      "Skillocraft helped me rediscover my passion for teaching and gave me the tools to grow my brand.",
  },
  {
    imageSrc: "/avatar/2.png",
    rating: 4.5,
    name: "Ronald Richards",
    description:
      "From a beginner to a confident entrepreneur, Skillocraft made it possible.",
  },
  {
    imageSrc: "/avatar/3.png",
    rating: 4.5,
    name: "Savannah Nguyen",
    description:
      "I now teach online and generate income from home thanks to their support and platform.",
  },
  {
    imageSrc: "/avatar/4.png",
    rating: 4.5,
    name: "Floyd Miles",
    description:
      "Easy to use, well-structured courses, and supportive mentors!",
  },
  {
    imageSrc: "/avatar/5.png",
    rating: 5,
    name: "Ronald Richards",
    description:
      "Game-changer for anyone wanting to monetize their skills.",
  },
];

const ReviewReferral = () => {
  return (
    <section className="relative lg:py-24 py-12">
      <div className="container mx-auto">
        {/* Section Title + Navigation */}
        <div className="md:mb-12 mb-8 relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium">TESTIMONIAL</span>
              <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-bold text-secondary">
                What They Say?
              </h2>
            </div>
            <div className="flex items-center gap-3 absolute right-0 top-1/2 transform -translate-y-1/2">
              <div className="swiper-button-prev relative inline-flex flex-shrink-0 items-center justify-center size-8 bg-white border border-gray-400 rounded-full left-0 top-0 after:hidden">
                <FaAngleLeft className="text-base !h-auto !w-auto !text-secondary" />
              </div>
              <div className="swiper-button-next relative inline-flex flex-shrink-0 items-center justify-center size-8 bg-white border border-gray-400 rounded-full left-0 top-0 after:hidden">
                <FaAngleRight className="text-base !h-auto !w-auto !text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Autoplay]}
          loop={true}
          spaceBetween={16}
          slidesPerView={3}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={1000}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <ReviewCardTwo {...review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ReviewReferral;
