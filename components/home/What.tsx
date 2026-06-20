"use client";

import * as React from "react";
import Image from "next/image";
import { FC } from "react";

const WhatHome:FC = () => {
  return (
    <section className="relative lg:py-24 py-12">
      <Image
        src="/bg/ptrn/3.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:space-y-4 space-y-2 text-center max-w-4xl mx-auto md:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-semibold text-secondary">
            What is{" "}
            <span className="inline-block text-primary">Skillocraft?</span>
          </h2>
          <p className="md:text-lg text-sm font-light">
            Skillocraft is an online learning platform that offers every course from basic techniques to advanced stage. Skillocraft also helps you to start your entrepreneurial journey.
          </p>
        </div>

        <div className="grid items-center lg:grid-cols-2 gap-5">
          {/* Content */}
          <div className="space-y-4">
            <div className="relative ps-3 py-2">
              <div className="absolute left-0 top-0 -z-10 size-12 rounded-full bg-primary/70"></div>
              <h3 className="lg:text-2xl md:text-xl text-lg font-semibold text-secondary">Why Choose Skillocraft?</h3>
            </div>
            <div className="relative p-4">
              <div className="absolute right-0 top-0 -z-10 w-16 h-2 rounded-md bg-secondary"></div>
              <div className="absolute right-0 top-0 -z-10 w-2 h-16 rounded-md bg-secondary"></div>
              <div className="absolute left-0 bottom-0 -z-10 w-2 h-16 rounded-md bg-secondary"></div>
              <div className="absolute left-0 bottom-0 -z-10 w-16 h-2 rounded-md bg-secondary"></div>

              <ul className="list-disc text-primary ps-6 pb-4 space-y-2 md:text-lg text-sm">
                <li><span className="font-semibold text-secondary">Learn Skills That Actually Make Money</span> - Not just theory - practical &amp; income-generating skills</li>
                <li><span className="font-semibold text-secondary">Learn Anytime, Anywhere</span> - Learn at your own pace - no deadlines, no pressure</li>
                <li><span className="font-semibold text-secondary">Affordable Learning</span> - One-time payment, lifetime value</li>
                <li><span className="font-semibold text-secondary">Start From Home</span> - Learn skills that require low or zero setup cost</li>
                <li><span className="font-semibold text-secondary">Business-Focused Training</span> - Not just &ldquo;how to make&rdquo; - also how to sell. Learn pricing, packaging &amp; customer basics</li>
                <li><span className="font-semibold text-secondary">Beginner Friendly Courses</span> - No prior experience needed. Simple, easy-to-follow lessons.</li>
                <li><span className="font-semibold text-secondary">Lifetime Access</span> - Revisit lessons anytime. No expiry — your learning stays with you</li>
                <li><span className="font-semibold text-secondary">Community &amp; Support</span> - Learn with like-minded people. Get guidance and support when needed.</li>
              </ul>
            </div>
          </div>

          {/* Image Sec */}
          <div className="relative p-4">
            <div className="size-24 absolute top-0 left-0 -z-10 rounded-2xl bg-sky-400"></div>
            <div className="size-40 absolute bottom-0 right-0 -z-10 rounded-2xl bg-primary/70"></div>
            <Image
              src="/what-1.jpg"
              alt="About Us"
              width={500}
              height={500}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatHome;
