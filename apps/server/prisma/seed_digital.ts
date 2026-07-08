import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Kandyam database with DIGITAL PRODUCTS...");

  // Clean existing product-related data
  console.log("Cleaning existing product data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  
  // Need to get an existing vendor to assign products to.
  let vendor = await prisma.vendor.findFirst({ where: { status: "VERIFIED" } });
  if (!vendor) {
     console.log("No verified vendor found. Creating an Official Store for the Super Admin...");
     const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
     if (admin) {
       vendor = await prisma.vendor.create({
         data: {
           userId: admin.id,
           storeName: "Kandyam Official Store",
           storeSlug: "kandyam-official",
           storeDescription: "The official Kandyam digital products store.",
           status: "VERIFIED",
           verifiedAt: new Date(),
           verifiedBy: "SYSTEM",
         }
       });
     } else {
       console.error("No super admin found either! Please run the regular seed first.");
       return;
     }
  }

  // Categories
  console.log("Creating digital categories...");
  const categories = [
    { name: "Games", slug: "games", description: "Game activation keys, Gift cards, etc", level: 0, sortOrder: 1, isFeatured: true },
    { name: "Software", slug: "software", description: "Antivirus, Office, VPNs", level: 0, sortOrder: 2, isFeatured: true },
    { name: "Gift Cards", slug: "gift-cards", description: "Amazon, Google Play, Apple", level: 0, sortOrder: 3, isFeatured: true },
    { name: "AI & Productivity", slug: "ai-productivity", description: "AI service credits, templates", level: 0, sortOrder: 4, isFeatured: false },
    { name: "Educational", slug: "educational", description: "Online courses, E-books", level: 0, sortOrder: 5, isFeatured: false },
    { name: "Creative Assets", slug: "creative-assets", description: "Lightroom presets, 3D models", level: 0, sortOrder: 6, isFeatured: false },
    { name: "Web Development", slug: "web-development", description: "Templates, plugins", level: 0, sortOrder: 7, isFeatured: true },
    { name: "Digital Services", slug: "digital-services", description: "Graphic design, Video editing", level: 0, sortOrder: 8, isFeatured: false }
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  const allCategories = await prisma.category.findMany();
  const getCatId = (slug: string) => allCategories.find(c => c.slug === slug)?.id;

  console.log("Creating digital products...");
  const productData = [
    {
      vendorId: vendor.id,
      title: "Steam Wallet Card $50 Global",
      slug: "steam-wallet-card-50-global",
      description: "Instant delivery Steam Wallet Gift Card. Add funds to your Steam wallet easily and securely. Delivered instantly to your email after purchase.",
      price: 16500.00,
      compareAtPrice: 17000.00,
      quantity: 100,
      sku: "DIG-STM-50",
      status: "PUBLISHED" as ProductStatus,
      isDigital: true,
      categoryId: getCatId("games"),
      imageUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=800"
    },
    {
      vendorId: vendor.id,
      title: "Windows 11 Pro OEM Key",
      slug: "windows-11-pro-oem-key",
      description: "Genuine Windows 11 Pro OEM license key. Lifetime activation for 1 PC. Supports all languages. Instant digital delivery.",
      price: 4500.00,
      compareAtPrice: 6500.00,
      quantity: 50,
      sku: "DIG-WIN11-PRO",
      status: "PUBLISHED" as ProductStatus,
      isDigital: true,
      categoryId: getCatId("software"),
      imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800"
    },
    {
      vendorId: vendor.id,
      title: "Netflix 1-Month Premium Subscription",
      slug: "netflix-1-month-premium",
      description: "Enjoy unlimited movies and TV shows with a 1-Month Netflix Premium subscription. 4K Ultra HD supported on 4 devices simultaneously.",
      price: 5200.00,
      quantity: 20,
      sku: "DIG-NFLX-1M",
      status: "PUBLISHED" as ProductStatus,
      isDigital: true,
      categoryId: getCatId("gift-cards"),
      imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800"
    },
    {
      vendorId: vendor.id,
      title: "Midjourney AI Prompts Collection - Architecture",
      slug: "midjourney-prompts-architecture",
      description: "A curated collection of over 500 high-quality Midjourney prompts for generating stunning architectural designs, interiors, and cityscapes.",
      price: 1500.00,
      quantity: 999,
      sku: "DIG-AI-ARCH-PROMPTS",
      status: "PUBLISHED" as ProductStatus,
      isDigital: true,
      categoryId: getCatId("ai-productivity"),
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
    },
    {
      vendorId: vendor.id,
      title: "Complete Web Development Bootcamp 2024",
      slug: "web-dev-bootcamp-2024",
      description: "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive online course. Includes lifetime access to video materials.",
      price: 8500.00,
      compareAtPrice: 15000.00,
      quantity: 999,
      sku: "DIG-EDU-WEBDEV",
      status: "PUBLISHED" as ProductStatus,
      isDigital: true,
      categoryId: getCatId("educational"),
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
    },
    {
      vendorId: vendor.id,
      title: "Modern React E-Commerce Template",
      slug: "modern-react-ecommerce-template",
      description: "A fully responsive, modern e-commerce template built with React, Next.js, and Tailwind CSS. Includes shopping cart, checkout UI, and admin dashboard design.",
      price: 12000.00,
      quantity: 999,
      sku: "DIG-WEB-ECOM-TMPL",
      status: "PUBLISHED" as ProductStatus,
      isDigital: true,
      categoryId: getCatId("web-development"),
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    }
  ];

  for (const prod of productData) {
    const { categoryId, imageUrl, ...data } = prod;
    const newProduct = await prisma.product.create({
      data: {
        ...data,
        categories: {
          create: categoryId ? [{ categoryId }] : []
        },
        images: {
          create: imageUrl ? [{
            url: imageUrl,
            thumbnail: imageUrl,
            medium: imageUrl,
            large: imageUrl,
            isPrimary: true
          }] : []
        }
      }
    });
    console.log(`Created product: ${newProduct.title}`);
  }

  console.log("Digital products seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
