import React from "react";
import Link from "next/link";
import { ArrowRight, Code, Globe, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Our Story | Kandyam",
  description: "Learn about Kandyam's mission to empower digital creators globally.",
};

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-[#FCFDFD]">
      <section className="bg-[#0A2342] text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            We started Kandyam with a simple mission: to build the world's most creator-friendly digital marketplace.
          </p>
        </div>
      </section>

      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-6">Empowering the Digital Economy</h2>
            <p className="text-lg text-text-600 mb-4 leading-relaxed">
              Based in Rambukkana, Kegalle, Sri Lanka, Kandyam was founded to bridge the gap between talented software developers, game creators, and a global audience.
            </p>
            <p className="text-lg text-text-600 leading-relaxed">
              Today, our platform hosts over 100+ premium digital items, offering everything from indie games to enterprise software licenses, all with instant, secure delivery.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-50 p-6 rounded-2xl text-center">
              <Globe className="w-8 h-8 text-[#E63946] mx-auto mb-3" />
              <h3 className="font-bold text-navy-900">Global Reach</h3>
              <p className="text-sm text-text-500 mt-2">Serving customers in 150+ countries</p>
            </div>
            <div className="bg-surface-50 p-6 rounded-2xl text-center mt-8">
              <Code className="w-8 h-8 text-[#E63946] mx-auto mb-3" />
              <h3 className="font-bold text-navy-900">Digital First</h3>
              <p className="text-sm text-text-500 mt-2">Zero-waste automated delivery</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F5F1] py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-navy-900 mb-6">Join our journey</h2>
        <p className="text-lg text-text-600 max-w-2xl mx-auto mb-10">
          Whether you're looking for premium software or you're a creator looking to monetize your digital assets, there's a place for you here.
        </p>
        <Link href="/sell" className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#D92D3A] text-white font-bold px-8 py-4 rounded-full transition-all">
          Become a Seller <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </main>
  );
}
