"use client";

import * as React from "react";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { axiosPublic } from '@/services/axiosService';
import { Banner } from '@/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const HeroBlog = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchBanners = async () => {
      try {
        const { data } = await axiosPublic.get('/banners');
        if (data.status === 1) {
          // Filter banners where bannerLocation is "BLOG"
          const blogBanners = data.data.filter(
            (banner: Banner) => 
              banner.bannerLocation === 'BLOG' && banner.status === 'ACTIVE'
          );
          setBanners(blogBanners);
        }
      } catch (error) {
        console.error('Error fetching blog banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
    
    return () => {
      setMounted(false);
    };
  }, []);

  if (isLoading) {
    return (
      <section className="relative h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100 flex items-center justify-center overflow-hidden">
        <Image
          src="/bg/ptrn/1.svg"
          width={500}
          height={500}
          alt=""
          className="absolute -bottom-10 left-0 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
        />
        <Image
          src="/hero/blog.jpg"
          alt="Blog Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <Image
        src="/bg/ptrn/1.svg"
        width={500}
        height={500}
        alt=""
        className="absolute -bottom-10 left-0 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      {mounted && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={banners.length > 1}
          className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-full">
                <Image
                  src={banner.imageLink.startsWith('http') ? banner.imageLink : `${process.env.NEXT_PUBLIC_API_URL}${banner.imageLink}`}
                  alt={banner.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                      {banner.name}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl mb-8">
                      {banner.description}
                    </p>
                  </div>
                </div> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default HeroBlog;
