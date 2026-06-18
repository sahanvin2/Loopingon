import Image from "next/image";
import Link from "next/link";
import { Factory, Users, Globe, Leaf, Heart, ShieldCheck, Package, TrendingUp } from "lucide-react";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Kandyam's mission to connect Sri Lankan sellers with the world. Discover our story, values, and the impact we're making in the seller community.",
  openGraph: {
    title: "About Kandyam - Connecting Sri Lankan Sellers to the World",
    description: "Discover how Kandyam empowers Sri Lankan sellers through a global marketplace.",
  },
};

const stats = [
  { label: "Sellers", value: "4,500+", icon: Users },
  { label: "Products", value: "50,000+", icon: Package },
  { label: "Countries", value: "35+", icon: Globe },
  { label: "Revenue to Sellers", value: "Rs. 450M+", icon: TrendingUp },
];

const values = [
  {
    icon: Heart,
    title: "Authentic Craftsmanship",
    description: "Every product on Kandyam is handmade by skilled sellers using traditional techniques passed down through generations.",
  },
  {
    icon: Users,
    title: "Seller-First",
    description: "We put sellers at the heart of everything. With 80% profit going directly to creators, we ensure sustainable livelihoods.",
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
          alt="Sri Lankan sellers at work"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-text-900/60 to-text-900/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Our Story
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-surface-200">
            Connecting the timeless artistry of Sri Lanka with the world
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-surface-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <p className="text-lg leading-relaxed text-muted-700">
              Kandyam was born from a simple observation: Sri Lanka is home to some of the
              world&apos;s most extraordinary craftsmanship, yet most sellers lacked access to
              global markets. Living in remote villages, their mastery of batik, wood carving,
              pottery, brass work, and countless other traditions remained hidden treasures.
            </p>
            <p className="text-lg leading-relaxed text-muted-700">
              Founded in 2020 by a team of passionate Sri Lankans, Kandyam set out to bridge this
              gap. We built a platform that handles everything — from digital storefronts and
              secure payments to international logistics — so sellers can focus on what they do
              best: creating beautiful, authentic crafts.
            </p>
            <p className="text-lg leading-relaxed text-muted-700">
              Today, over 4,500 sellers from all 25 districts of Sri Lanka showcase their work on
              Kandyam. From the batik workshops of Galle to the wood carving studios of Moratuwa,
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
            <div className="rounded-2xl bg-surface-50 p-8 md:p-10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <ShieldCheck className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-text-900">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-muted-700">
                To empower Sri Lankan sellers by providing them with a global digital marketplace,
                fair compensation, and the tools they need to preserve and share their cultural
                heritage with the world.
              </p>
            </div>
            <div className="rounded-2xl bg-surface-50 p-8 md:p-10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted-100">
                <Factory className="h-6 w-6 text-muted-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-text-900">Our Vision</h2>
              <p className="mt-4 leading-relaxed text-muted-700">
                A world where traditional craft communities thrive economically, cultural heritage is
                celebrated globally, and every seller has the opportunity to build a sustainable
                livelihood from their craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kandyam */}
      <section className="bg-surface-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl font-bold text-text-900 md:text-4xl">
            Why Kandyam?
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl bg-white p-6 text-center shadow-soft-sm transition-shadow hover:shadow-soft">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                  <v.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-text-800">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary-200" />
                <p className="font-serif text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-primary-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-text-900 md:text-4xl">
            Join Our Community
          </h2>
          <p className="mt-4 text-lg text-muted-600">
            Whether you&apos;re a seller ready to share your craft or a customer seeking
            unique treasures, Kandyam welcomes you.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up/vendor"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-700 sm:w-auto"
            >
              Start Selling
            </Link>
            <Link
              href="/products"
              className="inline-flex w-full items-center justify-center rounded-lg border border-text-300 px-8 py-3.5 text-sm font-semibold text-text-700 transition-all hover:bg-text-50 sm:w-auto"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
