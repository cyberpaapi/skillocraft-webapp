import React from "react";
import Image from "next/image";
import { ReviewCardProps } from "@/types";

const ReviewCardTwo: React.FC<ReviewCardProps> = ({
  imageSrc,
  rating,
  name,
  description,
}) => {
  return (
    <div className="relative bg-white border border-gray-200 space-y-4 px-8 py-6 md:rounded-2xl rounded-xl">
      <div className="flex justify-between items-center gap-4">
        <Image
          src={imageSrc}
          alt="Avatar"
          width={500}
          height={500}
          className="size-12 object-cover rounded-full"
        />

        <div className="space-x-1 text-primary">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              fill={i < Math.floor(rating) ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="size-4 inline"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h6 className="md:text-ld text-base font-semibold text-secondary">
          {name}
        </h6>
        <p className="text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ReviewCardTwo;
