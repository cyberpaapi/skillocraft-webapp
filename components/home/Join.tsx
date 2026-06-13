"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const JoinHome:FC = () => {
  return (
    <section className="relative lg:pb-24 pb-12 pt-24">
      <Image
        src="/bg/ptrn/10.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />
      <Image
        src="/club.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-0 left-0 w-full max-w-3xl"
      />

      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Phone mockup on the left */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-64 sm:w-72 lg:w-80">
              <Image
                src="/phone-mockup.png"
                width={400}
                height={700}
                alt="Skillocraft App"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right: Join card + Download */}
          <div className="lg:space-y-24 space-y-12">
            {/* Join */}
            <div className="px-4 py-8 md:rounded-3xl rounded-2xl bg-emerald-300 md:space-y-6 space-y-4">
              <h3 className="lg:text-3xl md:text-2xl text-xl text-gray-950">
                Join{" "}<span className="text-emerald-700 font-semibold">Skillocraft</span>{" "}Formulator Club
              </h3>
              <h5 className="lg:text-2xl md:text-xl text-lg text-gray-950">
                Group of{" "}<span className="text-emerald-700 font-semibold">1,000</span>{" "}beauty <br /> brand owners
              </h5>
              <div className="block">
                <Link className="inline-block md:text-xl text-base text-white bg-emerald-700 hover:bg-emerald-700/90 px-4 py-2 rounded-full" href="/">Join Now</Link>
              </div>
            </div>

            {/* Download */}
            <div className="text-center md:space-y-6 space-y-4">
              <h3 className="lg:text-3xl md:text-2xl text-xl font-semibold text-gray-950">
                Get the Skillocraft App
              </h3>
              <p className="md:text-lg text-sm font-medium text-gray-950">
                Take advantage of exclusive discussion groups & communities, receive reminders for upcoming classes, download certificates, watch recordings and track your classes all in one place
              </p>
              <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                <Link className="block shadow-2xl" href="/">
                  <Image
                    src="/playstore.png"
                    width={500}
                    height={500}
                    alt=""
                    className="w-full rounded-lg"
                  />
                </Link>
                <Link className="block shadow-2xl" href="/">
                  <Image
                    src="/appstore.png"
                    width={500}
                    height={500}
                    alt=""
                    className="w-full rounded-lg"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinHome;
