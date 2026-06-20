"use client";

import * as React from "react";
import Image from "next/image";
import { FaAward, FaRocket } from "react-icons/fa6";

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
          <div className="lg:col-span-7 md:col-span-6 col-span-1 space-y-6">
            <div className="space-y-2">
              <h3 className="lg:text-3xl md:text-2xl text-xl font-bold text-secondary">
                Now write your success stories
              </h3>
              <p className="md:text-lg text-base text-primary">
                Your journey from learning to earning starts here
              </p>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <span className="shrink-0 size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <FaAward className="size-6" />
                </span>
                <span className="md:text-lg text-base font-medium text-secondary">
                  Get National Recognition and certificate
                </span>
              </li>
              <li className="flex items-center gap-4">
                <span className="shrink-0 size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <FaRocket className="size-6" />
                </span>
                <span className="md:text-lg text-base font-medium text-secondary">
                  Stop searching for opportunities. Start creating them.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WriteSuccess;
