import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { get } from "@/lib/api-client";
import type { Competition, CompetitionEntry, ApiResponse, PaginatedResponse } from "@/types";
import { formatDate, getImageUrl, cn } from "@/lib/utils";

interface CompetitionDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CompetitionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await get<ApiResponse<Competition>>(`/competitions/${slug}`);
    return {
      title: res.data.title,
      description: res.data.description.substring(0, 160),
      openGraph: {
        title: res.data.title,
        description: res.data.description.substring(0, 160),
        images: res.data.bannerImage ? [{ url: getImageUrl(res.data.bannerImage), width: 1200, height: 630 }] : [],
      },
    };
  } catch {
    return { title: "Competition" };
  }
}

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-teal-100 text-teal-800",
  UPCOMING: "bg-blue-100 text-blue-800",
  JUDGING: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-charcoal-100 text-charcoal-600",
};

export default async function CompetitionDetailPage({ params }: CompetitionDetailPageProps) {
  const { slug } = await params;
  let competition: Competition | null = null;
  let entries: CompetitionEntry[] = [];

  try {
    const res = await get<ApiResponse<Competition>>(`/competitions/${slug}`);
    competition = res.data;
    const entryRes = await get<PaginatedResponse<CompetitionEntry>>(`/competitions/${competition.id}/entries`, { limit: 12 });
    entries = entryRes.data;
  } catch {
    notFound();
  }

  if (!competition) notFound();

  const isActive = competition.status === "ACTIVE";

  return (
    <>
      <div className="relative aspect-[21/9] overflow-hidden">
        {competition.bannerImage ? (
          <Image src={getImageUrl(competition.bannerImage)} alt={competition.title} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-terracotta-600 to-gold-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-charcoal-900/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <span className={cn("mb-4 inline-block rounded-full px-3 py-1 text-sm font-semibold", statusStyles[competition.status] || "bg-charcoal-100 text-charcoal-600")}>
            {competition.status === "ACTIVE" ? "Active" : competition.status === "UPCOMING" ? "Upcoming" : competition.status === "JUDGING" ? "Judging" : "Completed"}
          </span>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">{competition.title}</h1>
          {competition.theme && <p className="mt-2 text-lg text-cream-200">Theme: {competition.theme}</p>}
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-cream-300">
            <span>{formatDate(competition.startDate)} — {formatDate(competition.endDate)}</span>
            {competition.craftType && <span>· {competition.craftType}</span>}
          </div>
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">Description</h2>
                <p className="mt-3 leading-relaxed text-warm-gray-700 whitespace-pre-line">{competition.description}</p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">Rules</h2>
                <div className="mt-3 leading-relaxed text-warm-gray-700 whitespace-pre-line">{competition.rules}</div>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">Prizes</h2>
                <div className="mt-3">
                  <p className="leading-relaxed text-warm-gray-700">{competition.prizeDescription}</p>
                  {competition.prizeValue && (
                    <p className="mt-2 inline-block rounded-lg bg-gold-50 px-4 py-2 text-lg font-bold text-gold-700">Total Prize Value: {competition.prizeValue}</p>
                  )}
                </div>
              </section>

              {entries.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                    {isActive ? "Current Entries" : "Entries"}
                  </h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {entries.map((entry) => (
                      <div key={entry.id} className="overflow-hidden rounded-xl bg-cream-100 shadow-soft-sm">
                        <div className="relative aspect-[4/3] bg-warm-gray-200">
                          {entry.images[0] ? (
                            <Image src={getImageUrl(entry.images[0])} alt={entry.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-warm-gray-400">No Image</div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-serif text-base font-bold text-charcoal-900">{entry.title}</h3>
                          {entry.user && <p className="mt-1 text-xs text-warm-gray-500">by {entry.user.fullName}</p>}
                          <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="font-semibold text-terracotta-600">{entry.voteCount} votes</span>
                            {isActive && (
                              <button className="rounded-lg bg-terracotta-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-terracotta-700">
                                Vote
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl bg-cream-100 p-6">
                <h3 className="font-serif text-lg font-bold text-charcoal-900">Competition Details</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-warm-gray-500">Status</span><span className="font-medium text-charcoal-800">{competition.status}</span></div>
                  <div className="flex justify-between"><span className="text-warm-gray-500">Start Date</span><span className="font-medium text-charcoal-800">{formatDate(competition.startDate)}</span></div>
                  <div className="flex justify-between"><span className="text-warm-gray-500">End Date</span><span className="font-medium text-charcoal-800">{formatDate(competition.endDate)}</span></div>
                  <div className="flex justify-between"><span className="text-warm-gray-500">Max Entries</span><span className="font-medium text-charcoal-800">{competition.maxEntries}</span></div>
                  <div className="flex justify-between">
                    <span className="text-warm-gray-500">Entry Fee</span>
                    <span className="font-medium text-charcoal-800">{competition.isFreeEntry ? "Free" : `${competition.entryFee} LKR`}</span>
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="rounded-2xl bg-terracotta-50 p-6">
                  <h3 className="font-serif text-lg font-bold text-terracotta-800">Enter Competition</h3>
                  <p className="mt-2 text-sm text-terracotta-600">Submit your best handmade product for a chance to win.</p>
                  <Link href={`/competitions/${competition.slug}/enter`} className="mt-4 inline-block w-full rounded-lg bg-terracotta-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-terracotta-700">
                    Enter Competition
                  </Link>
                </div>
              )}

              {competition.status === "COMPLETED" && (
                <div className="rounded-2xl bg-gold-50 p-6">
                  <h3 className="font-serif text-lg font-bold text-gold-800">Winners Announced</h3>
                  <p className="mt-2 text-sm text-gold-600">This competition has ended. View the winning entries.</p>
                  <Link href={`/competitions/${competition.slug}/winners`} className="mt-4 inline-block w-full rounded-lg bg-gold-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-gold-600">
                    View Winners
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
