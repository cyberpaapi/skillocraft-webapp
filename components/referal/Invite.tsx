"use client";

import * as React from "react";
import Image from "next/image";
import { IoMdSend } from "react-icons/io";
import { HiShoppingCart, HiOutlineGift } from "react-icons/hi";
import image from "../../public/object.png";

const ReferralInvite = () => {
  return (
    <section className="relative py-12">
      <div className="container mx-auto">
        <div className="bg-gray-100/50 md:px-12 p-6 lg:rounded-3xl rounded-2xl flex flex-wrap gap-y-8">
          {/* Image Sec */}
          <div className="lg:w-3/12 md:w-4/12 w-full md:pe-14">
            <Image
              src={image}
              alt="About Us"
              width={500}
              height={500}
              className="w-full"
            />
          </div>

          {/* Content */}
          <div className="lg:w-9/12 md:w-8/12 w-full space-y-6">
            <div className="space-y-3">
              <h4 className="lg:text-2xl md:text-xl text-lg font-semibold text-secondary">
                Invite Together, earn together
              </h4>
              <p className="text-sm">
                Friends don’t let friends miss opportunities. Invite your friends to join Skillocraft and earn referral bonus of ₹25 each. (Referral program rules apply only)
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
                Your friends get ₹25 off their first purchase.
              </li>
              <li className="flex items-center gap-4 text-sm">
                <span className="inline-flex flex-shrink-0 items-center justify-center size-8 bg-white border border-gray-400 rounded-full">
                  <HiOutlineGift className="text-base" />
                </span>
                You get $25 for every friend that makes a $50 purchase.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>    
  );
};

export default ReferralInvite;
