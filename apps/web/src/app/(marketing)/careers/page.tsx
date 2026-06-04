import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { MapPin, Clock, Briefcase, Mail, Heart, Users, Globe, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers - Join Our Mission",
  description: "Join the Loopingon team and help connect Sri Lankan artisans with the world. Explore open positions in Colombo, Sri Lanka.",
};

const values = [
  { icon: Heart, title: "Passion for Impact", description: "We're driven by the mission to transform artisan livelihoods across Sri Lanka." },
  { icon: Users, title: "Community First", description: "Every decision we make prioritizes our artisan community and their families." },
  { icon: Globe, title: "Think Global", description: "We build for a worldwide audience while staying deeply rooted in Sri Lankan culture." },
  { icon: Lightbulb, title: "Innovation", description: "We combine traditional craft with modern technology to create something extraordinary." },
];

const positions = [
  { title: "Senior Full-Stack Engineer", department: "Engineering", location: "Colombo, Sri Lanka", type: "Full-time", description: "Build and scale our marketplace platform using Next.js, Node.js, and PostgreSQL. Work on features that directly impact thousands of artisans." },
  { title: "Community Manager", department: "Operations", location: "Colombo, Sri Lanka", type: "Full-time", description: "Engage with our artisan community, organize events, manage social media, and be the voice of Loopingon to our vendor base." },
  { title: "Content Writer (English & Sinhala)", department: "Marketing", location: "Colombo, Sri Lanka", type: "Full-time", description: "Create compelling content about Sri Lankan crafts, artisan stories, and cultural heritage. Bilingual proficiency in English and Sinhala required." },
  { title: "Customer Support Specialist", department: "Support", location: "Colombo, Sri Lanka", type: "Full-time", description: "Provide exceptional support to buyers and vendors via chat, email, and WhatsApp. Resolve issues and ensure a great marketplace experience." },
];

export default function CareersPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-text-900">
        <div className="absolute inset-0">
          <Image src="/images/careers/team-sri-lanka.jpg" alt="Loopingon team" fill className="object-cover opacity-30" priority sizes="100vw" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center md:py-32">
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">Join Our Mission</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-200">
            Help us connect Sri Lankan artisans with the world. We&apos;re a team of passionate
            individuals building the future of ethical, handmade commerce.
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
          <p className="mt-2 text-center text-muted-600">Based in Colombo, Sri Lanka</p>
          <div className="mt-10 space-y-6">
            {positions.map((pos) => (
              <div key={pos.title} className="rounded-xl bg-white p-6 shadow-soft-sm transition-shadow hover:shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-text-900">{pos.title}</h3>
                    <p className="mt-1 text-sm text-primary-600">{pos.department}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-600">{pos.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-500">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {pos.location}</span>
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" /> {pos.type}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-primary-50 p-8 text-center">
            <Mail className="mx-auto h-8 w-8 text-primary-600" />
            <h3 className="mt-4 font-serif text-xl font-bold text-text-900">Don&apos;t see the right role?</h3>
            <p className="mt-2 text-muted-600">
              We&apos;re always looking for talented people. Send your CV and tell us how you can contribute.
            </p>
            <a href="mailto:careers@loopingon.com" className="mt-4 inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
              careers@loopingon.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
