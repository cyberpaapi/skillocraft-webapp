'use client';

import React from "react";
import Image from "next/image";
import { Creator } from "@/types";
import { imgSrc } from "@/lib/imgSrc";



const CreatorCard: React.FC<Creator> = ({
  imageLink,
  name,
  designation,
  description,
}) => {
  return (
    <div className="space-y-4 text-center">
      <Image
        src={imgSrc(imageLink, '/creators/placeholder.jpg')}
        alt={name}
        width={500}
        height={500}
        className="w-full object-cover"
      />

      {/* Details */}
      <div className="space-y-1">
        <h5 className="lg:text-lg text-base font-semibold text-gray-800 uppercase">{name}</h5>
        <p className="text-xs uppercase">{designation}</p>
      </div>

      {/* Description */}
      <p className="text-xs">{description}</p>
    </div>
  );
};

export default CreatorCard;
