import React, { FC } from 'react'
import { Card, CardContent } from '../ui/card'
import { ReferalForm } from '../forms/referalForm'


const ReferalSectionTwo:FC = () => {
  return (
    <Card className="flex flex-1 w-full max-w-[calc(100%-30%)] mx-[15%] max-h-screen shadow-sm border-gray-100 bg-gray-100">
        <CardContent className="flex w-full flex-col md:flex-row p-0 mx-[10%]">
            <ReferalForm/>
        </CardContent>
    </Card>
  )
}

export default ReferalSectionTwo