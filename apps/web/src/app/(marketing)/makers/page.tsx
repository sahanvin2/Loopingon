"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Palette, Award, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const makers = [
  {
    id: 1,
    name: "Sunil Perera",
    craft: "Wood Carving",
    region: "Ambalangoda",
    rating: 4.9,
    reviews: 124,
    story: "Fourth-generation mask carver specializing in traditional Kolam masks. Sunil uses sustainable Kaduru wood and natural dyes.",
    image: "https://images.unsplash.com/photo-1544199981-5d9c22e4ebfe?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 2,
    name: "Kamala Silva",
    craft: "Batik",
    region: "Kandy",
    rating: 5.0,
    reviews: 89,
    story: "Kamala creates vibrant, intricate batik textiles using ancient wax-resist techniques passed down through her family.",
    image: "https://images.unsplash.com/photo-1595166258957-3aa5a176e330?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 3,
    name: "Nimal Fernando",
    craft: "Brassware",
    region: "Pilimathalawa",
    rating: 4.8,
    reviews: 210,
    story: "Master silversmith creating exquisite oil lamps and temple jewelry using centuries-old repoussé techniques.",
    image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 4,
    name: "Anura Rathnayake",
    craft: "Pottery",
    region: "Kegalle",
    rating: 4.9,
    reviews: 156,
    story: "Anura sources clay from local riverbanks to craft functional and decorative terracotta pieces, fired in traditional wood kilns.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 5,
    name: "Sriyani Peiris",
    craft: "Handloom",
    region: "Dumbara",
    rating: 5.0,
    reviews: 342,
    story: "Expert weaver preserving the unique geometric Dumbara patterns, weaving exclusively with pure cotton and natural fibers.",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f09?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 6,
    name: "Channa Bandara",
    craft: "Gem Cutting",
    region: "Ratnapura",
    rating: 4.9,
    reviews: 275,
    story: "A skilled lapidarist who expertly cuts and polishes ethically sourced Ceylon sapphires into breathtaking shapes.",
    image: "https://images.unsplash.com/photo-1530514115378-574308527a20?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 7,
    name: "Lakmini Rajapakse",
    craft: "Reed & Rush",
    region: "Galle",
    rating: 4.7,
    reviews: 64,
    story: "Lakmini weaves intricate baskets and mats using dried Indikola leaves, a sustainable craft unique to the southern coast.",
    image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 8,
    name: "Rohan De Silva",
    craft: "Leatherwork",
    region: "Colombo",
    rating: 4.8,
    reviews: 112,
    story: "Combines modern design with traditional saddle-stitching techniques to create durable, heirloom-quality leather goods.",
    image: "https://images.unsplash.com/photo-1588714099436-a365bbdc005e?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 9,
    name: "Malkanthi Wijesooriya",
    craft: "Beeralu Lace",
    region: "Matara",
    rating: 5.0,
    reviews: 93,
    story: "One of the last few masters of Beeralu (bobbin lace) making, intertwining dozens of threads into delicate patterns.",
    image: "https://images.unsplash.com/photo-1606131731446-5568d87113aa?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 10,
    name: "Nuwan Kumara",
    craft: "Cane Furniture",
    region: "Weweldeniya",
    rating: 4.9,
    reviews: 187,
    story: "Nuwan bends and weaves locally sourced rattan cane to create comfortable, tropical-inspired furniture pieces.",
    image: "https://images.unsplash.com/photo-1600860537233-04e3863486c4?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 11,
    name: "Deepika Senanayake",
    craft: "Spices & Teas",
    region: "Nuwara Eliya",
    rating: 4.9,
    reviews: 415,
    story: "Curates small-batch, hand-rolled teas and organic spice blends from her family's high-altitude estate.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 12,
    name: "Kasun Jayasuriya",
    craft: "Eco-Friendly Toys",
    region: "Moratuwa",
    rating: 4.8,
    reviews: 142,
    story: "Crafts safe, educational wooden toys for children using offcuts from the local furniture industry, painted with non-toxic colors.",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400&h=400",
  },
];

export default function MakersPage() {
  return (
    <main className="min-h-screen bg-surface-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-6">
            Meet the Makers
          </h1>
          <p className="text-lg text-text-600 leading-relaxed">
            Behind every piece on Kandyam is a skilled Sri Lankan artisan pouring their heart, heritage, and expertise into their craft. Discover their stories.
          </p>
        </div>

        {/* Makers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
          {makers.map((maker, idx) => (
            <motion.div
              key={maker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-soft-md border border-accent-100 hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-navy-900/10 group-hover:bg-transparent transition-colors z-10" />
                <img
                  src={maker.image}
                  alt={maker.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-navy-900">{maker.rating}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-serif font-bold text-navy-900">{maker.name}</h3>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                    <Palette className="w-3.5 h-3.5" />
                    {maker.craft}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-text-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {maker.region}
                  </div>
                </div>
                
                <p className="text-sm text-text-600 line-clamp-3 mb-6 leading-relaxed">
                  {maker.story}
                </p>
                
                <Link
                  href={`/vendors/${maker.name.toLowerCase().replace(" ", "-")}`}
                  className="flex items-center justify-between w-full py-2.5 px-4 border border-accent-200 rounded-xl text-sm font-medium text-navy-900 hover:border-primary-500 hover:text-primary-600 transition-colors group/btn"
                >
                  Visit Shop
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <Award className="w-12 h-12 text-primary-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Are you a Sri Lankan Artisan?
            </h2>
            <p className="text-navy-100 text-lg mb-10 leading-relaxed">
              Join Kandyam's community of talented makers. Turn your passion into a global business with our easy-to-use platform and dedicated support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sell-on-kandyam"
                className="px-8 py-3.5 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30 w-full sm:w-auto"
              >
                Become an Artisan
              </Link>
              <Link
                href="/about-us"
                className="px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-full font-medium hover:bg-white/20 transition-colors w-full sm:w-auto"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
