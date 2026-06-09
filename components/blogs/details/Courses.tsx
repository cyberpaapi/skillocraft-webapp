"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import CourseCard from "@/components/common/card/Course";
import { useEffect, useState } from "react";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { Course } from "@/types";

// const courseData = [
//   {
//     imageSrc: "/courses/1.jpg",
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
//     imageSrc: "/courses/2.jpg",
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
//     imageSrc: "/courses/3.jpg",
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
//     imageSrc: "/courses/4.jpg",
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
//     imageSrc: "/courses/5.jpg",
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
// ];

const CoursesBlog = () => {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '10');
        const url = `/courses?${params.toString()}`;

        const response = await axiosHomePublic.get<{
          courses: Course[];
          pagination: { page: number; limit: number; total: number };
        }>(url);
        //setCourses(fetchedCourses);
        setFilteredCourses(response.data.courses);


      } catch (err) {
        const e = err as { response?: { data?: { message?: string } } };
        const msg = e.response?.data?.message || 'Failed to load courses';
        console.log(msg);
      }
    };

    fetchCourses();
  }, []);
  return (
    <section className="relative">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:space-y-4 space-y-2 max-w-4xl mx-auto md:mb-12 mb-8">
          <div>
            <span className="text-sm font-semibold text-red-500">Courses</span>
            <h3 className="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-semibold text-secondary">
              Did you find this blog useful? 😁
            </h3>
          </div>
          <p className="md:text-lg text-sm font-light">
            If you would like to learn more about Category, you can enroll in
            our category courses.
          </p>
        </div>

        {/* Course Cards Slider */}
        
        <Swiper
          modules={[Pagination, Autoplay]}
          loop={true}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            991: { slidesPerView: 3 },
            1080: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
          speed={3000}
          pagination={{ clickable: true }}
          className="pb-12"
        >
        {filteredCourses.map((course, index) => (
          <SwiperSlide key={index}>
            <CourseCard key={index} {...course} />
          </SwiperSlide>
        ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CoursesBlog;
