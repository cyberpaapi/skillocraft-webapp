// "use client";

// import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation } from "swiper/modules";
// import { FC } from "react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/autoplay";

// const Slides = [
//   "/hero/h1.jpg",
//   "/hero/h2.jpg",
//   "/hero/h3.jpg",
//   "/hero/h4.jpg",
// ];

// const HeroHome:FC = () => {
//   return (
//     <section className="relative">
//       <Image
//         src="/bg/ptrn/1.svg"
//         width={500}
//         height={500}
//         alt=""
//         className="absolute -bottom-10 left-0 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
//       />

//       <div className="relative w-full overflow-x-visible bg-gray-100">
//         <Swiper
//           spaceBetween={0}
//           slidesPerView={1}
//           loop={true}
//           autoplay={{
//             delay: 3000,
//             disableOnInteraction: false,
//           }}
//           navigation={false}
//           modules={[Autoplay, Navigation]}
//           speed={1000}
//           className="!overflow-visible !m-0"
//           centeredSlides={false}
//           watchOverflow={true}
//           breakpoints={{
//             640: {
//               spaceBetween: 16,
//               slidesPerView: "auto",
//             },
//             1024: {
//               spaceBetween: 24,
//               slidesPerView: "auto",
//             },
//           }}
//         >
//           {Slides.map((image, index) => (
//             <SwiperSlide 
//               key={index} 
//               className="!w-full md:!w-auto hover:scale-105 transition-transform duration-300 !m-0"
//             >
//               <div className="relative w-full h-48 md:h-56 lg:h-72 xl:h-96">
//                 <Image
//                   src={image}
//                   alt={`Hero Slider ${index + 1}`}
//                   width={1200}
//                   height={600}
//                   className="w-full h-full object-cover md:object-contain m-0"
//                   priority={index < 2}
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default HeroHome;
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FC, useEffect, useState } from "react";
import { axiosPublic } from "@/services/axiosService";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Banner } from "@/types";

// const slider=[
//   {
//   id:"1",
//   name:"home1",
//   image:"/hero/h1.jpg"
//   },{
//     id:"2",
//     name:"home2",
//     image:"/hero/h2.jpg"
//   },{
//     id:"3",
//     name:"home3",
//     image:"/hero/h3.jpg"
//   },{
//     id:"4",
//     name:"home4",
//     image:"/hero/h4.jpg"
//   }
// ]



const HeroHome: FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axiosPublic.get('/banners');
        if (data.status === 1) {
          // Filter banners where bannerLocation is "HOME"
          const homeBanners = data.data.filter((banner: Banner) => 
            banner.bannerLocation === 'HOME' && banner.status === 'ACTIVE'
          );
          setBanners(homeBanners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);
  if (isLoading) {
    return (
      <section className="relative h-[400px] flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  // if (banners.length === 0) {
  //   return (
  //     <section className="relative">
  //       <Image
  //         src="/bg/ptrn/1.svg"
  //         width={500}
  //         height={500}
  //         alt=""
  //         className="absolute -bottom-10 left-0 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
  //       />

  //       <div className="relative w-full overflow-x-visible bg-gray-100">
  //         <Swiper
  //           modules={[Navigation, Autoplay]}
  //           spaceBetween={0}
  //           slidesPerView={1}
  //           navigation
  //           autoplay={{
  //             delay: 5000,
  //             disableOnInteraction: false,
  //           }}
  //           loop={slider.length > 1}
  //           className="w-full h-full"
  //         >
  //           {slider.map((banner,index) => (
  //               <SwiperSlide 
  //               key={index} 
  //               className="!w-full md:!w-auto hover:scale-105 transition-transform duration-300 !m-0"
  //             >
  //               <div className="relative w-full h-48 md:h-56 lg:h-72 xl:h-96">
  //                 <Image
  //                   src={banner.image}
  //                   alt={banner.name}
  //                   width={1200}
  //                   height={600}
  //                   className="w-full h-full object-cover md:object-contain m-0"
  //                   priority={index < 2}
  //                 />
  //               </div>
  //             </SwiperSlide>
  //           ))}
  //         </Swiper>
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section className="relative">
      <Image
        src="/bg/ptrn/1.svg"
        width={500}
        height={500}
        alt=""
        className="absolute -bottom-10 left-0 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="relative w-full overflow-x-visible bg-gray-100">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={banners.length > 1}
          className="w-full h-full"
        >
          {banners.map((banner,index) => (
              <SwiperSlide 
              key={index} 
              className="!w-full md:!w-auto hover:scale-105 transition-transform duration-300 !m-0"
            >
              <div className="relative w-full h-48 md:h-56 lg:h-72 xl:h-96">
                <Image
                  src={banner.imageLink.startsWith('http') ? banner.imageLink : `${process.env.NEXT_PUBLIC_API_URL}${banner.imageLink}`}
                  alt={banner.name}
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover md:object-contain m-0"
                  priority={index < 2}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HeroHome;
