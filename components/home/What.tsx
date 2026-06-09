"use client";

import * as React from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC } from "react";

const WhatHome:FC = () => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = React.useState(false);
  const openVideoDialog = () => {
    setIsVideoDialogOpen(true);
  };
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
            Skillocraft is an online learning platform that offers every course from basic techniques to advanced skill. Skillocraft also helps you to start your entrepreneurial journey.
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

              <ul className="list-disc text-primary ps-6 pb-4 space-y-1 md:text-lg text-sm">
                <li>One-stop solution for skilled professionals</li>
                <li>Unlimited learning for skilled talents</li>
                <li>Learn online courses theoretically and practically from anywhere</li>
                <li>Purchase HD-quality learning videos at an affordable cost</li>
                <li>Arrangements for doubt-clearing sessions and workshops</li>
                <li>Learn from scratch to advance level at Skillocraft from experts</li>
                <li>Immense opportunity for skilled professionals to teach and earn</li>
              </ul>
            </div>
          </div>

          {/* Image Sec */}
          <div className="relative p-4">
            <div className="size-24 absolute top-0 left-0 -z-10 rounded-2xl bg-sky-400"></div>
            <div className="size-40 absolute bottom-0 right-0 -z-10 rounded-2xl bg-primary/70"></div>
            <div className="absolute top-1/2 left-1/2 bg-white rounded-full size-10 inline-flex items-center justify-center cursor-pointer" onClick={openVideoDialog}>
              <FaPlay className="size-4 text-sky-400" />
            </div>
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

      {/* Video Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="lg:max-w-2xl md:max-w-xl max-w-xs p-0 overflow-hidden border-0 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/10">
          <DialogTitle className="text-center p-4 pb-0 text-white">
            Video Title goes here...
          </DialogTitle>
          <video className="w-full" controls preload="none">
            <source src="/video/1.mp4" type="video/mp4" />
            <track
              src="/path/to/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
            />
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WhatHome;
