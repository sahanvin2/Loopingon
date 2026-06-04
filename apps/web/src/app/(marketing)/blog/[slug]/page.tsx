import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { get } from "@/lib/api-client";
import type { BlogPost, ApiResponse } from "@/types";
import { formatDate, getImageUrl } from "@/lib/utils";
import { ShareButtons } from "@/components/product/share-buttons";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await get<ApiResponse<BlogPost>>(`/blog/${slug}`);
    const post = res.data;
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || "",
        type: "article",
        publishedTime: post.publishedAt || undefined,
        images: post.featuredImage ? [{ url: getImageUrl(post.featuredImage), width: 1200, height: 630 }] : [],
      },
    };
  } catch {
    return { title: "Blog Post" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post: BlogPost | null = null;

  try {
    const res = await get<ApiResponse<BlogPost>>(`/blog/${slug}`);
    post = res.data;
  } catch {
    notFound();
  }

  if (!post) notFound();

  return (
    <article className="bg-white">
      <div className="relative aspect-[21/9] overflow-hidden bg-muted-200">
        {post.featuredImage ? (
          <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-600 to-accent-500">
            <span className="font-serif text-4xl font-bold text-white/30">{post.title.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>
          Back to Blog
        </Link>

        <h1 className="font-serif text-3xl font-bold text-text-900 md:text-4xl">{post.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-600">
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          {post.category && (
            <>
              <span>·</span>
              <span className="rounded-full bg-primary-50 px-3 py-0.5 text-xs font-medium text-primary-600">{post.category}</span>
            </>
          )}
          <span>·</span>
          <span>5 min read</span>
        </div>

        <div className="mt-10 prose-headings:font-serif prose-a:text-primary-600 prose-p:leading-relaxed prose-img:rounded-xl max-w-none text-muted-700 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text-900 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text-800 [&_p]:text-base [&_p]:leading-7 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-accent-400 [&_blockquote]:bg-surface-50 [&_blockquote]:py-4 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-muted-600 [&_img]:my-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-10 border-t border-text-200 pt-6">
          <div className="flex items-center justify-between">
            <ShareButtons url={`https://loopingon.com/blog/${post.slug}`} title={post.title} />
            <Link href="/blog" className="text-sm font-medium text-primary-600 hover:underline">
              ← Back to all posts
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
