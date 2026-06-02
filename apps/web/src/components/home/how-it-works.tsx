"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Heart, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover Unique Crafts",
    description:
      "Browse thousands of authentic Sri Lankan handmade products crafted by verified artisans from across the island.",
  },
  {
    number: "02",
    icon: Heart,
    title: "Support Local Artisans",
    description:
      "Every purchase goes directly to supporting skilled Sri Lankan craftspeople and their communities.",
  },
  {
    number: "03",
    icon: Truck,
    title: "Receive at Your Doorstep",
    description:
      "Your handcrafted treasure is carefully packaged and delivered to your doorstep, anywhere in the world.",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-cream-50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl text-charcoal-900 text-center mb-4"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-muted-600 text-center max-w-xl mx-auto mb-16"
        >
          From discovering unique crafts to receiving them at your door, here&apos;s
          how Loopingon connects you with Sri Lanka&apos;s finest artisans.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="relative text-center px-4"
            >
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-4 block">
                Step {step.number}
              </span>

              <div
                className={cn(
                  "w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center",
                  "mx-auto mb-6 shadow-rose",
                )}
              >
                <step.icon className="w-9 h-9 text-white" />
              </div>

              <h3 className="font-serif text-lg text-charcoal-900 mb-3">{step.title}</h3>
              <p className="text-muted-600 text-sm leading-relaxed">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+50px)] w-[calc(100%-100px)]">
                  <svg height="4" className="w-full">
                    <line
                      x1="0"
                      y1="2"
                      x2="100%"
                      y2="2"
                      stroke="#e2d9d1"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
