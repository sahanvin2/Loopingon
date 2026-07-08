import React from "react";
import Link from "next/link";
import { DollarSign, Share2, Award, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Affiliate Program | Kandyam",
  description: "Earn commission by sharing your favorite Kandyam digital products with your audience.",
};

export default function AffiliatePage() {
  return (
    <main className="min-h-screen bg-[#FCFDFD] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="bg-[#0A2342] rounded-3xl p-10 md:p-16 mb-16 relative overflow-hidden flex flex-col items-center text-center">
          <div className="relative z-10 max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">Earn With Kandyam</h1>
            <p className="text-lg font-medium text-white/80 mb-10">
              Join the Kandyam Affiliate Program and earn commission on every sale generated through your unique links. Perfect for gaming bloggers, tech influencers, and streamers.
            </p>
            <Link href="#" className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#D92D3A] text-white font-bold px-8 py-4 rounded-full transition-all">
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <h2 className="font-serif text-3xl font-bold text-navy-900 text-center mb-16">How it works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E2F0F1] flex items-center justify-center mb-6">
              <Share2 className="w-8 h-8 text-[#62A7B0]" />
            </div>
            <h3 className="font-bold text-xl text-navy-900 mb-3">1. Share</h3>
            <p className="text-text-600 font-medium">Generate unique tracking links and share them on your blog, social media, or website.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F2EAE1] flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-[#F4A261]" />
            </div>
            <h3 className="font-bold text-xl text-navy-900 mb-3">2. Inspire</h3>
            <p className="text-text-600 font-medium">Help your audience discover incredible software, games, and digital keys they'll love.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FCECEE] flex items-center justify-center mb-6">
              <DollarSign className="w-8 h-8 text-[#E63946]" />
            </div>
            <h3 className="font-bold text-xl text-navy-900 mb-3">3. Earn</h3>
            <p className="text-text-600 font-medium">Earn up to 10% commission on qualifying purchases made through your links.</p>
          </div>
        </div>

      </div>
    </main>
  );
}
