'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/types";
import { BsCollectionPlay } from "react-icons/bs";
import { imgSrc } from "@/lib/imgSrc";

const CourseCard: React.FC<Course> = ({
  id,
  name,
  shortDescription,
  imageLink,
  price,
  discountedPrice,
  productCount

}) => {
  const hasDiscount = discountedPrice != null && parseFloat(String(discountedPrice)) > 0 && parseFloat(String(discountedPrice)) < Number(price);
  // Calculate star ratings
  // const fullStars = Math.floor(rating);
  // const hasHalfStar = rating % 1 >= 0.5;
  // const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={imgSrc(imageLink, '/courses_1.png')}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary transition-colors">
          <Link href={`/courses/${id}`} className="block">
            {name}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{shortDescription}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <div className="flex text-primary mr-1">
              {/* {[...Array(fullStars)].map((_, i) => (
                <FaStar key={`full-${5}`} className="w-4 h-4" />
              ))}
              {hasHalfStar && <FaStar className="w-4 h-4 text-yellow-400" />}
              {[...Array(emptyStars)].map((_, i) => (
                <FaRegStar key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />
              ))} */}
              <BsCollectionPlay/>
              <span className="text-xs text-gray-500 ml-1">({productCount})</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-lg font-bold text-primary">₹{hasDiscount ? discountedPrice : price}</span>
          {hasDiscount && (
            <span className="ml-2 text-sm font-normal text-gray-400 line-through">₹{price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
