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
  description: "Join Kandyam craft competitions. Submit your best premium work, compete with fellow sellers, and win prizes. Current, upcoming, and past competitions.",
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-muted-100 text-muted-800 border-muted-200",
  UPCOMING: "bg-blue-100 text-blue-800 border-blue-200",
  JUDGING: "bg-purple-100 text-purple-800 border-purple-200",
  COMPLETED: "bg-text-100 text-text-600 border-text-200",
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
          <h2 className="mb-2 font-serif text-2xl font-bold text-text-900">Current Competitions</h2>
          <p className="mb-6 text-sm text-muted-500">Open now — submit your entry before the deadline!</p>
          <div className="grid gap-6 md:grid-cols-2">
            {active.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-2 font-serif text-2xl font-bold text-text-900">Upcoming</h2>
          <p className="mb-6 text-sm text-muted-500">Mark your calendar — these competitions start soon.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {upcoming.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-2 font-serif text-2xl font-bold text-text-900">Past Competitions</h2>
          <p className="mb-6 text-sm text-muted-500">See the winners and entries from previous competitions.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {past.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))}
          </div>
        </section>
      )}

      {competitions.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-500">No competitions available at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

function CompetitionCard({ competition }: { competition: Competition }) {
  return (
    <Link href={`/competitions/${competition.slug}`} className="group overflow-hidden rounded-xl bg-surface-50 shadow-soft-sm transition-shadow hover:shadow-soft">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted-200">
        {competition.bannerImage ? (
          <Image src={getImageUrl(competition.bannerImage)} alt={competition.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-400 to-accent-400" />
        )}
        <div className="absolute left-3 top-3">
          <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", statusStyles[competition.status] || statusStyles.UPCOMING)}>
            {competition.status === "ACTIVE" ? "Active" : competition.status === "UPCOMING" ? "Upcoming" : competition.status === "JUDGING" ? "Judging" : "Completed"}
          </span>
        </div>
      </div>
      <div className="p-5">
        {competition.craftType && (
          <span className="mb-2 inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600">{competition.craftType}</span>
        )}
        <h3 className="font-serif text-lg font-bold text-text-900 group-hover:text-primary-600 transition-colors">{competition.title}</h3>
        {competition.theme && <p className="mt-1 text-sm text-muted-500">Theme: {competition.theme}</p>}
        <p className="mt-2 text-sm leading-relaxed text-muted-600 line-clamp-2">{competition.description}</p>
        <div className="mt-4 border-t border-text-100 pt-3">
          <div className="flex justify-between text-xs text-muted-500">
            <span>{formatDate(competition.startDate)} — {formatDate(competition.endDate)}</span>
            {competition.prizeDescription && <span className="font-semibold text-accent-600">Prizes Available</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CompetitionsPage() {
  return (
    <>
      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-center font-serif text-4xl font-bold text-text-900 md:text-5xl">Craft Competitions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-600">
            Showcase your skills, compete with fellow sellers, and win exciting prizes.
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

      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-text-900">Want to compete?</h2>
          <p className="mt-3 text-muted-600">Sign up as a vendor on Kandyam to participate in competitions and showcase your best work.</p>
          <Link href="/sign-up/vendor" className="mt-6 inline-flex items-center rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-700">
            Become a Vendor
          </Link>
        </div>
      </section>
    </>
  );
}
