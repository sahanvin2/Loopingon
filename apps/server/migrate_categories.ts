import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NEW_CATEGORIES = [
  { name: "Accessories", slug: "accessories", description: "Handbags, hats, sunglasses, and personal accessories." },
  { name: "Art & Collectibles", slug: "art-collectibles", description: "Fine art, prints, and rare collectibles." },
  { name: "Bags & Purses", slug: "bags-purses", description: "Totes, backpacks, and stylish purses." },
  { name: "Bath & Beauty", slug: "bath-beauty", description: "Skincare, soaps, and beauty essentials." },
  { name: "Books, Movies & Music", slug: "books-movies-music", description: "Media, literature, and entertainment." },
  { name: "Clothing", slug: "clothing", description: "Fashion, apparel, and wearables." },
  { name: "Craft Supplies & Tools", slug: "craft-supplies-tools", description: "Materials and tools for makers." },
  { name: "Electronics & Accessories", slug: "electronics-accessories", description: "Gadgets, tech, and digital accessories." },
  { name: "Gifts", slug: "gifts", description: "Perfect gifts for any occasion." },
  { name: "Home & Living", slug: "home-living", description: "Decor, furniture, and home essentials." },
  { name: "Jewelry", slug: "jewelry", description: "Necklaces, rings, and fine jewelry." },
  { name: "Kids & Baby", slug: "kids-baby", description: "Clothing, toys, and essentials for children." },
  { name: "Paper & Party Supplies", slug: "paper-party-supplies", description: "Stationery, cards, and party decor." },
  { name: "Pet Supplies", slug: "pet-supplies", description: "Accessories and essentials for pets." },
  { name: "Shoes", slug: "shoes", description: "Footwear for all occasions." },
  { name: "Toys & Games", slug: "toys-games", description: "Fun and games for all ages." },
  { name: "Weddings", slug: "weddings", description: "Bridal, decor, and wedding essentials." },
];

async function main() {
  console.log("Starting category migration...");

  // 1. Fetch existing products to preserve them
  const existingProducts = await prisma.product.findMany();
  console.log(`Found ${existingProducts.length} existing products.`);

  // 2. Delete existing ProductCategories and Categories
  console.log("Deleting old product category mappings...");
  await prisma.productCategory.deleteMany({});
  
  console.log("Deleting old categories...");
  await prisma.category.deleteMany({});

  // 3. Insert new categories
  console.log("Inserting new universal categories...");
  const createdCategories = [];
  for (const cat of NEW_CATEGORIES) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isActive: true,
        isFeatured: true,
      },
    });
    createdCategories.push(created);
  }
  console.log(`Successfully created ${createdCategories.length} categories.`);

  // 4. Map existing products to a relevant new category
  console.log("Mapping existing products to new categories...");
  
  const homeLivingCategory = createdCategories.find(c => c.slug === "home-living")!;
  const giftsCategory = createdCategories.find(c => c.slug === "gifts")!;
  const jewelryCategory = createdCategories.find(c => c.slug === "jewelry")!;
  
  let mappedCount = 0;
  for (const product of existingProducts) {
    let targetCategory = homeLivingCategory; // default
    
    // Simple heuristic to map existing handmade items reasonably well
    const title = product.title.toLowerCase();
    const craft = (product.craftType || "").toLowerCase();
    
    if (craft.includes("jewelry") || title.includes("necklace") || title.includes("bracelet")) {
      targetCategory = jewelryCategory;
    } else if (title.includes("gift") || title.includes("flower") || title.includes("pipe cleaner")) {
      targetCategory = giftsCategory;
    }

    await prisma.productCategory.create({
      data: {
        productId: product.id,
        categoryId: targetCategory.id,
      },
    });

    // Update product count
    await prisma.category.update({
      where: { id: targetCategory.id },
      data: { productCount: { increment: 1 } },
    });
    
    mappedCount++;
  }

  console.log(`Successfully mapped ${mappedCount} products to new categories.`);
  console.log("Migration complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
