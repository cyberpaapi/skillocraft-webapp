import React, { FC } from "react";
import image from "../../public/object.png";
import Image from "next/image";
import { Gift, SendHorizontal, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Typography from "../common/typography";

const ReferalSectionOne:FC = () => {
  return (
    <Card className="flex flex-1 w-full max-w-[calc(100%-30%)] mx-[15%] max-h-screen mt-10 shadow-sm border-gray-100 bg-gray-100">
        <CardContent className="flex w-full flex-col md:flex-row p-0">
        <div className="w-full hidden md:w-1/4 flex-col md:flex p-10 m-3 items-center">
            <Image src={image} priority alt="logo" height={150} width={150} />
        </div>
        <div className="w-full md:w-3/4 p-10">
            <Typography className="text-black text-sm font-semibold" size="sm" type='h4'>Invite Together, earn together</Typography>
            <Typography className="text-black text-xs font-light mt-5" size="xs" type='p'>Friends don’t let friends miss opportunities. Invite your friends to join Skillocraft and earn referral bonus of $25 each. (Referral program rules apply only)</Typography>
            <div className='flex-row flex items-center mt-7'>
                <SendHorizontal className="bg-transparent p-2 w-9 h-9 rounded-full border border-gray-800" color='#1F2937'/> 
                <div className='flex-wrap flex-col ml-4'>
                    <Typography className="text-black text-xs font-light" size="xs" type='p'>Invite your friends to Skillocraft.</Typography>
                </div>
            </div>
            <div className='flex-row flex items-center mt-3'>
                <ShoppingCart className="bg-transparent p-2 w-9 h-9 rounded-full border border-gray-800" color='#1F2937'/> 
                <div className='flex-wrap flex-col ml-4'>
                    <Typography className="text-black text-xs font-light" size="xs" type='p'>Your friends get $25 off their first purchase.</Typography>
                </div>
            </div>
            <div className='flex-row flex items-center mt-3'>
                <Gift className="bg-transparent p-2 w-9 h-9 rounded-full border border-gray-800" color='#1F2937'/> 
                <div className='flex-wrap flex-col ml-4'>
                    <Typography className="text-black text-xs font-light" size="xs" type='p'>You get $25 for every friend that makes a $50 purchase.</Typography>
                </div>
            </div>
            
        </div>
        </CardContent>
    </Card>
  );
};

export default ReferalSectionOne;
