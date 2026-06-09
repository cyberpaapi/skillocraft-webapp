"use client";

import * as React from "react";
import Image from "next/image";

const WriteSuccess = () => {
  return (
    <section className="relative lg:pb-24 pb-12">
      <Image
        src="/bg/ptrn/4.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8 text-center">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-medium text-secondary">
            Now Write your{" "}<span className="inline-block font-bold text-primary">SUCCESS STORY</span>
          </h2>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-12 items-center gap-4">
          <div className="lg:col-span-5 md:col-span-6 col-span-1">
            <Image
              src="/success-1.png"
              width={500}
              height={500}
              alt=""
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="lg:col-span-7 md:col-span-6 col-span-1">
            <Image
              src="/success-2.png"
              width={500}
              height={500}
              alt=""
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WriteSuccess;
