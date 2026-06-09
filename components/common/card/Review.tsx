import React from "react";
import Image from "next/image";
import { IoPlayOutline } from "react-icons/io5";
import { Testimonial } from "@/types";


const TestimonialCard: React.FC<Testimonial> = ({
  imageLink,
  ratting,
  description,
}) => {
  return (
    <div className="relative bg-white hover:bg-primary/90 shadow-xl space-y-4 px-8 py-6 md:rounded-3xl rounded-2xl group transition ease-in-out delay-150 duration-300">
      <IoPlayOutline className="size-6 stroke-2 absolute top-4 right-4 text-primary group-hover:text-white transition ease-in-out delay-150 duration-300" />
      <div className="md:size-28 size-16 rounded-full overflow-hidden mx-auto border-4 border-primary group-hover:border-white transition ease-in-out delay-150 duration-300">
        <Image
          src={`${imageLink}`}
          alt="Avatar"
          width={500}
          height={500}
          className="size-full object-cover rounded-full border-4 border-white group-hover:border-primary transition ease-in-out delay-150 duration-300"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-1 text-primary group-hover:text-white transition ease-in-out delay-150 duration-300">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              fill={i < Number(ratting) ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="size-4"
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
        <p className="text-sm text-primary group-hover:text-white transition ease-in-out delay-150 duration-300">{description}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
