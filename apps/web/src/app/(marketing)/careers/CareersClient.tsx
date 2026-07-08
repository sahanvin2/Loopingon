"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Briefcase, Mail, Heart, Users, Globe, Lightbulb } from "lucide-react";
import { get } from "@/lib/api-client";
import { Badge } from "@/components/shared/badge";

const values = [
  { icon: Heart, title: "Passion for Impact", description: "We're driven by the mission to transform digital creator livelihoods globally." },
  { icon: Users, title: "Community First", description: "Every decision we make prioritizes our seller community." },
  { icon: Globe, title: "Think Global", description: "We build for a worldwide audience." },
  { icon: Lightbulb, title: "Innovation", description: "We combine creativity with modern technology to create something extraordinary." },
];

export default function CareersClient() {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await get<any>("/jobs?includeClosed=true");
        setPositions(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-text-900">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=800&fit=crop" alt="Team" fill className="object-cover opacity-30" priority sizes="100vw" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center md:py-32">
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">Join Our Mission</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-200">
            Help us connect digital creators with the world. We're a team of passionate individuals building the future of digital commerce.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-text-900">What We Stand For</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl bg-surface-50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                  <v.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-text-800">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-text-900">Open Positions</h2>
          <p className="mt-2 text-center text-muted-600">Based in Rambukkana, Kegalle</p>
          <div className="mt-10 space-y-6">
            {loading ? (
              <p className="text-center text-muted-500">Loading open positions...</p>
            ) : positions.length === 0 ? (
              <p className="text-center text-muted-500">There are currently no positions available. Check back soon!</p>
            ) : (
              positions.map((pos) => (
                <div key={pos.id} className={`rounded-xl bg-white p-6 shadow-soft-sm transition-shadow ${!pos.isOpen ? 'opacity-70' : 'hover:shadow-soft'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif text-xl font-bold text-text-900">{pos.title}</h3>
                        {!pos.isOpen && <Badge variant="muted">Closed</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-primary-600">{pos.department}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-600">{pos.description}</p>
                    </div>
                    {pos.isOpen && (
                      <a href={`mailto:careers@kandyam.com?subject=Application for ${pos.title}`} className="inline-block rounded-lg bg-[#E63946] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#D92D3A]">
                        Apply Now
                      </a>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {pos.location}</span>
                    <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" /> {pos.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-16 rounded-2xl bg-primary-50 p-8 text-center">
            <Mail className="mx-auto h-8 w-8 text-primary-600" />
            <h3 className="mt-4 font-serif text-xl font-bold text-text-900">Don't see the right role?</h3>
            <p className="mt-2 text-muted-600">
              We're always looking for talented people. Send your CV and tell us how you can contribute.
            </p>
            <a href="mailto:careers@kandyam.com" className="mt-4 inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
              careers@kandyam.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
