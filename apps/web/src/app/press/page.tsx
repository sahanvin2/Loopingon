import React from "react";

export const metadata = {
  title: "Press | Kandyam",
  description: "Press releases and media kit for Kandyam digital marketplace.",
};

export default function PressPage() {
  return (
    <main className="min-h-[70vh] bg-[#FCFDFD] py-24">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-5xl font-bold text-navy-900 mb-6">Press & Media</h1>
        <p className="text-lg text-text-600 mb-12">
          For all press inquiries, interview requests, and media assets, please contact us at <a href="mailto:press@kandyam.com" className="text-[#E63946] hover:underline">press@kandyam.com</a>.
        </p>
        
        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">Recent Releases</h2>
        <div className="bg-surface-50 p-6 rounded-2xl border border-surface-200">
          <p className="text-sm text-muted-500 mb-2">June 2026</p>
          <h3 className="font-bold text-lg text-navy-900 mb-2">Kandyam Pivots to Digital Goods Platform</h3>
          <p className="text-text-600">
            Kandyam officially launches its new 100% digital marketplace, focusing on software licenses, game keys, and zero-waste automated delivery. Based in Rambukkana, Sri Lanka, the company aims to empower creators globally.
          </p>
        </div>
      </div>
    </main>
  );
}
