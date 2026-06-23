"use client";

import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { axiosHomePublic } from "@/services/axiosHomeService";

interface GeneralFAQ { id: string; question: string; answer: string; }

function FAQItem({ question, answer, align = "left" }: { question: string; answer: string; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const chevron = open
    ? <FiChevronUp size={16} className="text-primary flex-shrink-0" />
    : <FiChevronDown size={16} className="text-gray-400 flex-shrink-0" />;
  const right = align === "right";
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 py-3 text-sm font-medium text-gray-800 hover:text-primary ${right ? "justify-end text-right" : "justify-between text-left"}`}
      >
        {right ? <>{chevron}<span>{question}</span></> : <><span>{question}</span>{chevron}</>}
      </button>
      {open && <p className={`pb-3 text-sm text-gray-500 leading-relaxed ${right ? "text-right" : ""}`}>{answer}</p>}
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
  align = "left",
}: {
  location: string;
  title?: string;
  highlight?: string;
  className?: string;
  align?: "left" | "right";
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
      <h2 className={`text-xl font-bold text-gray-900 mb-5 ${align === "right" ? "text-right" : ""}`}>
        {title} <span className="text-primary">{highlight}</span>
      </h2>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {faqs.map((faq) => <FAQItem key={faq.id} question={faq.question} answer={faq.answer} align={align} />)}
      </div>
    </section>
  );
}
