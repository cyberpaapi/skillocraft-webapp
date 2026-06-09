import Image from "next/image";
//import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FC, useState } from "react";
import { SuccessStory } from "@/types";

const StoryCard: FC<SuccessStory> = ({
  name,
  description,
  imageLink,
  brand,
  earning,
  coverPhoto
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="md:rounded-3xl rounded-2xl group md:p-8 p-6 bg-background shadow-xl">
      <Image
        src={`${coverPhoto}`}
        alt="Story Image"
        width={500}
        height={500}
        className="w-full h-auto object-cover md:rounded-2xl rounded-xl"
      />
      <div className="flex items-center gap-2 mt-4 mb-2">
        <Image
          src={`${imageLink}`}
          alt="Avatar"
          width={500}
          height={500}
          className="size-12 object-cover rounded-full"
        />
        <div>
          <span className="block text-xs text-primary">Founded By</span>
          <p className="text-sm text-black font-semibold flex items-center gap-1">
            {name} <RiVerifiedBadgeFill className="text-red-500 size-4" />
          </p>
        </div>
      </div>
      <Button className="text-sm py-1 px-8 capitalize rounded-full" variant="default" asChild>
        {name}
      </Button>
      <p className="text-xs text-black mt-5">
        Brand: {brand} 
      </p>
      <p className="text-xs text-black">
        Earning: {earning} / month
      </p>

      {/* Description with toggle */}
      <p
        className={`text-sm text-primary my-2 transition-all duration-300 ${
          isExpanded ? "" : "line-clamp-2"
        }`}
      >
        {description}
      </p>

      {/* Read More / Show Less toggle button */}
      <p
        className="text-sm font-semibold text-red-500 cursor-pointer"
        onClick={toggleDescription}
      >
        {isExpanded ? "Show Less" : "Read More..."}
      </p>
    </div>
  );
};

export default StoryCard;
