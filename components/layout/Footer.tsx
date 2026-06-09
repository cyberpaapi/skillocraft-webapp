import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FaFacebookF, FaXTwitter, FaSquareInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111438] text-white">
      <div className="container mx-auto">
        {/* Footer Top */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 pt-12">
          <div className="md:space-y-6 space-y-4">
            <Image
              src="/logo.png"
              alt="Skillocraft"
              width={500}
              height={500}
              className="md:h-16 h-12 w-auto"
            />
            <p className="md:text-base text-sm font-light text-gray-300">
              when an unknown printer took galley of type and scrambled it to make pspecimen bookt has.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/" className="inline-flex items-center justify-center md:size-8 size-6 rounded-lg text-white hover:text-primary hover:bg-white/5  transition ease-in-out delay-150 duration-300">
                <FaFacebookF className="size-4" />
              </Link>
              <Link href="/" className="inline-flex items-center justify-center md:size-8 size-6 rounded-lg text-white hover:text-primary hover:bg-white/5  transition ease-in-out delay-150 duration-300">
                <FaXTwitter className="size-4" />
              </Link>
              <Link href="/" className="inline-flex items-center justify-center md:size-8 size-6 rounded-lg text-white hover:text-primary hover:bg-white/5  transition ease-in-out delay-150 duration-300">
                <FaSquareInstagram className="size-4" />
              </Link>
              <Link href="/" className="inline-flex items-center justify-center md:size-8 size-6 rounded-lg text-white hover:text-primary hover:bg-white/5  transition ease-in-out delay-150 duration-300">
                <FaLinkedinIn className="size-4" />
              </Link>
              <Link href="/" className="inline-flex items-center justify-center md:size-8 size-6 rounded-lg text-white hover:text-primary hover:bg-white/5  transition ease-in-out delay-150 duration-300">
                <FaYoutube className="size-4" />
              </Link>
            </div>
          </div>
          <div className="md:space-y-6 space-y-4">
            <h6 className="text-base font-semibold">Contact us</h6>
            <Link href="/" className="flex gap-2 items-center group transition ease-in-out delay-150 duration-300">
              <span className="inline-flex items-center justify-center size-10 rounded-md bg-white">
                <Image
                  src="/icons/email.svg"
                  alt="Email"
                  width={500}
                  height={500}
                  className="size-6"
                />
              </span>
              <div>
                <span className="block text-sm font-light text-gray-300">Email:</span>
                <span className="block text-sm font-semibold group-hover:text-primary">contact@skillocraft.com</span>
              </div>
            </Link>
            <Link href="/" className="flex gap-2 items-center group transition ease-in-out delay-150 duration-300">
              <span className="inline-flex items-center justify-center size-10 rounded-md bg-white">
                <Image
                  src="/icons/phone.svg"
                  alt="Email"
                  width={500}
                  height={500}
                  className="size-6"
                />
              </span>
              <div>
                <span className="block text-sm font-light text-gray-300">Phone:</span>
                <span className="block text-sm font-semibold group-hover:text-primary">(+91) 6687 - 5892</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Middle */}
        <div className="flex flex-wrap justify-between gap-8 py-16">
          <div className="space-y-4">
            <h6 className="text-base font-semibold">About us</h6>
            <ul className="md:text-sm text-xs space-y-2">
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Mission</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Our team</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Awards</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Testimonials</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">About Mentor</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h6 className="text-base font-semibold">Online classes</h6>
            <ul className="md:text-sm text-xs space-y-2">
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Online science classes</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Online mathematics classes</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Online computer classes</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Online statistics classes</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Online geographic classes</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h6 className="text-base font-semibold">Courses</h6>
            <ul className="md:text-sm text-xs space-y-2">
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Web design</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Web development</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Mobile design</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">UI/UX design</Link>
              </li>
              <li>
                <Link href="/" className="font-light text-gray-300 hover:text-primary transition ease-in-out delay-150 duration-300">Branding design</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Newsletter */}
        <div className="flex flex-wrap justify-between items-center gap-8 pb-16 border-b border-b-white">
          <div className="w-full max-w-md space-y-4">
            <h6 className="text-base font-semibold">Subscribe to our newsletter</h6>
            <p className="text-sm font-light text-gray-300">
              Subscribe today to unlock a wealth of knowledge, delivered right to your email, and stay ahead of the curve with ease.
            </p>
          </div>
          <div className="w-full max-w-md">
            <form action="" className="bg-white rounded-xl p-1 flex items-center gap-2">
              <Input type="email" placeholder="Enter your email address" className="border-0 focus-visible:ring-0" />
              <Button variant="default">Subscribe</Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 flex flex-wrap items-center justify-center text-sm gap-2">
          <span className="inline-block font-light text-gray-300">Copyright © {new Date().getFullYear()} Skillocraft Education</span>
          <span className="inline-block">|</span>
          <span className="inline-block font-light text-gray-300">All Rights Reserved</span>
          <span className="inline-block">|</span>
          <Link href="/terms" className="underline hover:text-primary transition ease-in-out delay-150 duration-300">Terms and Conditions</Link>|
          <Link href="/privacy" className="underline hover:text-primary transition ease-in-out delay-150 duration-300">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
