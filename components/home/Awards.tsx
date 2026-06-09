"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FC } from "react";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { FeaturedBand, FeatureGallery } from "@/types";

// const slides = [
//   "/awards/a1.jpg",
//   "/awards/a2.jpg",
//   "/awards/a3.jpg",
//   "/awards/a1.jpg",
//   "/awards/a2.jpg",
//   "/awards/a3.jpg",
// ];

// const brands = [
//   "/brands/1.png",
//   "/brands/2.png",
//   "/brands/3.png",
//   "/brands/4.png",
//   "/brands/5.png",
//   "/brands/6.png",
//   "/brands/7.png",
//   "/brands/8.png",
//   "/brands/9.png",
// ];

const AwardsHome:FC = () => {
  const [centerIndex, setCenterIndex] = React.useState<number>(0);
  const [brands, setBrands] = useState<FeaturedBand[]>([]);
  const [gallery, setGallery] = useState<FeatureGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosHomePublic.get('/feature-brands');
        if (response.data.status === 1) {
          setBrands(response.data.data);
        } else {
          setError('Failed to load brands');
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Error loading brands. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchGallery = async () => {
      try {
        const response = await axiosHomePublic.get('/feature-gallery');
        if (response.data.status === 1) {
          setGallery(response.data.data);
        } else {
          setError('Failed to load gallery');
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError('Error loading gallery. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
    fetchGallery();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <section className="relative lg:pb-24 pb-12">
      <Image
        src="/bg/ptrn/6.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-semibold text-secondary">
            Awards &{" "}<span className="inline-block text-primary">Achievement</span>
          </h2>
        </div>

        {/* Image Carousel */}
        <div className="max-w-3xl mx-auto space-y-5">
          {/* <CoverflowSlider /> */}
          <Swiper
            spaceBetween={0}
            slidesPerView={3}
            centeredSlides={true}
            loop={true}
            speed={500}
            onSlideChange={(swiper) => setCenterIndex(swiper.activeIndex)}
            breakpoints={{
              1024: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 2,
              },
              480: {
                slidesPerView: 1,
              },
            }}
          >
            {gallery.map((item, index) => {
              const imageUrl = item.imageLink?.startsWith('http') 
                ? item.imageLink 
                : item.imageLink 
                  ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${item.imageLink}`
                  : '';
                
              return (
                <SwiperSlide key={item.id || index}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.description || `Gallery item ${index + 1}`}
                      width={500}
                      height={500}
                      className={`w-full h-auto object-cover md:rounded-3xl rounded-2xl transition-all duration-500 ${
                        index === centerIndex ? "scale-100 z-10" : "scale-90 z-0"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Brands Logo */}
          <div className="flex items-center flex-wrap md:gap-6 gap-4">
            <span className="inline-block px-3 py-1 bg-primary text-white md:text-sm text-xs font-semibold rounded-2xl">
              Featured on
            </span>
            <div className="flex flex-wrap md:gap-3 gap-1">
              {brands.map((brand) => {
                const logoUrl = brand.logo?.startsWith('http')
                  ? brand.logo
                  : brand.logo
                    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${brand.logo}`
                    : '';
                  
                return logoUrl ? (
                  <div key={brand.id} className="md:size-12 size-8 relative">
                    <img
                      src={logoUrl}
                      alt={brand.title || 'Brand logo'}
                      className="w-full h-full shadow-lg rounded-full border border-gray-100 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full rounded-full bg-gray-200 flex items-center justify-center';
                        fallback.innerHTML = '<span class="text-xs text-gray-500">Logo</span>';
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  </div>
                ) : (
                  <div key={brand.id} className="md:size-12 size-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No logo</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsHome;
