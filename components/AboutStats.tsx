"use client";
import React from "react";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useInView } from "@/hooks/useInView";

const stats = [
  { target: 50000, suffix: "+", label: "Records Registered" },
  { target: 12, label: "District Offices" },
  { target: 99, suffix: "%", label: "Data Accuracy" },
  { target: 3, suffix: " days", label: "Avg. Processing Time" },
];

export default function AboutStats() {
  const { ref, inView } = useInView(0.2);

  return (
    <section ref={ref} className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl md:text-4xl font-black text-red-600">
              <AnimatedCounter
                target={s.target}
                suffix={s.suffix}
                duration={1000}
                direction="up"
                trigger={inView}
              />
            </p>
            <p className="text-sm text-gray-500 mt-1 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
