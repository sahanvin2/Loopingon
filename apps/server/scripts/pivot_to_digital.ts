import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const digitalCategories = [
  { name: "Games", slug: "games", description: "PC and console games" },
  { name: "Gift Cards", slug: "gift-cards", description: "Digital gift cards for top brands" },
  { name: "Software", slug: "software", description: "Operating systems, productivity software, and tools" },
  { name: "AI", slug: "ai", description: "AI prompts, models, and tools" },
  { name: "Education", slug: "education", description: "Online courses, tutorials, and ebooks" },
  { name: "Design Assets", slug: "design-assets", description: "Graphics, templates, and fonts" },
  { name: "Web Development", slug: "web-development", description: "Themes, plugins, and scripts" },
  { name: "Mobile Apps", slug: "mobile-apps", description: "Source code and templates for mobile apps" },
  { name: "Business Tools", slug: "business-tools", description: "Spreadsheets, templates, and planners" },
  { name: "Streaming", slug: "streaming", description: "Streaming subscriptions and accounts" },
  { name: "Freelance Services", slug: "freelance-services", description: "Hire freelancers for digital work" },
  { name: "Digital Downloads", slug: "digital-downloads", description: "Other digital products" },
];

async function main() {
  console.log("Starting pivot to digital marketplace...");

  try {
    console.log("Deleting existing products...");
    await prisma.product.deleteMany();
    
    console.log("Deleting existing categories...");
    await prisma.category.deleteMany();

    console.log("Inserting new digital categories...");
    for (const category of digitalCategories) {
      await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          isActive: true,
        },
      });
      console.log(`Created category: ${category.name}`);
    }

    console.log("Pivot complete! Database is now configured for a digital marketplace.");
  } catch (error) {
    console.error("Error during pivot:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
