"use client";

import Link from "next/link";
import { IoLinkSharp } from "react-icons/io5";
import { FaFacebook, FaFacebookMessenger, FaTwitter } from "react-icons/fa6";

const SocialInvite = () => {
  return (
    <section className="relative">
      <div className="container mx-auto">
        <div className="bg-gray-100/50 md:px-12 p-6 lg:rounded-3xl rounded-2xl flex flex-wrap items-center justify-between gap-6">
          <p className="text-sm font-semibold max-w-lg">
            Use these buttons to share your referral link with your friends and invite them to Skillocraft
          </p>
          <div className="flex gap-6">
            <Link href="" className="text-2xl text-black hover:text-primary transition-colors">
              <IoLinkSharp />
            </Link>
            <Link href="" className="text-2xl text-black hover:text-primary transition-colors">
              <FaFacebook />
            </Link>
            <Link href="" className="text-2xl text-black hover:text-primary transition-colors">
              <FaFacebookMessenger />
            </Link>
            <Link href="" className="text-2xl text-black hover:text-primary transition-colors">
              <FaTwitter />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialInvite;
