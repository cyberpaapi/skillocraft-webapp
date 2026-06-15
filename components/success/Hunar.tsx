"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { IoCaretForwardCircleOutline, IoCaretBackCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { axiosPublic } from "@/services/axiosService";

const Slides = [
  "/map-1.png",
  "/map-1.png",
  "/map-1.png",
];

const DEFAULT_TITLE = "Desh Bhar Mein Hunar";
const DEFAULT_SUBTITLE = "With our support, 50,000+ Indian's are learning and earning.";

const HunarSuccess = () => {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);

  useEffect(() => {
    axiosPublic.get("/site-settings?keys=success_hunar_title,success_hunar_subtitle")
      .then((res) => {
        const d = res.data?.data || {};
        if (d.success_hunar_title) setTitle(d.success_hunar_title);
        if (d.success_hunar_subtitle) setSubtitle(d.success_hunar_subtitle);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative md:py-24 py-12">
      <Image
        src="/bg/ptrn/2.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        <div className="md:space-y-4 space-y-2 text-center max-w-4xl mx-auto mb:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-medium text-secondary">
            {title.includes("Hunar") ? (
              <>
                {title.split("Hunar")[0]}
                <span className="inline-block font-bold text-primary">Hunar</span>
                {title.split("Hunar")[1]}
              </>
            ) : (
              <span className="inline-block font-bold text-primary">{title}</span>
            )}
          </h2>
          <p className="md:text-lg text-sm font-light">{subtitle}</p>
        </div>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Autoplay, Navigation]}
          speed={3000}
        >
          {Slides.map((image, index) => (
            <SwiperSlide className="text-center" key={index}>
              <Image
                src={image}
                alt={`Hero Slider ${index + 1}`}
                width={500}
                height={500}
                className="inline-block w-auto object-cover"
              />
            </SwiperSlide>
          ))}
          <div className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-primary cursor-pointer after:hidden md:size-8 size-6">
            <IoCaretForwardCircleOutline />
          </div>
          <div className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-primary cursor-pointer after:hidden md:size-8 size-6">
            <IoCaretBackCircleOutline />
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default HunarSuccess;
