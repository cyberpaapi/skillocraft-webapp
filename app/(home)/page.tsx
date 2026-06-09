import BannerCarousel from "@/components/home/BannerCarousel";
import AboutHome from "@/components/home/About";
import WhatHome from "@/components/home/What";
import CoursesHome from "@/components/home/Courses";
import CategoryHome from "@/components/home/Category";
import AwardsHome from "@/components/home/Awards";
import CreatorHome from "@/components/home/Creators";
import TestimonialHome from "@/components/home/Testimonial";
import FoundersHome from "@/components/home/Founders";
import JoinHome from "@/components/home/Join";

export default function Home() {
  return (
    <>
      <BannerCarousel />
      <AboutHome />
      <WhatHome />
      <CoursesHome />
      <CategoryHome />
      <AwardsHome />
      <CreatorHome />
      <TestimonialHome />
      <FoundersHome />
      <JoinHome />
    </>
  );
}
