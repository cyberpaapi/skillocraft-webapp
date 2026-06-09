"use client";

import * as React from "react";
import Image from "next/image";
import { FC } from "react";

const FoundersHome:FC = () => {
  return (
    <section className="relative lg:pb-24 pb-12">
      <Image
        src="/bg/ptrn/9.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-semibold text-secondary">
            Our{" "}<span className="inline-block text-primary">Founders</span>
          </h2>
        </div>

        <div className="flex flex-wrap">
          {/* Image Sec */}
          <div className="md:w-4/12 w-full md:pe-10 md:pt-0 pb-12">
            <Image
              src="/founders.jpg"
              alt="About Us"
              width={500}
              height={500}
              className="md:w-auto h-full object-cover rounded-xl"
            />
          </div>

          {/* Content */}
          <div className="md:w-8/12 w-full space-y-4">
            <div className="relative ps-3 py-2">
              <div className="absolute left-0 top-0 -z-10 size-12 rounded-full bg-primary/70"></div>
              <h3 className="lg:text-2xl md:text-xl text-lg font-semibold text-secondary">
                High-Qualified Founders of{" "} <span className="inline-block text-primary">Skillocraft</span>
              </h3>
            </div>
            <p className="text-primary md:text-lg text-sm">
              When the time comes to reveal the names of the founders ofsuch change maker company SkillocraftPvt. Ltd, Amritendu Chowdhury holds a prominent place. After pursuing B.Tech, he founded one company named Chowdhury Group of Companies Pvt. Ltd in 2015. He achieved success in flourishinghis business in Event Management & Recruitment Services.
            </p>
            <p className="text-primary md:text-lg text-sm">
              Next comes in his mind the idea of a new startup business, which aims at finding new skills and talents in different fields. Amritendu Chowdhury is likely to bring revolution in skilled courses throughout India. He holds 90% of the company shares.
            </p>
            <p className="text-primary md:text-lg text-sm">
              Sangita Das and Shilpa Halder are the other two founders and shareholders of Skillocraft. Sangita Das,who was a B.Tech student, was an ex-employee of Ed-tech company Byju. She has in-depth knowledge and vast experience in online education
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersHome;
