"use client";

import { Lobster } from "next/font/google";

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
});

const TaglineBlogInside = () => {
  return (
    <section className="relative lg:py-24 py-12">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          <h5 className="lg:text-2xl md:text-xl text-base font-medium text-primary text-center">
            All the Blogs contains resources and data’s to start home business and to become a successful entrepreneur.{" "}
            <span className={`inline-block text-secondary ${lobster.className}`}>
              #So start your learning now.
            </span>
          </h5>
        </div>
      </div>
    </section>
  );
};

export default TaglineBlogInside;
