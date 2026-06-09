"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { FaCirclePlay } from "react-icons/fa6";

// StatCounter Component
const StatCounter = ({
  start = 0,
  end,
  duration = 2000,
  label,
}: {
  start?: number;
  end: number;
  duration?: number;
  label: string;
}) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [start, end, duration]);

  // Check if `label` requires a "k" suffix
  const formattedCount = label === "Total Student" ? `${count}k` : `${count}`;

  return (
    <div className="text-center space-y-1">
      <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-bold text-white">
        {formattedCount} <span>+</span>
      </h2>
      <p className="text-white md:text-base text-xs">{label}</p>
    </div>
  );
};

// AboutHome Component
const AboutHome :FC= () => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = React.useState(false);
  const openVideoDialog = () => {
    setIsVideoDialogOpen(true);
  };
  const stats = [
    { end: 100, label: "Total Courses" },
    { end: 150, label: "Total Instructor" },
    { end: 35, label: "Total Student" },
  ];

  return (
    <section className="relative">
      <Image
        src="/bg/ptrn/2.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-5 items-center">
          {/* Content */}
          <div className="md:col-span-7 col-span-12">
            <div className="md:space-y-6 space-y-4">
              <h1 className="xl:text-6xl lg:text-5xl md:text-4xl text-3xl font-medium text-secondary">
                <span className="inline-block font-bold text-primary">
                  Best Skill
                </span>
                <span className="font-medium">
                  -Oriented{" "}
                </span>
                <span className="inline-block font-bold text-primary">
                  Courses
                </span>{" "}
                <span className="font-medium">
                Website in India
                </span>
              </h1>
              <p className="lg:text-xl md:text-lg text-base font-light">
                Skillocraft, the first skill-tech company in India, unveils 100+
                skill-oriented online courses. We are providing a platform to
                both professional creators and skill-tech students.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  className="text-xs uppercase rounded-full"
                  variant="default"
                  asChild
                >
                  <Link href="/courses">JOIN COURSE</Link>
                </Button>
                <Button
                  className="text-xs uppercase rounded-full"
                  variant="outline"
                  onClick={openVideoDialog}
                >
                  <FaCirclePlay /> See how it works?
                </Button>
              </div>
            </div>
          </div>

          {/* Image Sec */}
          <div className="md:col-span-5 col-span-12">
            <div className="relative">
              <Image
                src="/about-1.png"
                width={500}
                height={500}
                alt="About Us"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-[url('/bg/stats.png')] bg-cover bg-center lg:p-12 md:p-8 p-4 lg:rounded-2xl rounded-xl">
          <div className="grid grid-cols-3 max-w-3xl mx-auto divide-x-2">
            {stats.map((stat, index) => (
              <StatCounter
                key={index}
                end={stat.end}
                label={stat.label}
                duration={2000}
              />
            ))}
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

export default AboutHome;
