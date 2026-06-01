import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { get } from "@/lib/api-client";
import type { Competition, PaginatedResponse } from "@/types";
import { formatDate, getImageUrl } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/shared/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Craft Competitions - Showcase Your Skills",
  description: "Join Loopingon craft competitions. Submit your best handmade work, compete with fellow artisans, and win prizes. Current, upcoming, and past competitions.",
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-teal-100 text-teal-800 border-teal-200",
  UPCOMING: "bg-blue-100 text-blue-800 border-blue-200",
  JUDGING: "bg-purple-100 text-purple-800 border-purple-200",
  COMPLETED: "bg-charcoal-100 text-charcoal-600 border-charcoal-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

async function CompetitionsList() {
  let competitions: Competition[] = [];
  try {
    const res = await get<PaginatedResponse<Competition>>("/competitions", { limit: 20 });
    competitions = res.data;
  } catch {}

  const active = competitions.filter((c) => c.status === "ACTIVE");
  const upcoming = competitions.filter((c) => c.status === "UPCOMING");
  const past = competitions.filter((c) => c.status === "COMPLETED" || c.status === "JUDGING");

  return (
    <div className="space-y-16">
      {active.length > 0 && (
        <section>
          <h2 className="mb-2 font-serif text-2xl font-bold text-charcoal-900">Current Competitions</h2>
          <p className="mb-6 text-sm text-warm-gray-500">Open now — submit your entry before the deadline!</p>
          <div className="grid gap-6 md:grid-cols-2">
            {active.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-2 font-serif text-2xl font-bold text-charcoal-900">Upcoming</h2>
          <p className="mb-6 text-sm text-warm-gray-500">Mark your calendar — these competitions start soon.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {upcoming.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-2 font-serif text-2xl font-bold text-charcoal-900">Past Competitions</h2>
          <p className="mb-6 text-sm text-warm-gray-500">See the winners and entries from previous competitions.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {past.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))}
          </div>
        </section>
      )}

      {competitions.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-warm-gray-500">No competitions available at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

function CompetitionCard({ competition }: { competition: Competition }) {
  return (
    <Link href={`/competitions/${competition.slug}`} className="group overflow-hidden rounded-xl bg-cream-100 shadow-soft-sm transition-shadow hover:shadow-soft">
      <div className="relative aspect-[16/9] overflow-hidden bg-warm-gray-200">
        {competition.bannerImage ? (
          <Image src={getImageUrl(competition.bannerImage)} alt={competition.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-terracotta-400 to-gold-400" />
        )}
        <div className="absolute left-3 top-3">
          <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", statusStyles[competition.status] || statusStyles.UPCOMING)}>
            {competition.status === "ACTIVE" ? "Active" : competition.status === "UPCOMING" ? "Upcoming" : competition.status === "JUDGING" ? "Judging" : "Completed"}
          </span>
        </div>
      </div>
      <div className="p-5">
        {competition.craftType && (
          <span className="mb-2 inline-block rounded-full bg-terracotta-50 px-2.5 py-0.5 text-xs font-medium text-terracotta-600">{competition.craftType}</span>
        )}
        <h3 className="font-serif text-lg font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">{competition.title}</h3>
        {competition.theme && <p className="mt-1 text-sm text-warm-gray-500">Theme: {competition.theme}</p>}
        <p className="mt-2 text-sm leading-relaxed text-warm-gray-600 line-clamp-2">{competition.description}</p>
        <div className="mt-4 border-t border-charcoal-100 pt-3">
          <div className="flex justify-between text-xs text-warm-gray-500">
            <span>{formatDate(competition.startDate)} — {formatDate(competition.endDate)}</span>
            {competition.prizeDescription && <span className="font-semibold text-gold-600">Prizes Available</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CompetitionsPage() {
  return (
    <>
      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-center font-serif text-4xl font-bold text-charcoal-900 md:text-5xl">Craft Competitions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-warm-gray-600">
            Showcase your skills, compete with fellow artisans, and win exciting prizes.
            Join our monthly craft challenges and let your work shine.
          </p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <Suspense fallback={<LoadingSkeleton variant="card" count={4} />}>
            <CompetitionsList />
          </Suspense>
        </div>
      </section>

      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Want to compete?</h2>
          <p className="mt-3 text-warm-gray-600">Sign up as a vendor on Loopingon to participate in competitions and showcase your best work.</p>
          <Link href="/sign-up/vendor" className="mt-6 inline-flex items-center rounded-lg bg-terracotta-600 px-8 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-terracotta-700">
            Become a Vendor
          </Link>
        </div>
      </section>
    </>
  );
}
