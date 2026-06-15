import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FC } from "react";
import { SuccessStory } from "@/types";
import { imgSrc } from "@/lib/imgSrc";

const StoryCard: FC<SuccessStory> = ({
  id,
  name,
  description,
  imageLink,
  brand,
  earning,
  coverPhoto
}) => {
  return (
    <Link href={`/success/${id}`} className="block md:rounded-3xl rounded-2xl group md:p-8 p-6 bg-background shadow-xl hover:shadow-2xl transition-shadow">
      <Image
        src={imgSrc(coverPhoto)}
        alt="Story Image"
        width={500}
        height={500}
        unoptimized
        className="w-full h-auto object-cover md:rounded-2xl rounded-xl"
      />
      <div className="flex items-center gap-2 mt-4 mb-2">
        <Image
          src={imgSrc(imageLink)}
          alt="Avatar"
          width={500}
          height={500}
          unoptimized
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
        <span>{name}</span>
      </Button>
      <p className="text-xs text-black mt-5">
        Brand: {brand}
      </p>
      <p className="text-xs text-black">
        Earning: {earning} / month
      </p>
      <p className="text-sm text-primary my-2 line-clamp-2">
        {description}
      </p>
      <p className="text-sm font-semibold text-red-500">Read More...</p>
    </Link>
  );
};

export default StoryCard;
