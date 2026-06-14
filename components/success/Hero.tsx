"use client";

import * as React from "react";
import Image from "next/image";
import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { axiosPublic } from "@/services/axiosService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const HeroSuccess = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [banners, setBanners] = React.useState<any[]>([]);
  const [bannersLoaded, setBannersLoaded] = React.useState(false);

  React.useEffect(() => {
    axiosPublic.get("/banners").then((res) => {
      if (res.data?.status === 1) {
        const filtered = (res.data.data || []).filter(
          (b: any) => b.bannerLocation === "SUCCESS_STORY" && b.status === "ACTIVE"
        );
        setBanners(filtered);
      }
    }).catch(() => {}).finally(() => setBannersLoaded(true));
  }, []);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const getBannerSrc = (link: string) =>
    link.startsWith("http") ? link : `${API_BASE}${link}`;

  if (!bannersLoaded) {
    return (
      <section className="relative lg:h-[475px] md:h-[350px] h-[200px] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </section>
    );
  }

  if (banners.length > 0) {
    return (
      <section className="relative lg:h-[475px] md:h-[350px] h-[200px] overflow-hidden">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-full lg:h-[475px] md:h-[350px] h-[200px]">
                <Image
                  src={getBannerSrc(banner.imageLink)}
                  alt={banner.name || "Success Story Banner"}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  }

  return (
    <section className="relative lg:h-[475px] md:h-[350px] h-[200px]">
      <Image
        src="/bg/ptrn/1.svg"
        width={500}
        height={500}
        alt=""
        className="absolute -bottom-10 left-0 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />
      <div className="absolute top-0 left-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="/hero/success.jpg"
          loop
          muted
        >
          <source src="/video/1.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 lg:text-6xl md:text-5xl text-4xl inline-flex items-center justify-center rounded-full cursor-pointer text-white"
        onClick={togglePlayback}
      >
        {isPlaying ? <FaRegCirclePause /> : <FaRegCirclePlay />}
      </div>
    </section>
  );
};

export default HeroSuccess;
