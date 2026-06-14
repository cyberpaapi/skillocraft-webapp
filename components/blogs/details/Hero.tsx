"use client";

import Image from 'next/image';

interface HeroBlogInsideProps {
  image?: string;
  title?: string;
}

const HeroBlogInside = ({ image, title }: HeroBlogInsideProps) => {
  if (!image) {
    return (
      <section className="relative h-[200px] md:h-[350px] lg:h-[475px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white/60 text-lg font-medium">Blog</p>
      </section>
    );
  }

  const src = image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_URL}${image}`;

  return (
    <section className="relative w-full h-[200px] md:h-[350px] lg:h-[475px] overflow-hidden">
      <Image
        src={src}
        alt={title || 'Blog'}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {title && (
        <div className="absolute bottom-8 left-0 right-0 px-6 md:px-12">
          <h1 className="text-white text-xl md:text-3xl lg:text-4xl font-bold max-w-4xl mx-auto drop-shadow-lg line-clamp-2">
            {title}
          </h1>
        </div>
      )}
    </section>
  );
};

export default HeroBlogInside;
