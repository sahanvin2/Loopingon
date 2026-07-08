import { Metadata } from "next";
import Link from "next/link";
import { Users, MessageSquare, BookOpen, Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Teams & Community - Kandyam",
  description: "Join the vibrant Kandyam seller community. Connect, learn, and grow your business with other successful sellers.",
};

export default function CommunityPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-900 py-24 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold md:text-6xl">
            Kandyam Community
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
            Connect with thousands of digital creators. Share software development tips, discuss game marketing, and grow your digital business together.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/sign-up/vendor"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary-900 transition-transform hover:scale-105"
            >
              Join the Community
            </Link>
            <Link
              href="/seller-handbook"
              className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Read the Handbook
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 text-center transition-shadow hover:shadow-soft-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-text-900">Seller Forums</h3>
              <p className="text-muted-600">
                Discuss strategies, share your milestones, and get advice from experienced sellers who have been in your shoes.
              </p>
            </div>
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 text-center transition-shadow hover:shadow-soft-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-text-900">Success Stories</h3>
              <p className="text-muted-600">
                Read inspiring stories from top Kandyam sellers and learn the exact strategies they used to scale their businesses.
              </p>
            </div>
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 text-center transition-shadow hover:shadow-soft-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-text-900">Developer Groups</h3>
              <p className="text-muted-600">
                Join niche-specific groups (like Indie Devs, SaaS Founders, or UI Designers) to network with peers and collaborate on launches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-surface-50 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Star className="mx-auto mb-8 h-12 w-12 text-yellow-400" />
          <blockquote className="font-serif text-2xl font-medium leading-relaxed text-text-900 md:text-4xl">
            "The Kandyam community was instrumental in helping me launch my software. The feedback I got during beta testing literally saved my project."
          </blockquote>
          <div className="mt-8">
            <div className="font-bold text-text-900">Alex Chen</div>
            <div className="text-muted-500">Top Rated Developer since 2026</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-text-900 md:text-5xl">Ready to start your journey?</h2>
          <p className="mt-6 text-lg text-muted-600">
            Join thousands of others turning their passion into a thriving business.
          </p>
          <Link
            href="/sell-on-kandyam"
            className="mx-auto mt-10 inline-flex items-center gap-2 rounded-full bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Start Selling Today <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
