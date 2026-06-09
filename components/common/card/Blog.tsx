import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogListResponseData } from "@/types";
import { imgSrc } from "@/lib/imgSrc";

const BlogCard: React.FC<BlogListResponseData> = ({
  id,
  image,
  title,
  shortDescription,
  category
}) => {
  return (
    <Link href={`/blogs/${id}`} className="md:rounded-3xl rounded-2xl group p-6 bg-background shadow-xl block hover:shadow-2xl transition-shadow">
      <div className="relative w-full aspect-[16/9] md:rounded-2xl rounded-xl overflow-hidden">
        <Image
          src={imgSrc(image, '/blogs/a1.jpg')}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="text-xs font-semibold text-red-500 mt-3 mb-1">{category?.name}</div>
      <h3 className="text-sm font-semibold text-secondary group-hover:text-primary mb-1 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2">{shortDescription}</p>
    </Link>
  );
};

export default BlogCard;
