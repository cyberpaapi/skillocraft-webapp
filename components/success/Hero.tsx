"use client";

import * as React from "react";
import Image from "next/image";
import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";

const HeroSuccess = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative lg:h-[475px] md:h-[350px] h-[200px]">
      <Image
        src="/bg/ptrn/1.svg"
        width={500}
        height={500}
        alt=""
        className="absolute -bottom-10 left-0 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      {/* Local Video */}
      <div className="absolute top-0 left-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="/hero/success.jpg"
          loop
          muted
        >
          <source src="/video/1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent"></div>

      {/* Play/Pause Button */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 lg:text-6xl md:text-5xl text-4xl inline-flex items-center justify-center rounded-full cursor-pointer text-white"
        onClick={togglePlayback}
      >
        {isPlaying ? (
          <FaRegCirclePause />
        ) : (
          <FaRegCirclePlay />
        )}
      </div>
    </section>
  );
};

export default HeroSuccess;
