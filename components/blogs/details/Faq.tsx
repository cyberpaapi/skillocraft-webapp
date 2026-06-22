"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosHomePublic } from "@/services/axiosHomeService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Types
type FAQ = {
  id: string;
  question: string;
  answer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type FAQResponse = {
  status: number;
  message: string;
  data: FAQ[];
};

const FaqBlogDetails = () => {
  // Fetch FAQs from API
  const { data, isLoading } = useQuery<FAQResponse>({
    queryKey: ['general-faqs', 'blogs'],
    queryFn: async () => {
      const response = await axiosHomePublic.get('/general-faqs?location=blogs');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Use API data if available, otherwise fall back to empty array
  const faqs = React.useMemo(() => data?.data || [], [data?.data]);
  return (
    <section className="relative lg:py-24 py-12">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="max-w-4xl mx-auto md:mb-12 mb-8">
          <span className="text-sm font-semibold text-red-500">Faq&apos;s</span>
          <h3 className="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-semibold text-secondary">
            Frequently{" "}
            <span className="inline-block text-primary font-bold">
              Asked Questions
            </span>
          </h3>
        </div>

        {/* Accordion Content */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6 mt-2"></div>
                </div>
              ))
            ) : faqs && faqs.length > 0 ? (
              // Success state - only render if we have FAQs
              faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`faq-${faq.id}`}
                  className="border border-gray-200 rounded-lg mb-2"
                >
                  <AccordionTrigger className="text-sm text-left font-semibold text-secondary hover:text-primary px-4 py-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : null}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqBlogDetails;
