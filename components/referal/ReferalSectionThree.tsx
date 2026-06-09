import React, { FC } from 'react'
import { Facebook, Instagram, Link2, Linkedin, Twitter } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import Typography from '../common/typography'

const ReferalSectionThree:FC = () => {
  return (
    <Card className="flex flex-1 w-full max-w-[calc(100%-30%)] mx-[15%] max-h-screen mt-10 shadow-sm border-gray-100 bg-gray-100">
        <CardContent className="flex w-full flex-col md:flex-row p-0 mx-[3%] py-4 justify-between">

            <div className=''>
                <Typography className="text-gray-800 text-sm font-light" size="sm" type='p'>
                Use these buttons to share your referral link with your friends and invite them to Skillocraft
                </Typography>
            </div>
            <div className=''>
                <div className=' flex flex-row gap-4'>
                    <Link2 size={20} color='#1f2937' /> 
                    <Facebook size={20} color='#1f2937'/> 
                    <Linkedin size={20} color='#1f2937'/> 
                    <Instagram size={20} color='#1f2937'/>
                    <Twitter size={20} color='#1f2937'/>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

export default ReferalSectionThree