"use client";

import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { axiosHomePublic } from "@/services/axiosHomeService";

interface GeneralFAQ { id: string; question: string; answer: string; }

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left text-sm font-medium text-gray-800 hover:text-primary"
      >
        <span>{question}</span>
        {open ? <FiChevronUp size={16} className="text-primary flex-shrink-0 ml-2" /> : <FiChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />}
      </button>
      {open && <p className="pb-3 text-sm text-gray-500 leading-relaxed">{answer}</p>}
    </div>
  );
}

/**
 * Renders general FAQs tagged for a given location (homepage | live_online |
 * live_offline | marketplace | blogs). Renders nothing if there are none.
 */
export default function FaqSection({
  location,
  title = "Frequently Asked",
  highlight = "Questions",
  className = "",
}: {
  location: string;
  title?: string;
  highlight?: string;
  className?: string;
}) {
  const [faqs, setFaqs] = useState<GeneralFAQ[]>([]);

  useEffect(() => {
    axiosHomePublic
      .get(`/general-faqs?location=${encodeURIComponent(location)}`)
      .then(({ data }) => setFaqs(data?.data || []))
      .catch(() => {});
  }, [location]);

  if (faqs.length === 0) return null;

  return (
    <section className={`max-w-4xl mx-auto px-4 sm:px-6 py-10 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        {title} <span className="text-primary">{highlight}</span>
      </h2>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {faqs.map((faq) => <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />)}
      </div>
    </section>
  );
}
