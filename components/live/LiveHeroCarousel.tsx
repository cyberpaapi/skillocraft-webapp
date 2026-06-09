'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { axiosHomePublic } from '@/services/axiosHomeService';

interface Banner {
  id: string;
  name: string;
  description?: string;
  imageLink: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Fallback slide shown when no banners are configured in admin
const FALLBACK: Banner = {
  id: 'fallback',
  name: 'Learn & Grow with Skillocraft Live',
  description: "Attend live events, workshops and masterclasses from India's top creators.",
  imageLink: '/events_5.png',
};

export default function LiveHeroCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    axiosHomePublic
      .get('/banners?location=LIVE&status=ACTIVE')
      .then(({ data }) => {
        const list: Banner[] = data?.data || [];
        setBanners(list.length > 0 ? list : [FALLBACK]);
      })
      .catch(() => setBanners([FALLBACK]))
      .finally(() => setReady(true));
  }, []);

  const prev = useCallback(() => setCurrent(c => (c === 0 ? banners.length - 1 : c - 1)), [banners.length]);
  const next = useCallback(() => setCurrent(c => (c === banners.length - 1 ? 0 : c + 1)), [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [banners.length, next]);

  if (!ready) {
    // skeleton while loading
    return (
      <div className="w-full h-[400px] sm:h-[520px] md:h-[600px] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 animate-pulse" />
    );
  }

  const getImageSrc = (link: string) => {
    if (!link) return '/events_5.png';
    if (link.startsWith('http')) return link;
    if (link.startsWith('/uploads')) return `${API_BASE}${link}`;
    return link; // already a local public path like /events_5.png
  };

  return (
    <section className="relative w-full h-[400px] sm:h-[520px] md:h-[600px] overflow-hidden group">
      {/* Slides */}
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <Image
            src={getImageSrc(banner.imageLink)}
            alt={banner.name}
            fill
            className="object-cover"
            priority={i === 0}
          />
          {/* Gradient overlay — amber-tinted for brand consistency */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/70 via-orange-400/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Text content — always visible on top of carousel */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-xs font-semibold uppercase tracking-wide mb-4">
              #1 Skill-Tech Platform in India
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Learn & Grow with<br />
              <span className="text-amber-300">Skillocraft Live</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base mb-7 max-w-md drop-shadow">
              Attend live events, workshops and masterclasses from India's top creators.
            </p>
            <Link
              href="/courses"
              className="inline-block bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg"
            >
              Start Learning Now
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? 'w-7 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
