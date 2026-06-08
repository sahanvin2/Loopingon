import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Search, ThumbsUp, ThumbsDown } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface HelpArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: HelpArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${title} | Kandyam Help Center`,
  };
}

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  const { slug } = await params;

  // Mock content generation based on slug
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  
  // Basic validation just to ensure we don't render pure gibberish, 
  // in a real app this would query a CMS
  if (!slug) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-text-500 mb-8" aria-label="Breadcrumb">
          <Link href="/help-center" className="hover:text-primary-600 transition-colors">
            Help Center
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-accent-300" />
          <Link href={`/help-center?category=${slug.split('-')[0]}`} className="hover:text-primary-600 transition-colors capitalize">
            Articles
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-accent-300" />
          <span className="text-navy-900 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
            {title}
          </span>
        </nav>

        {/* Article Container */}
        <div className="bg-white rounded-2xl shadow-soft-sm border border-accent-100 overflow-hidden">
          {/* Header */}
          <div className="p-8 sm:p-12 border-b border-accent-100 bg-surface-50/30">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-4">
              {title}
            </h1>
            <div className="flex items-center text-sm text-text-500">
              <span>Last updated: 2 days ago</span>
              <span className="mx-3 text-accent-300">•</span>
              <span>3 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-12 prose prose-lg prose-headings:font-serif prose-headings:text-navy-900 prose-a:text-primary-600 hover:prose-a:text-primary-700 max-w-none text-text-600">
            <p className="lead text-xl text-text-700 mb-8">
              This guide provides comprehensive information regarding {title.toLowerCase()} on the Kandyam platform.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">Overview</h2>
            <p>
              At Kandyam, we strive to ensure that both our artisans and customers have a seamless experience. 
              Understanding how {title.toLowerCase()} works is essential to making the most out of our marketplace.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">Step-by-Step Instructions</h2>
            <ol className="list-decimal pl-6 space-y-4 mb-8">
              <li>Log in to your Kandyam account and navigate to your dashboard.</li>
              <li>Locate the relevant section related to {title.toLowerCase()}.</li>
              <li>Review the provided documentation and ensure all prerequisites are met.</li>
              <li>Submit your request or finalize your settings. Changes typically take effect immediately.</li>
            </ol>

            <div className="bg-primary-50 border-l-4 border-primary-500 p-6 rounded-r-lg my-8">
              <h4 className="text-primary-900 font-bold m-0 mb-2">Important Note</h4>
              <p className="text-primary-800 m-0 text-base">
                If you encounter any persistent issues while following this guide, please do not hesitate to contact our support team. We are available 24/7 to assist you.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Encountered Scenarios</h2>
            <p>
              Many users frequently ask about the nuances of this process. The system is designed to automatically detect errors. If you see a warning banner, refer to the <Link href="/faq">FAQ page</Link> for detailed troubleshooting steps.
            </p>
          </div>

          {/* Feedback Section */}
          <div className="px-8 py-8 sm:px-12 border-t border-accent-100 bg-surface-50 text-center">
            <h3 className="text-lg font-medium text-navy-900 mb-4">Was this article helpful?</h3>
            <div className="flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-accent-200 bg-white hover:border-primary-500 hover:text-primary-600 transition-colors text-text-600 font-medium shadow-sm">
                <ThumbsUp className="w-4 h-4" /> Yes
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-accent-200 bg-white hover:border-text-400 hover:text-text-700 transition-colors text-text-600 font-medium shadow-sm">
                <ThumbsDown className="w-4 h-4" /> No
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex justify-center">
          <Link href="/help-center" className="flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Help Center
          </Link>
        </div>
      </div>
    </main>
  );
}
