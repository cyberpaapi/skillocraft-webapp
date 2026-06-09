"use client";

import * as React from "react";
import Image from "next/image";
import CategoryCard from "@/components/common/card/Category";
import { FC } from "react";
import { Category } from "@/types";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

const CategoryHome:FC = () => {

  const [categories, setCategories] = useState<Category[]>([]);

  const { data: response } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await axiosHomePublic.get<{ 
          status: number;
          message: string;
          data: Category[];
        }>('/categories');
        return response.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch categories');
        return { data: [] };
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (response?.data) {
      setCategories(response.data.filter((category) => category.featured == true));
    }
  }, [response]);

  
  return (
    <section className="relative lg:pb-24 pb-12">
      <Image
        src="/bg/ptrn/5.svg"
        width={500}
        height={500}
        alt=""
        className="absolute top-0 right-0 -z-10 w-auto lg:h-[500px] md:h-[300px] h-[250px]"
      />

      <div className="container mx-auto">
        {/* Section Title */}
        <div className="md:mb-12 mb-8">
          <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-semibold text-secondary">
            Top{" "}<span className="inline-block text-primary">Categories</span>{" "}of Skillocraft
          </h2>
        </div>

        {/* Category Cards */}
        <div className="flex flex-wrap justify-center md:-mx-4 -mx-2 gap-y-5">
          {categories.map((category, index) => {
            const isEven = index % 2 === 0;

            const overlayColorClass = isEven
              ? "bg-white/85"
              : "bg-primary/85";
        
            const titleColorClass = isEven
              ? "text-primary"
              : "text-white";
            return (

              <div key={index} className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-1/2 px-2">
                <CategoryCard key={index} {...category} 
                overlayColorClass={overlayColorClass}
                titleColorClass={titleColorClass}/>
              </div>
              )
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryHome;
