"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const regions = [
  { name: "Kandy", image: "/images/regions/kandy.jpg", delay: 0.1 },
  { name: "Galle", image: "/images/regions/galle.jpg", delay: 0.2 },
  { name: "Jaffna", image: "/images/regions/jaffna.jpg", delay: 0.3 },
  { name: "Matara", image: "/images/regions/matara.jpg", delay: 0.4 },
  { name: "Anuradhapura", image: "/images/regions/anuradhapura.jpg", delay: 0.5 },
  { name: "Kurunegala", image: "/images/regions/kurunegala.jpg", delay: 0.6 },
];

export function ShopByRegion() {
  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-text-900 font-medium">
          Shop by Region 🇱🇰
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
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-soft group-hover:shadow-soft-md group-hover:border-primary-100 transition-all duration-300 relative bg-surface-200">
                <Image
                  src={region.image}
                  alt={`${region.name} crafts`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
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
