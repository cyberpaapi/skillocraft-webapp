'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const slides = [
  { title: 'Slide 1', image: '/awards/a1.jpg' },
  { title: 'Slide 2', image: '/awards/a2.jpg' },
  { title: 'Slide 3', image: '/awards/a3.jpg' },
  { title: 'Slide 4', image: '/awards/a1.jpg' },
  { title: 'Slide 5', image: '/awards/a2.jpg' },
  { title: 'Slide 6', image: '/awards/a3.jpg' },
];

export default function CoverflowSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouseOverRef = useRef(false);

  const [keenRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1.2,
      spacing: 16,
      origin: 'center',
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 1.8, spacing: 20 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 24 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    renderMode: 'performance',
    drag: true,
    mode: 'free-snap',
  });

  const clearNextTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const nextTimeout = useCallback(() => {
    clearNextTimeout();
    timeoutRef.current = setTimeout(() => {
      if (!mouseOverRef.current && instanceRef.current) {
        instanceRef.current.next();
      }
      nextTimeout();
    }, 3000);
  }, [instanceRef]);

  useEffect(() => {
    nextTimeout();
    return clearNextTimeout;
  }, [nextTimeout]);

  return (
    <div
      onMouseEnter={() => {
        mouseOverRef.current = true;
        clearNextTimeout();
      }}
      onMouseLeave={() => {
        mouseOverRef.current = false;
        nextTimeout();
      }}
      className="w-full max-w-7xl mx-auto px-4 py-16"
    >
      <div ref={keenRef} className="keen-slider relative h-[300px] sm:h-[350px] md:h-[400px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          const baseClasses =
            'transition-all duration-500 ease-in-out transform overflow-hidden shadow-xl rounded-2xl bg-white';
          const activeClasses = 'scale-100';
          const inactiveClasses = 'scale-90 opacity-80';

          return (
            <div
              key={index}
              className="keen-slider__slide flex justify-center items-center h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full px-2"
            >
              <div
                className={`${baseClasses} ${
                  isActive ? activeClasses : inactiveClasses
                } w-full h-full`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
