"use client";

import * as React from "react";
import Image from "next/image";
import CourseCard from "@/components/common/card/Course";
import { FC, useEffect, useState } from "react";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { Course } from "@/types";
import { toast } from "sonner";

// const courseData = [
//   {
//     imageSrc: "/courses/a1.jpg",
//     badgeTextPrimary: "",
//     badgeTextSecondary: "",
//     title: "Master Chef Cooking Course",
//     titleLink: "#",
//     authorName: "Skillocraft",
//     description:
//       "Learn to cook with me - I love to teach cooking to my students - so many techniques and recipes! See you in the kitchen!",
//     rating: 4.5,
//     ratingCount: 12500,
//     newPrice: "$19.99",
//     oldPrice: "$29.99",
//   },
//   {
//     imageSrc: "/courses/a2.jpg",
//     badgeTextPrimary: "",
//     badgeTextSecondary: "",
//     title: "Baking 1.0: The Basics of Baking - Cookies, Muffins and Cakes",
//     titleLink: "#",
//     authorName: "Skillocraft",
//     description:
//       "Take your Baking skills to the next level by learning baking techniques",
//     rating: 4.5,
//     ratingCount: 12500,
//     newPrice: "$19.99",
//     oldPrice: "$29.99",
//   },
//   {
//     imageSrc: "/courses/a3.jpg",
//     badgeTextPrimary: "Best Seller",
//     badgeTextSecondary: "20% OFF",
//     title: "Make-up for Beginners: learn doing makeup like a Pro",
//     titleLink: "#",
//     authorName: "Skillocraft",
//     description:
//       "Take your make-up skills to a completely new level. In-depth training for all make-up lovers",
//     rating: 4.5,
//     ratingCount: 12500,
//     newPrice: "$19.99",
//     oldPrice: "$29.99",
//   },
//   {
//     imageSrc: "/courses/a4.jpg",
//     badgeTextPrimary: "",
//     badgeTextSecondary: "",
//     title: "More Essential Cooking Skills",
//     titleLink: "#",
//     authorName: "Skillocraft",
//     description:
//       "Cook like a pro, master the basic techniques used in the World's culinary industry! Key Techniques",
//     rating: 4.5,
//     ratingCount: 12500,
//     newPrice: "$19.99",
//     oldPrice: "$29.99",
//   },
//   {
//     imageSrc: "/courses/a1.jpg",
//     badgeTextPrimary: "",
//     badgeTextSecondary: "",
//     title: "Master Chef Cooking Course",
//     titleLink: "#",
//     authorName: "Skillocraft",
//     description:
//       "Learn to cook with me - I love to teach cooking to my students - so many techniques and recipes! See you in the kitchen!",
//     rating: 4.5,
//     ratingCount: 12500,
//     newPrice: "$19.99",
//     oldPrice: "$29.99",
//   },
//   {
//     imageSrc: "/courses/a2.jpg",
//     badgeTextPrimary: "",
//     badgeTextSecondary: "",
//     title: "Baking 1.0: The Basics of Baking - Cookies, Muffins and Cakes",
//     titleLink: "#",
//     authorName: "Skillocraft",
//     description:
//       "Take your Baking skills to the next level by learning baking techniques",
//     rating: 4.5,
//     ratingCount: 12500,
//     newPrice: "$19.99",
//     oldPrice: "$29.99",
//   },
//   {
//     imageSrc: "/courses/a3.jpg",
//     badgeTextPrimary: "Best Seller",
//     badgeTextSecondary: "20% OFF",
//     title: "Make-up for Beginners: learn doing makeup like a Pro",
//     titleLink: "#",
//     authorName: "Skillocraft",
//     description:
//       "Take your make-up skills to a completely new level. In-depth training for all make-up lovers",
//     rating: 4.5,
//     ratingCount: 12500,
//     newPrice: "$19.99",
//     oldPrice: "$29.99",
//   },
//   {
//     imageSrc: "/courses/a5.jpg",
//     badgeTextPrimary: "",
//     badgeTextSecondary: "",
//     title: "More Essential Cooking Skills",
//     titleLink: "#",
//     authorName: "Skillocraft",
//     description:
//       "Cook like a pro, master the basic techniques used in the World's culinary industry! Key Techniques",
//     rating: 4.5,
//     ratingCount: 12500,
//     newPrice: "$19.99",
//     oldPrice: "$29.99",
//   },
// ];

const CoursesHome:FC = () => {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '500');
        const url = `/courses?${params.toString()}`;

        const response = await axiosHomePublic.get<{
          courses: Course[];
          pagination: { page: number; limit: number; total: number };
        }>(url);
        //setCourses(fetchedCourses);
        setFilteredCourses(response.data.courses.filter((course) => course.featured == true));

      } catch (err) {
        const e = err as { response?: { data?: { message?: string } } };
        const msg = e.response?.data?.message || 'Failed to load courses';
        toast.error(msg);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="relative lg:pb-24 pb-12">
      <Image
        src="/bg/ptrn/4.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-semibold text-secondary">
            Top{" "}<span className="inline-block text-primary">Trending</span>{" "}Courses
          </h2>
        </div>

        {/* Course Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
          {filteredCourses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesHome;
