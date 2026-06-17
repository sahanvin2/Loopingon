import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Camera, Search, TrendingUp, ShieldCheck, ArrowRight, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Seller Handbook - Kandyam",
  description: "The ultimate guide to running a successful shop on Kandyam. Learn about SEO, photography, shipping, and marketing.",
};

const guides = [
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Product Photography",
    description: "Learn how to take professional-quality photos using just your smartphone. Lighting, angles, and staging tips.",
    href: "#photography"
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Search Engine Optimization",
    description: "Master Kandyam search. Learn how to write compelling titles and use tags to get found by more buyers.",
    href: "#seo"
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: "Shipping & Fulfillment",
    description: "Best practices for packaging securely, choosing the right couriers, and managing international shipments.",
    href: "#shipping"
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Marketing Your Shop",
    description: "How to use social media, email newsletters, and Kandyam Ads to drive consistent traffic to your listings.",
    href: "#marketing"
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Trust & Safety",
    description: "Understanding our policies, handling disputes professionally, and protecting your seller account.",
    href: "#safety"
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Shop Management",
    description: "Tips on managing inventory, pricing strategies, and providing world-class customer service.",
    href: "#management"
  }
];

export default function SellerHandbookPage() {
  return (
    <div className="bg-surface-50">
      {/* Hero Section */}
      <section className="bg-white py-20 border-b border-surface-200">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="text-sm font-bold tracking-wider text-primary-600 uppercase">Education & Resources</span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-text-900 md:text-5xl">
            The Seller Handbook
          </h1>
          <p className="mt-6 text-lg text-muted-600">
            Everything you need to know about starting, running, and scaling your business on Kandyam. Expert advice and actionable tips.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-soft-sm transition-all hover:-translate-y-1 hover:shadow-soft-lg">
                <div className="mb-6 inline-flex rounded-xl bg-primary-50 p-4 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {guide.icon}
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold text-text-900">{guide.title}</h3>
                <p className="mb-6 text-muted-600 line-clamp-3">
                  {guide.description}
                </p>
                <Link href={guide.href} className="inline-flex items-center text-sm font-bold text-primary-600 group-hover:text-primary-700">
                  Read Guide <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">Get Seller Tips in Your Inbox</h2>
          <p className="mt-4 text-primary-100">
            Subscribe to the Seller Success Newsletter for weekly advice, trend reports, and platform updates.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full max-w-sm rounded-lg px-4 py-3 text-text-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="rounded-lg bg-accent-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-600">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
