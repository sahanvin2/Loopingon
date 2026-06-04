import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { get } from "@/lib/api-client";
import type { BlogPost, PaginatedResponse } from "@/types";
import { formatDate, getImageUrl, truncate } from "@/lib/utils";
import { Badge } from "@/components/shared/badge";
import { Pagination } from "@/components/shared/pagination";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Blog - Stories of Sri Lankan Craft & Culture",
  description: "Read stories about Sri Lankan crafts, artisan profiles, craft techniques, cultural heritage, and the Loopingon community.",
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  let posts: BlogPost[] = [];
  let totalPages = 1;
  let featuredPost: BlogPost | null = null;

  try {
    const res = await get<PaginatedResponse<BlogPost>>("/blog", { page, limit: 9 });
    posts = res.data;
    totalPages = res.meta.totalPages;
    if (posts.length > 0 && page === 1) {
      featuredPost = posts[0];
      posts = posts.slice(1);
    }
  } catch {}

  return (
    <>
      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-center font-serif text-4xl font-bold text-text-900 md:text-5xl">
            Stories of Craft & Culture
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-600">
            Discover the stories behind Sri Lankan crafts, meet the artisans, and explore the
            rich cultural heritage woven into every handmade creation.
          </p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className="group mb-12 block overflow-hidden rounded-2xl">
              <div className="relative aspect-[21/9] overflow-hidden bg-muted-200">
                {featuredPost.featuredImage ? (
                  <Image src={getImageUrl(featuredPost.featuredImage)} alt={featuredPost.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" priority sizes="100vw" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-600 to-accent-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-text-900/80 via-text-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  {featuredPost.category && (
                    <span className="mb-3 inline-block rounded-full bg-accent-400 px-3 py-1 text-xs font-semibold text-text-900">
                      {featuredPost.category}
                    </span>
                  )}
                  <h2 className="font-serif text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.excerpt && (
                    <p className="mt-2 max-w-2xl text-sm text-surface-200 md:text-base">
                      {truncate(featuredPost.excerpt, 160)}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-surface-300">
                    {featuredPost.publishedAt && formatDate(featuredPost.publishedAt)}
                    {" · "}5 min read
                  </p>
                </div>
              </div>
            </Link>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-xl bg-surface-50 shadow-soft-sm transition-shadow hover:shadow-soft">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted-200">
                    {post.featuredImage ? (
                      <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-400 to-accent-400" />
                    )}
                  </div>
                  <div className="p-5">
                    {post.category && (
                      <span className="mb-2 inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600">
                        {post.category}
                      </span>
                    )}
                    <h3 className="font-serif text-lg font-bold text-text-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-500">
                      <span>{post.publishedAt && formatDate(post.publishedAt)}</span>
                      <span>·</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <LoadingSkeleton variant="card" count={6} />
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} baseUrl="/blog" />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
