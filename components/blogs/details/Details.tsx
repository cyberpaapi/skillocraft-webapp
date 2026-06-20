"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogDetailsResponseData } from "@/types";
// import { Skeleton } from "@/components/ui/skeleton";

// Format an ISO timestamp as "HH:MM ,DD-MM-YY"
const formatBlogDate = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())} ,${p(d.getDate())}-${p(d.getMonth() + 1)}-${p(d.getFullYear() % 100)}`;
};


const BlogDetails = ({
  title,
  image,
  longDesription,
  category,
  author,
  createdAt
}: BlogDetailsResponseData) => {
  // if (isLoading) {
  //   return (
  //     <section className="relative">
  //       <div className="container mx-auto">
  //         <div className="max-w-4xl mx-auto space-y-6">
  //           <Skeleton className="h-8 w-48 mx-auto" />
  //           <div className="space-y-4">
  //             <Skeleton className="h-8 w-32" />
  //             <Skeleton className="h-12 w-full" />
  //           </div>
  //           <div className="flex items-center gap-4">
  //             <Skeleton className="h-12 w-12 rounded-full" />
  //             <Skeleton className="h-4 w-32" />
  //           </div>
  //           <div className="space-y-4 pt-8">
  //             <Skeleton className="h-4 w-24" />
  //             <Skeleton className="h-64 w-full rounded-lg" />
  //             <div className="space-y-2">
  //               <Skeleton className="h-4 w-full" />
  //               <Skeleton className="h-4 w-full" />
  //               <Skeleton className="h-4 w-3/4" />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }
  return (
    <section className="relative">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="max-w-4xl mx-auto md:space-y-6 space-y-4 md:mb-12 mb-8">
          <h2 className="text-center xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-medium text-secondary">
            Latest{" "}
            <span className="inline-block text-primary font-bold">Blogs</span>
          </h2>

          <div>
            <span className="text-sm font-semibold text-red-500">
              {/* Online Business */}
              {category.name}
            </span>
            <h3 className="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-semibold text-black">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Image
              src={author.imageLink.startsWith('http') ? author.imageLink : `${process.env.NEXT_PUBLIC_API_URL}${author.imageLink}`}
              alt="Avatar"
              width={500}
              height={500}
              className="size-6 object-cover rounded-full"
            />
            <div className="md:text-base text-sm text-black">
              <Link href="#">By {author.name}</Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-4 md:px-8 px-0">
          <div className="text-sm text-gray-500">{formatBlogDate(createdAt)}</div>

          {/* Image Sec */}
            <Image
              src={image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_URL}${image}`}
            alt="About Us"
            width={500}
            height={500}
            className="w-full max-w-2xl object-cover rounded-xl"
          />

          <div className="text-sm/6 space-y-4">
            <p>
              {longDesription}
            </p>
            {/* <p>
              Ut ornare elementum mi pellentesque porttitor nunc viverra. Gravida vel volutpat risus auctor eu dignissim quis ultricies. Tincidunt ridiculus nec nunc nec enim condimentum ipsum mauris leo. Scelerisque ut nibh vel facilisis suspendisse nunc lorem eu diam. Bibendum eget pharetra proin vulputate. Felis sed lorem vulputate eu lorem. Interdum et at venenatis mus amet bibendum. Dictum integer vestibulum sagittis est auctor nullam vitae. Metus sociis bibendum diam interdum molestie et faucibus fusce quis.
            </p>
            <p>
              At eget rhoncus gravida magna amet ut nisi. In volutpat mauris tristique mattis libero commodo sem. Et nisi aliquam sociis est aliquet. Vitae amet id nunc purus. Erat massa ornare aliquam porta nibh libero. Lacus mattis consectetur vel lacus consectetur. Tristique sed posuere ultrices ipsum nunc quis cursus id. Velit cras id pellentesque amet nullam aliquet volutpat vitae. A quis consequat a volutpat. Imperdiet pharetra elementum sed commodo.
            </p>
            <p>
              In lacus quis tellus purus adipiscing eleifend sollicitudin congue scelerisque. Tempor curabitur in laoreet imperdiet magna viverra erat massa et. Facilisi integer vitae massa vitae rhoncus platea condimentum integer. Non tristique risus sem nam ante sapien. Placerat praesent volutpat in tortor sit enim luctus consectetur. Nulla elementum mi feugiat purus facilisis. Scelerisque libero duis cras id a faucibus et lorem pharetra. Mus eu duis nunc nec est bibendum urna quam. Risus quis a sed massa faucibus imperdiet vulputate aliquam morbi. Est fermentum pulvinar lobortis ut. Quis aenean dui et pellentesque laoreet sagittis ante egestas. Id quis pretium dictumst blandit viverra vel sit ut. Dolor interdum aliquet et porta nulla sed commodo amet. Nec a quis orci eget.
            </p>
            <p>
              Ut nulla nunc eu nisi habitasse. Sit nulla nunc.
            </p> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
