import Image from "next/image";
import Link from "next/link";
import { Factory, Users, Globe, Leaf, Heart, ShieldCheck, Package, TrendingUp } from "lucide-react";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Loopingon's mission to connect Sri Lankan artisans with the world. Discover our story, values, and the impact we're making in the artisan community.",
  openGraph: {
    title: "About Loopingon - Connecting Sri Lankan Artisans to the World",
    description: "Discover how Loopingon empowers Sri Lankan artisans through a global marketplace.",
  },
};

const stats = [
  { label: "Artisans", value: "4,500+", icon: Users },
  { label: "Products", value: "50,000+", icon: Package },
  { label: "Countries", value: "35+", icon: Globe },
  { label: "Revenue to Artisans", value: "රු 450M+", icon: TrendingUp },
];

const values = [
  {
    icon: Heart,
    title: "Authentic Craftsmanship",
    description: "Every product on Loopingon is handmade by skilled artisans using traditional techniques passed down through generations.",
  },
  {
    icon: Users,
    title: "Artisan-First",
    description: "We put artisans at the heart of everything. With 80% profit going directly to creators, we ensure sustainable livelihoods.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "From a village workshop in Kandy to a living room in London, we connect Sri Lankan craft with the world.",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Handmade means eco-friendly. Traditional crafts use natural, locally sourced materials with minimal environmental impact.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src="/images/about/sri-lanka-artisans.jpg"
          alt="Sri Lankan artisans at work"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 to-charcoal-900/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Our Story
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-cream-200">
            Connecting the timeless artistry of Sri Lanka with the world
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <p className="text-lg leading-relaxed text-muted-700">
              Loopingon was born from a simple observation: Sri Lanka is home to some of the
              world&apos;s most extraordinary craftsmanship, yet most artisans lacked access to
              global markets. Living in remote villages, their mastery of batik, wood carving,
              pottery, brass work, and countless other traditions remained hidden treasures.
            </p>
            <p className="text-lg leading-relaxed text-muted-700">
              Founded in 2020 by a team of passionate Sri Lankans, Loopingon set out to bridge this
              gap. We built a platform that handles everything — from digital storefronts and
              secure payments to international logistics — so artisans can focus on what they do
              best: creating beautiful, authentic crafts.
            </p>
            <p className="text-lg leading-relaxed text-muted-700">
              Today, over 4,500 artisans from all 25 districts of Sri Lanka showcase their work on
              Loopingon. From the batik workshops of Galle to the wood carving studios of Moratuwa,
              every product tells a story of tradition, skill, and dedication. Our mission remains
              unchanged: to preserve Sri Lankan craft heritage while creating sustainable livelihoods
              for the talented people behind every creation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-cream-50 p-8 md:p-10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100">
                <ShieldCheck className="h-6 w-6 text-rose-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-muted-700">
                To empower Sri Lankan artisans by providing them with a global digital marketplace,
                fair compensation, and the tools they need to preserve and share their cultural
                heritage with the world.
              </p>
            </div>
            <div className="rounded-2xl bg-cream-50 p-8 md:p-10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted-100">
                <Factory className="h-6 w-6 text-muted-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900">Our Vision</h2>
              <p className="mt-4 leading-relaxed text-muted-700">
                A world where traditional craft communities thrive economically, cultural heritage is
                celebrated globally, and every artisan has the opportunity to build a sustainable
                livelihood from their craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Loopingon */}
      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-charcoal-900 md:text-4xl">
            Why Loopingon?
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl bg-white p-6 text-center shadow-soft-sm transition-shadow hover:shadow-soft">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
                  <v.icon className="h-7 w-7 text-rose-600" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-800">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-rose-600 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-rose-200" />
                <p className="font-serif text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-rose-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-charcoal-900 md:text-4xl">
            Join Our Community
          </h2>
          <p className="mt-4 text-lg text-muted-600">
            Whether you&apos;re an artisan ready to share your craft or a customer seeking
            unique treasures, Loopingon welcomes you.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up/vendor"
              className="inline-flex w-full items-center justify-center rounded-lg bg-rose-600 px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-rose-700 sm:w-auto"
            >
              Start Selling
            </Link>
            <Link
              href="/products"
              className="inline-flex w-full items-center justify-center rounded-lg border border-charcoal-300 px-8 py-3.5 text-sm font-semibold text-charcoal-700 transition-all hover:bg-charcoal-50 sm:w-auto"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
