import React, { FC } from 'react'
import Typography from '../common/typography'
import TestimonialCard from './testimonialCard'
import { Testimony } from '@/types'


const ReferalSectionFour:FC = () => {
    const testimonyData:Testimony[]=[
        {
            review: "4",
            user: {
                id: '1',
                name: "Floyd Miles",
                email: 'test@test.com',
                avatar: undefined,
                role: 'admin',
                status: 'active',
                createdAt: ''
            },
            message: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
        },
        {
            review: "2",
            user: {
                id: '2',
                name: "Ronald Richards",
                email: 'test1@test.com',
                avatar: undefined,
                role: 'admin',
                status: 'active',
                createdAt: ''
            },
            message: "ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
        },
        {
            review: "3",
            user: {
                id: '3',
                name: "Savannah Nguyen",
                email: 'test@test.com',
                avatar: undefined,
                role: 'admin',
                status: 'active',
                createdAt: ''
            },
            message: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit." 
        },
        {
            review: "5",
            user: {
                id: '4',
                name: "Sava Saith",
                role: 'customer',
                email: 'test@test.com',
                avatar: undefined,
                status: 'active',
                createdAt: ''
            },
            message: "Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
        },
        {
            review: "3",
            user: {
                id: '5',
                name: "Savannah S G",
                role: 'customer',
                email: 'test@test.com',
                avatar: undefined,
                status: 'active',
                createdAt: ''
            },
            message: "Velit officia consequat duis enim velit mollit. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
        }
    ]
  return (
    <>
        <Typography className="text-black text-sm font-semibold  flex flex-1 w-full max-w-[calc(100%-30%)] mx-[15%] mt-10" size="sm" type='h4'>Our Referral Testimonials</Typography>
        <Typography className="text-black text-xs font-light flex flex-1 w-full max-w-[calc(100%-30%)] mx-[15%]" size="xs" type='p'>Don’t take our word for it. Trust our students!</Typography>

        <TestimonialCard testimonial={testimonyData}/>
    </>
  )
}

export default ReferalSectionFour