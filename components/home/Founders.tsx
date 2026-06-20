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
              When the time comes to unveil the visionary minds behind Skillocraft, Amritendu Chowdhury stands at the forefront as a key driving force behind the company&apos;s mission and growth. A B.Tech graduate by qualification, Amritendu embarked on his entrepreneurial journey in 2015 by founding Chowdhury Group of Companies. Through his leadership, the company successfully established itself in the domains of Event Management and Recruitment Services, showcasing his ability to build and scale sustainable business models.
            </p>
            <p className="text-primary md:text-lg text-sm">
              Driven by a passion for innovation and impact, Amritendu envisioned a new-age startup focused on skill development and entrepreneurship creation. This vision led to the foundation of Skillocraft—an initiative aimed at identifying untapped talent and empowering individuals to become successful entrepreneurs across diverse industries. As the majority shareholder, holding 96% equity, Amritendu plays a pivotal role in shaping the strategic direction, innovation, and long-term vision of Skillocraft Pvt. Ltd.
            </p>
            <p className="text-primary md:text-lg text-sm">
              Sangita Roy, one of the shareholders of Skillocraft, is a B.Tech graduate and a former employee of BYJU&apos;S. She brings in-depth knowledge and extensive experience in the online education sector. Her expertise and industry exposure are expected to play a significant role in helping Skillocraft achieve its vision and scale effectively in the competitive ed-tech landscape.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersHome;
