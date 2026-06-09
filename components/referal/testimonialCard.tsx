"use client"
import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image';
import image from "../../public/logo.png";


import { Card, CardContent } from '../ui/card';
import Typography from '../common/typography';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { Testimony } from '@/types';
type Props = {
    testimonial:Testimony[]
};

const TestimonialCard:FC<Props> = ({testimonial}) => {

    const [data, setData] = useState<Testimony[]>([])

    useEffect(() => {
        setData(testimonial)
    }, [testimonial])
    
    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };
  return (
    // <Slider {...settings}>
    //         {data.map((item) => (
                // <Card className="flex flex-1 w-full max-w-[calc(100%-30%)] mx-[15%] max-h-screen shadow-2xl border-white" key={data[0].user.id}>
                //     <CardContent className="flex w-full flex-col md:flex-row p-0">
                //         <div className="w-full flex-col flex m-3 rounded-lg">
                //             <Image src={image} priority alt="logo" height={70} width={100} />
                //             <div className="flex-row flex justify-between mt-3">
                //                 <Typography className="text-gray-700 text-xs font-normal" size="xs" type="h4">
                //                     {data[0].user.name}
                //                 </Typography>
                //                 <Typography className="text-gray-700 text-xs font-light" size="xs" type="p">
                //                     {data[0].message}
                //                 </Typography>
                //             </div>
                //         </div>
                //     </CardContent>
                // </Card>
            //))}
        // </Slider>

    <>
    <Carousel opts={{
        align: "start",
      }}
      className="flex flex-1 w-full max-w-[calc(100%-30%)] mx-[15%] max-h-screen mt-1 z-10">

      <CarouselContent>
        {data?.map((item, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <Card className="flex flex-1 w-full shadow-xl border-white" key={item.user.id}>
                    <CardContent className="flex w-full flex-col md:flex-row p-0">
                       <div className="w-full flex-col flex m-3 rounded-lg">
                             <Image src={image} priority alt="logo" height={70} width={100} />
                             <div className="flex-col flex justify-between mt-3">
                                 <Typography className="text-gray-700 text-xs font-normal" size="xs" type="h4">
                                     {item.user.name}
                                 </Typography>
                                 <Typography className="text-gray-700 text-xs font-light" size="xs" type="p">
                                    {item?.message ? truncateText(item.message, 150) : ""}
                                 </Typography>
                             </div>
                         </div>
                     </CardContent>
                 </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious/>
      <CarouselNext/>
    </Carousel>
    </>
  )
}

export default TestimonialCard