import React from "react";
import Link from "next/link";
import { BookOpen, TrendingUp, Camera, MessageSquare, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Seller Handbook | Kandyam",
  description: "Your comprehensive guide to running a successful shop on Kandyam.",
};

const GUIDES = [
  { icon: Camera, title: "Photography Guide", desc: "Learn how to take stunning product photos that sell." },
  { icon: TrendingUp, title: "SEO Basics", desc: "Optimize your listings to get found in search results." },
  { icon: MessageSquare, title: "Customer Service", desc: "Best practices for communicating with buyers." },
  { icon: BookOpen, title: "Shop Policies", desc: "How to write clear and fair policies for your shop." },
];

export default function HandbookPage() {
  return (
    <main className="min-h-screen bg-[#FCFDFD] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="bg-[#E2F0F1] rounded-3xl p-10 md:p-16 mb-16 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 mb-6">The Seller Handbook</h1>
            <p className="text-lg font-medium text-text-700 mb-8">
              Everything you need to know to start, manage, and grow your business on Kandyam. From beginner guides to advanced strategies.
            </p>
            <div className="relative max-w-md">
              <input type="text" placeholder="Search the handbook..." className="w-full h-12 rounded-full pl-6 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#62A7B0]" />
              <button className="absolute right-3 top-3 text-[#62A7B0]">
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-8">Essential Reading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GUIDES.map((guide) => (
            <Link key={guide.title} href="#" className="group bg-white border border-surface-200 rounded-2xl p-6 hover:shadow-md hover:border-[#62A7B0]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-surface-50 flex items-center justify-center mb-6 group-hover:bg-[#62A7B0] group-hover:text-white transition-colors text-[#62A7B0]">
                <guide.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-navy-900 mb-2">{guide.title}</h3>
              <p className="text-sm font-medium text-text-600 leading-relaxed">{guide.desc}</p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
