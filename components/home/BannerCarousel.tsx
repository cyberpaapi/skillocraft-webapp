'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { axiosHomePublic } from '@/services/axiosHomeService';
import { imgSrc } from '@/lib/imgSrc';

interface Banner {
  id: string;
  name: string;
  description?: string;
  imageLink: string;
}

const FALLBACK_BANNERS: Banner[] = [
  { id: 'f1', name: 'Start Your Own Perfume Brand', description: 'Professional Perfume Making Course at just ₹699/-', imageLink: '/events_1.png' },
  { id: 'f2', name: 'Master the Art of Baking', description: 'Learn from award-winning pastry chefs. Enroll today!', imageLink: '/events_2.png' },
  { id: 'f3', name: 'Skillocraft Live Events', description: 'Join hands-on workshops near you', imageLink: '/events_3.png' },
  { id: 'f4', name: 'Handmade Jewellery Courses', description: 'Turn your passion into a profitable skill', imageLink: '/events_4.png' },
  { id: 'f5', name: 'Professional Makeup Masterclass', description: 'Industry-certified courses by top experts', imageLink: '/events_5.png' },
];

function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => setCount(window.innerWidth < 768 ? 1 : 3);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return count;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const visibleCount = useVisibleCount();
  const containerRef = useRef<HTMLDivElement>(null);

  const isValidImage = (link: string) =>
    !!link && !link.includes('undefined') && link.length > 1;

  useEffect(() => {
    axiosHomePublic
      .get('/banners?location=HOME&status=ACTIVE')
      .then(({ data }) => {
        const all: Banner[] = data?.data || [];
        const valid = all.map(b =>
          isValidImage(b.imageLink) ? b : { ...b, imageLink: '' }
        );
        setBanners(valid.length > 0 ? valid : FALLBACK_BANNERS);
      })
      .catch(() => setBanners(FALLBACK_BANNERS))
      .finally(() => setLoaded(true));
  }, []);

  const maxCurrent = Math.max(0, banners.length - visibleCount);

  // Clamp current index when visibleCount changes (e.g. rotate phone)
  useEffect(() => {
    setCurrent(c => Math.min(c, maxCurrent));
  }, [maxCurrent]);

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(
    () => setCurrent(c => (c >= maxCurrent ? 0 : c + 1)),
    [maxCurrent]
  );

  useEffect(() => {
    if (banners.length <= visibleCount) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [banners.length, visibleCount, next]);

  if (!loaded || banners.length === 0) return null;

  // translateX% is relative to the track width (= banners.length * cardWidth).
  // One step = 1 card = 100/banners.length % of the track — independent of visibleCount.
  const translatePct = current * (100 / banners.length);

  return (
    <section className="w-full bg-gray-50 py-4">
      <div ref={containerRef} className="relative overflow-hidden w-full">

        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${translatePct}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="flex-none px-1.5"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <div className="relative aspect-[16/7] rounded-xl overflow-hidden shadow-md group/card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc(banner.imageLink, '/events_1.png')}
                  alt={banner.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/events_1.png'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 text-white">
                  <p className="font-bold text-base sm:text-lg leading-snug line-clamp-2 drop-shadow">
                    {banner.name}
                  </p>
                  {banner.description && (
                    <p className="text-xs text-white/75 mt-1 line-clamp-1 drop-shadow">
                      {banner.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows — hidden on mobile since a swipe-like dot nav is cleaner */}
        {banners.length > visibleCount && (
          <>
            <button
              onClick={prev}
              disabled={current === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 disabled:opacity-30 hover:bg-white transition-all"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </button>
            <button
              onClick={next}
              disabled={current >= maxCurrent}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 disabled:opacity-30 hover:bg-white transition-all"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Dots — always shown when there are multiple slides */}
      {banners.length > visibleCount && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: maxCurrent + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current ? 'w-5 h-2 bg-primary' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
