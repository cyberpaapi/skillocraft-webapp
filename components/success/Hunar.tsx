"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { IoCaretForwardCircleOutline, IoCaretBackCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { axiosPublic } from "@/services/axiosService";
import { imgSrc } from "@/lib/imgSrc";

const DEFAULT_TITLE = "Desh Bhar Mein Hunar";
const DEFAULT_SUBTITLE = "With our support, 50,000+ Indian's are learning and earning.";
const FALLBACK_SLIDES = ["/map-1.png"];

const HunarSuccess = () => {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);
  const [slides, setSlides] = useState<string[]>(FALLBACK_SLIDES);

  useEffect(() => {
    axiosPublic.get("/site-settings?keys=success_hunar_title,success_hunar_subtitle,success_hunar_images")
      .then((res) => {
        const d = res.data?.data || {};
        if (d.success_hunar_title) setTitle(d.success_hunar_title);
        if (d.success_hunar_subtitle) setSubtitle(d.success_hunar_subtitle);
        if (d.success_hunar_images) {
          try {
            const parsed = JSON.parse(d.success_hunar_images);
            if (Array.isArray(parsed) && parsed.length > 0) setSlides(parsed);
          } catch {}
        }
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
          loop={slides.length > 1}
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
          {slides.map((image, index) => {
            const src = image.startsWith("/r2/") || image.startsWith("http") ? imgSrc(image) : image;
            return (
              <SwiperSlide className="text-center" key={index}>
                <Image
                  src={src}
                  alt={`Hunar ${index + 1}`}
                  width={900}
                  height={500}
                  unoptimized
                  className="inline-block w-full max-w-3xl mx-auto h-auto object-cover rounded-2xl"
                />
              </SwiperSlide>
            );
          })}
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
