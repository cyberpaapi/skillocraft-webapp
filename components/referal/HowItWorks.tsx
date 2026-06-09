"use client";

import { useEffect, useState } from "react";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { IoMdSend } from "react-icons/io";
import { HiShoppingCart, HiOutlineGift } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa6";
import Image from "next/image";
import image from "../../public/object.png";

interface Settings {
  discountPercent: number;
  earningsPercent: number;
}

export default function HowItWorks() {
  const [settings, setSettings] = useState<Settings>({
    discountPercent: 20,
    earningsPercent: 20,
  });

  useEffect(() => {
    axiosHomePublic
      .get("/referral/settings")
      .then((r) => setSettings(r.data))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative py-12">
        <div className="container mx-auto">
          <div className="bg-secondary text-white md:px-12 p-8 lg:rounded-3xl rounded-2xl text-center space-y-4">
            <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold">
              Refer a Friend &amp; Both of You Get Rewarded
            </h1>
            <p className="text-base opacity-80 max-w-xl mx-auto">
              Invite friends to Skillocraft. They get{" "}
              <strong>{settings.discountPercent}%&nbsp;off</strong> their first
              purchase — and you earn{" "}
              <strong>{settings.earningsPercent}%</strong> of whatever they
              spend.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="bg-white/10 rounded-2xl px-8 py-4">
                <p className="text-3xl font-bold">{settings.discountPercent}%</p>
                <p className="text-xs opacity-70 mt-1">Friend's discount</p>
              </div>
              <div className="bg-white/10 rounded-2xl px-8 py-4">
                <p className="text-3xl font-bold">{settings.earningsPercent}%</p>
                <p className="text-xs opacity-70 mt-1">Your earnings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — Diagram */}
      <section className="relative py-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-medium tracking-widest uppercase text-primary">
              Simple Process
            </span>
            <h2 className="lg:text-3xl md:text-2xl text-xl font-bold text-secondary mt-1">
              How Referrals Work
            </h2>
          </div>

          {/* Diagram steps */}
          <div className="flex flex-wrap items-start justify-center gap-4 md:gap-0">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center w-48 space-y-3">
              <div className="relative">
                <span className="inline-flex items-center justify-center size-16 bg-secondary text-white rounded-full">
                  <IoMdSend className="text-2xl" />
                </span>
                <span className="absolute -top-1 -right-1 size-6 bg-primary text-white rounded-full text-xs font-bold flex items-center justify-center">
                  1
                </span>
              </div>
              <p className="font-semibold text-secondary text-sm">
                Share Your Code
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Sign up &amp; get your unique referral code. Share it with
                friends via link, WhatsApp or social media.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center mt-8 px-3 text-gray-300">
              <FaArrowRight className="text-xl" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center w-48 space-y-3">
              <div className="relative">
                <span className="inline-flex items-center justify-center size-16 bg-secondary text-white rounded-full">
                  <HiShoppingCart className="text-2xl" />
                </span>
                <span className="absolute -top-1 -right-1 size-6 bg-primary text-white rounded-full text-xs font-bold flex items-center justify-center">
                  2
                </span>
              </div>
              <p className="font-semibold text-secondary text-sm">
                Friend Joins &amp; Buys
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your friend signs up using your code and gets{" "}
                <strong>{settings.discountPercent}% off</strong> their first
                course.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center mt-8 px-3 text-gray-300">
              <FaArrowRight className="text-xl" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center w-48 space-y-3">
              <div className="relative">
                <span className="inline-flex items-center justify-center size-16 bg-primary text-white rounded-full">
                  <HiOutlineGift className="text-2xl" />
                </span>
                <span className="absolute -top-1 -right-1 size-6 bg-secondary text-white rounded-full text-xs font-bold flex items-center justify-center">
                  3
                </span>
              </div>
              <p className="font-semibold text-secondary text-sm">
                Both Get Rewarded
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                You earn <strong>{settings.earningsPercent}%</strong> of every
                purchase they make — instantly tracked in your dashboard.
              </p>
            </div>
          </div>

          {/* Connector line (desktop only) */}
          <div className="hidden md:block relative -mt-24 mb-16 mx-auto w-2/3">
            <div className="absolute top-1/2 left-0 right-0 h-px border-t-2 border-dashed border-gray-200 -translate-y-1/2 z-0" />
          </div>
        </div>
      </section>

      {/* Invite section (the original component content) */}
      <section className="relative py-4">
        <div className="container mx-auto">
          <div className="bg-gray-100/50 md:px-12 p-6 lg:rounded-3xl rounded-2xl flex flex-wrap gap-y-8">
            <div className="lg:w-3/12 md:w-4/12 w-full md:pe-14">
              <Image
                src={image}
                alt="Refer and earn"
                width={500}
                height={500}
                className="w-full"
              />
            </div>
            <div className="lg:w-9/12 md:w-8/12 w-full space-y-6">
              <div className="space-y-3">
                <h4 className="lg:text-2xl md:text-xl text-lg font-semibold text-secondary">
                  Invite Together, Earn Together
                </h4>
                <p className="text-sm">
                  Friends don't let friends miss opportunities. Invite your
                  friends to join Skillocraft and earn{" "}
                  {settings.earningsPercent}% of their purchases.
                </p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-4 text-sm">
                  <span className="inline-flex flex-shrink-0 items-center justify-center size-8 bg-white border border-gray-400 rounded-full">
                    <IoMdSend className="text-base" />
                  </span>
                  Invite your friends to Skillocraft.
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <span className="inline-flex flex-shrink-0 items-center justify-center size-8 bg-white border border-gray-400 rounded-full">
                    <HiShoppingCart className="text-base" />
                  </span>
                  Your friends get {settings.discountPercent}% off their first
                  purchase.
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <span className="inline-flex flex-shrink-0 items-center justify-center size-8 bg-white border border-gray-400 rounded-full">
                    <HiOutlineGift className="text-base" />
                  </span>
                  You earn {settings.earningsPercent}% of every purchase they
                  make.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
