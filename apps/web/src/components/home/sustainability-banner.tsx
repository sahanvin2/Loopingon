"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, Trees, Leaf } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: "80%",
    label: "Eco-Friendly Packaging",
  },
  {
    icon: Trees,
    value: "15,000+",
    label: "Trees Planted",
  },
  {
    icon: Leaf,
    value: "100%",
    label: "Natural Materials Option",
  },
];

export function SustainabilityBanner() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-text-800">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q40 15 35 30 Q45 25 50 35 Q40 40 30 30 Q20 40 10 35 Q15 25 25 30 Q20 15 30 5z' fill='%23ffffff'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl sm:text-4xl text-white mb-4"
        >
          Crafted with Care for Our Planet
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/70 text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          We believe handmade is inherently sustainable. We work with artisans who
          use natural materials and traditional techniques that have been
          eco-friendly for centuries.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary-500/20 backdrop-blur-sm flex items-center justify-center mb-4 ring-1 ring-primary-400/30">
                <stat.icon className="w-7 h-7 text-primary-300" />
              </div>
              <span className="font-serif text-4xl text-white font-bold mb-1">
                {stat.value}
              </span>
              <span className="text-primary-200/80 text-sm font-medium tracking-wide uppercase mt-2">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
