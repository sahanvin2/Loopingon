"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

const REGION_COLORS: Record<string, string> = {
  "Kandy": "from-amber-400 to-orange-500",
  "Galle": "from-teal-400 to-cyan-500",
  "Jaffna": "from-purple-400 to-indigo-500",
  "Matara": "from-emerald-400 to-green-500",
  "Anuradhapura": "from-rose-400 to-pink-500",
  "Kurunegala": "from-sky-400 to-blue-500",
};

const regions = [
  { name: "Kandy", delay: 0.1 },
  { name: "Galle", delay: 0.2 },
  { name: "Jaffna", delay: 0.3 },
  { name: "Matara", delay: 0.4 },
  { name: "Anuradhapura", delay: 0.5 },
  { name: "Kurunegala", delay: 0.6 },
];

export function ShopByRegion() {
  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-text-900 font-medium">
          Shop by Region
        </h2>
        <Link href="/regions" className="hidden sm:flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
          View all <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <div className="flex flex-nowrap overflow-x-auto pb-6 gap-6 sm:gap-8 scrollbar-hide snap-x">
        {regions.map((region) => (
          <motion.div
            key={region.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: region.delay, duration: 0.5 }}
            className="snap-start shrink-0 flex flex-col items-center gap-3 group"
          >
            <Link href={`/regions/${region.name.toLowerCase()}`} className="focus:outline-none">
              <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-soft group-hover:shadow-soft-md group-hover:border-primary-100 transition-all duration-300 relative bg-gradient-to-br ${REGION_COLORS[region.name] || "from-surface-300 to-surface-400"}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white/70 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="block text-center mt-3 text-sm font-medium text-text-800 group-hover:text-primary-600 transition-colors">
                {region.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
