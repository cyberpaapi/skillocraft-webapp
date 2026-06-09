'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";
import { imgSrc } from "@/lib/imgSrc";

interface CategoryCardProps extends Category {
  overlayColorClass: string;
  titleColorClass: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  imageUrl,
  name,
  overlayColorClass,
  titleColorClass
}) => {
  // Ensure the component is mounted to prevent hydration mismatch
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const content = (
    <>
      <div className="relative h-full w-full">
        <Image
          src={imgSrc(imageUrl, '/courses_1.png')}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority={false}
        />
      </div>
      <div className={`absolute inset-0 ${overlayColorClass} flex items-center justify-center`}>
        <h3 className={`text-xl font-semibold ${titleColorClass} group-hover:underline`}>
          {name}
        </h3>
      </div>
    </>
  );

  if (!isMounted) {
    // Return a placeholder with the same dimensions during SSR
    return (
      <div className="relative h-40 w-full overflow-hidden rounded-xl bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  // If clickable, wrap with Link
  return (
    <Link 
      href="/courses"
      className="relative h-40 w-full overflow-hidden rounded-2xl group block"
      prefetch={false}
    >
      {content}
    </Link>
  );
};

export default CategoryCard;
