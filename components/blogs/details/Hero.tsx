"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { axiosPublic } from '@/services/axiosService';
import { Banner } from '@/types';

const HeroBlogInside = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data } = await axiosPublic.get('/banners');
        if (data.status === 1) {
          // Find first banner where bannerLocation is "BLOG_DETAIL"
          const blogDetailBanner = data.data.find(
            (banner: Banner) => 
              banner.bannerLocation === 'BLOG_DETAILS' && banner.status === 'ACTIVE'
          );
          if (blogDetailBanner) {
            console.log("blog data is", blogDetailBanner.imageLink)
            setBanner(blogDetailBanner);
          }
        }
      } catch (error) {
        console.error('Error fetching blog detail banner:', error);
      } 
      finally {
        setIsLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (isLoading) {
    return (
      <section className="relative h-[200px] md:h-[350px] lg:h-[475px] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  // Show placeholder if no banner or image URL
  if (!banner) {
    return (
      <section className="relative h-[200px] md:h-[350px] lg:h-[475px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No banner available</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[200px] md:h-[350px] lg:h-[475px] overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          src={banner.imageLink.startsWith('http') ? banner.imageLink : `${process.env.NEXT_PUBLIC_API_URL}${banner.imageLink}`}
          alt={banner.name || "Blog Detail Banner"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover"
          priority
          onError={(e) => {
            console.error('Error loading image:', e);
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder-blog.jpg';
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
    </section>
  );
};

export default HeroBlogInside;
