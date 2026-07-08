import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Camera, Search, TrendingUp, ShieldCheck, ArrowRight, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Seller Handbook - Kandyam",
  description: "The ultimate guide to running a successful digital shop on Kandyam. Learn about SEO, digital assets, licensing, and marketing.",
};

const guides = [
  {
    id: "digital-assets",
    icon: <Camera className="h-6 w-6" />,
    title: "Digital Assets & Covers",
    description: "Learn how to create high-quality cover images, gameplay screenshots, and promotional trailers for your software.",
    href: "#digital-assets",
    content: "Great visuals are crucial for selling digital goods. Ensure your cover images are high resolution and accurately represent the software or game. Include screenshots of the actual UI or gameplay so buyers know what they are getting. A short promotional trailer or demo video can increase conversion rates significantly."
  },
  {
    id: "seo",
    icon: <Search className="h-6 w-6" />,
    title: "Search Engine Optimization",
    description: "Master Kandyam search. Learn how to write compelling titles and use tags to get found by more buyers.",
    href: "#seo",
    content: "When naming your digital products, use clear and descriptive titles that include what the item is (e.g., 'Steam Key', 'Windows License'). Avoid 'cute' names that a buyer would never type into a search bar. Utilize all available tags, and ensure your descriptions list system requirements, language support, and DRM details."
  },
  {
    id: "delivery",
    icon: <Package className="h-6 w-6" />,
    title: "Instant Delivery & Licensing",
    description: "Best practices for managing license keys, secure downloads, and automated delivery.",
    href: "#delivery",
    content: "Our platform handles automated delivery, but you must ensure your stock of keys is accurate. If you are selling direct downloads, ensure your files are virus-scanned, compressed efficiently, and hosted securely. Always provide clear activation instructions for license keys."
  },
  {
    id: "marketing",
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Marketing Your Shop",
    description: "How to use social media, Twitch streams, and Kandyam Ads to drive consistent traffic to your listings.",
    href: "#marketing",
    content: "Leverage Twitch, YouTube, and X (Twitter) to show gameplay or software tutorials. Link your Kandyam store in your bio and video descriptions. Engage with potential customers by responding to comments and offering beta access or giveaways to increase your follower base. Participate in our seasonal gaming sales."
  },
  {
    id: "safety",
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Trust & Safety",
    description: "Understanding our policies, handling disputes professionally, and protecting your seller account.",
    href: "#safety",
    content: "Always communicate with buyers through the Kandyam platform to ensure a record of conversation. If a dispute arises over a claimed 'invalid key', remain professional and use our dispute resolution tools. Familiarize yourself with our Anti-Fraud and Digital Delivery policies to ensure your store remains in good standing."
  },
  {
    id: "management",
    icon: <BookOpen className="h-6 w-6" />,
    title: "Shop Management",
    description: "Tips on managing key inventory, regional pricing strategies, and providing world-class support.",
    href: "#management",
    content: "Check your dashboard daily for low-stock alerts on your license keys. Use our regional pricing tools to offer fair prices across different currencies. Provide clear documentation and fast technical support to minimize refund requests and maintain a high rating."
  }
];


export default function SellerHandbookPage() {
  return (
    <div className="bg-surface-50 pb-20">
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

      {/* Detailed Content Sections */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="space-y-16">
          {guides.map((guide) => (
            <div key={guide.id} id={guide.id} className="scroll-mt-24 rounded-2xl bg-white p-8 md:p-10 shadow-soft-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="inline-flex rounded-xl bg-primary-50 p-3 text-primary-600">
                  {guide.icon}
                </div>
                <h2 className="font-serif text-2xl font-bold text-text-900">{guide.title}</h2>
              </div>
              <p className="text-muted-700 leading-relaxed text-lg">
                {guide.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary-900 text-white rounded-3xl mx-4 lg:mx-auto lg:max-w-7xl">
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
