"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { imgSrc } from "@/lib/imgSrc";
import StoryCard from "@/components/common/card/Story";
import type { SuccessStory } from "@/types";

import "swiper/css";
import "swiper/css/pagination";

interface MPProduct {
  id: string;
  name: string;
  images?: string[];
  price: string;
  discount?: string;
  featured?: boolean;
}

export default function SuccessStoryExtras({ currentId }: { currentId: string }) {
  const [products, setProducts] = useState<MPProduct[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    axiosHomePublic
      .get("/marketplace-products?limit=100")
      .then(({ data }) => {
        const list: MPProduct[] = data?.data || data?.products || [];
        const featured = list.filter((p) => p.featured);
        setProducts((featured.length ? featured : list).slice(0, 12));
      })
      .catch(() => {});

    axiosHomePublic
      .get("/success")
      .then(({ data }) => {
        const list: SuccessStory[] = data?.data || [];
        setStories(list.filter((s) => s.id !== currentId));
      })
      .catch(() => {});
  }, [currentId]);

  return (
    <div className="container mx-auto px-4 mt-14 space-y-16 pb-16">
      {/* Featured marketplace products */}
      {products.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-5">
            Featured <span className="text-primary">Products</span>
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {products.map((p, i) => (
              <Link key={p.id} href={`/marketplace/${p.id}`} className="block flex-none w-36 sm:w-44 group">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                  <Image
                    src={imgSrc(p.images?.[0], `/courses_${(i % 6) + 1}.png`)}
                    alt={p.name}
                    fill
                    sizes="176px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.discount && parseInt(p.discount) > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {p.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="mt-2 px-0.5">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{p.name}</p>
                  <p className="text-xs text-primary font-bold mt-1">From ₹{parseFloat(p.price).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Want to be like them? CTA */}
      <section className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-secondary">Want to be like them?</h2>
        <Link
          href="/courses"
          className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Start Your Business now
        </Link>
      </section>

      {/* More success stories */}
      {stories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-6 text-center">
            More <span className="text-primary">Success Stories</span>
          </h2>
          <Swiper
            loop={stories.length > 1}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            speed={2000}
            pagination={{ clickable: true, dynamicBullets: true }}
            modules={[Pagination, Autoplay]}
            className="pb-10"
          >
            {stories.map((story) => (
              <SwiperSlide key={story.id} className="!h-auto">
                <StoryCard {...story} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
    </div>
  );
}
