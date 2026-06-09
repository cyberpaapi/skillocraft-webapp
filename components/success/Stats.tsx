"use client";

import * as React from "react";
import { useState, useEffect } from "react";

// StatCounter Component
const StatCounter = ({
  start = 0,
  end,
  duration = 2000,
  label,
}: {
  start?: number;
  end: number;
  duration?: number;
  label: string;
}) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [start, end, duration]);

  // Format the count with commas and add "RS." for the specific label
  let formattedCount: React.ReactNode = `${count.toLocaleString()}`;
  
  // If count is above 100000 and label is not "Being Earned by Hunar Students!", convert to "Lakh"
  if (count >= 100000 && label !== "Being Earned by Hunar Students!") {
    const lakhCount = Math.floor(count / 100000);  // Remove decimal part
    formattedCount = (
      <>
        {lakhCount} <span className="font-normal">Lakh</span>
      </>
    );
  }

  // Add RS. prefix for "Being Earned by Hunar Students!" label
  if (label === "Being Earned by Hunar Students!") {
    formattedCount = (
      <>
        <span className="font-normal">RS.</span> {formattedCount}
      </>
    );
  }

  return (
    <div className="text-center space-y-1 md:py-0 py-4">
      <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-bold text-white">
        {formattedCount} <span>+</span>
      </h2>
      <p className="text-white md:text-base text-xs">{label}</p>
    </div>
  );
};

const StatsSuccess = () => {
  const stats = [
    { end: 100, label: "Total Courses" },
    { end: 40000, label: "Being Earned by Hunar Students!" },
    { end: 1000000, label: "Student on the Skillocraft app" },
  ];

  return (
    <section className="relative -mt-12">
      <div className="container mx-auto">
        {/* Stats Section */}
        <div className="bg-[url('/bg/stats.png')] bg-cover bg-center lg:p-12 md:p-8 px-12 lg:rounded-3xl rounded-2xl">
          <div className="grid md:grid-cols-3 md:divide-x-2 md:divide-y-0 grid-cols-1 divide-y-2">
            {stats.map((stat, index) => (
              <StatCounter
                key={index}
                end={stat.end}
                label={stat.label}
                duration={2000}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSuccess;
