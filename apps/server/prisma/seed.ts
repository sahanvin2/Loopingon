import { PrismaClient, VendorStatus, ProductStatus, DiscountType, PayoutStatus, PaymentStatus, OrderStatus, ShippingMethod, NotificationType, NotificationChannel, CompetitionStatus } from "@prisma/client";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Kandyam digital marketplace...");

  // Clean existing data
  console.log("Cleaning existing data...");
  await prisma.competitionVote.deleteMany();
  await prisma.competitionEntry.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.loyaltyTransaction.deleteMany();
  await prisma.loyaltyAccount.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.referralCode.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.orderDispute.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payoutSchedule.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.orderEvent.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVideo.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vendorAnalytics.deleteMany();
  await prisma.storefrontSettings.deleteMany();
  await prisma.vendorBankDetail.deleteMany();
  await prisma.vendorVerificationDoc.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.supportTicketReply.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.page.deleteMany();
  await prisma.seoSetting.deleteMany();
  await prisma.sitemapUrl.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.commissionSetting.deleteMany();
  await prisma.shippingRate.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.user.deleteMany();

  const adminId = uuidv4();
  const adminHash = await argon2.hash("@20040301Sa");

  console.log("Creating admin user...");
  await prisma.user.create({
    data: {
      id: adminId,
      email: "sahannawarathne2004@gmail.com",
      passwordHash: adminHash,
      fullName: "System Admin",
      firstName: "System",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      emailVerified: true,
      emailVerifiedAt: new Date(),
      phone: "+94111234567",
      phoneVerified: true,
      isActive: true,
    },
  });

  // ===== DIGITAL CATEGORIES =====
  console.log("Creating digital categories...");
  const categories = [
    { name: "Games", slug: "games", description: "Game keys, gift cards, in-game currency, DLCs, and expansion packs.", isFeatured: true, sortOrder: 1 },
    { name: "Software", slug: "software", description: "Antivirus, office suites, VPN, design tools, developer tools, and cloud subscriptions.", isFeatured: true, sortOrder: 2 },
    { name: "Gift Cards", slug: "gift-cards", description: "Amazon, Google Play, Apple, Netflix, Spotify, Discord, Roblox, and gaming gift cards.", isFeatured: true, sortOrder: 3 },
    { name: "AI & Productivity", slug: "ai-productivity", description: "AI credits, design assets, templates, prompt packs, UI kits, and fonts.", isFeatured: true, sortOrder: 4 },
    { name: "Educational", slug: "educational", description: "Online courses, e-books, study notes, templates, and digital planners.", isFeatured: false, sortOrder: 5 },
    { name: "Creative Assets", slug: "creative-assets", description: "Lightroom presets, Photoshop templates, video LUTs, motion graphics, 3D models, and sound effects.", isFeatured: true, sortOrder: 6 },
    { name: "Web Development", slug: "web-development", description: "React templates, HTML templates, admin dashboards, APIs, plugins, and themes.", isFeatured: true, sortOrder: 7 },
    { name: "Digital Services", slug: "digital-services", description: "Game coaching, graphic design, video editing, programming, translation, and voice-over services.", isFeatured: false, sortOrder: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }
  const catRecords = await prisma.category.findMany();

  function getCatId(slug: string): string {
    return catRecords.find(c => c.slug === slug)?.id || catRecords[0].id;
  }

  // ===== VENDORS =====
  console.log("Creating vendors...");
  const vendorIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];
  const vendorUserIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];

  const vendors = [
    { name: "GameHub Lanka", slug: "gamehub-lanka", email: "gamehub@kandyam.com", desc: "Sri Lanka's premier digital gaming store. Steam keys, PSN cards, Xbox Game Pass, Nintendo eShop, and mobile game top-ups.", craftType: "Gaming" },
    { name: "SoftServe Digital", slug: "softserve-digital", email: "softserve@kandyam.com", desc: "Authorized reseller of premium software licenses. Antivirus, Office suites, VPN subscriptions, design tools, and cloud storage.", craftType: "Software" },
    { name: "CreativeHub LK", slug: "creativehub-lk", email: "creativehub@kandyam.com", desc: "Premium digital assets for creators. Templates, presets, motion graphics, fonts, UI kits, and 3D models for your creative projects.", craftType: "Creative Assets" },
    { name: "DevMart Sri Lanka", slug: "devmart-sl", email: "devmart@kandyam.com", desc: "Web development resources marketplace. React templates, admin dashboards, Laravel projects, APIs, plugins, and code templates.", craftType: "Web Development" },
  ];

  for (let i = 0; i < vendors.length; i++) {
    const v = vendors[i];
    await prisma.user.create({
      data: {
        id: vendorUserIds[i],
        email: v.email,
        passwordHash: adminHash,
        fullName: v.name,
        firstName: v.name.split(" ")[0],
        lastName: v.name.split(" ").slice(1).join(" "),
        role: "VENDOR",
        emailVerified: true,
        emailVerifiedAt: new Date(),
        isActive: true,
      },
    });
    await prisma.vendor.create({
      data: {
        id: vendorIds[i],
        userId: vendorUserIds[i],
        storeName: v.name,
        storeSlug: v.slug,
        storeDescription: v.desc,
        businessName: v.name,
        craftType: [v.craftType],
        craftDescription: v.desc,
        yearsOfExperience: 5 + i * 2,
        employeeCount: 3 + i,
        status: "VERIFIED" as VendorStatus,
        verifiedAt: new Date(),
        verifiedBy: adminId,
        commissionRate: 20.0,
      },
    });
  }

  // ===== DIGITAL PRODUCTS =====
  console.log("Creating digital products...");
  const products = [
    // GameHub Lanka - Games
    { vendor: 0, title: "Steam Wallet Gift Card - $50 USD", slug: "steam-wallet-50-usd", desc: "Official Steam Wallet Gift Card worth $50 USD. Instantly add funds to your Steam Wallet and purchase thousands of games, DLCs, and software on the Steam platform. Delivered digitally within minutes.", shortDesc: "$50 Steam Wallet code delivered instantly. Buy games, DLCs, and software on Steam.", price: 4500, compareAt: 5000, qty: 50, featured: true, cat: "games" },
    { vendor: 0, title: "PlayStation Store Gift Card - $25 USD", slug: "psn-gift-card-25", desc: "Official PlayStation Network Gift Card worth $25 USD. Use for PS5, PS4, and PS3 games, add-ons, movies, and PlayStation Plus subscriptions. Compatible with US PSN accounts.", shortDesc: "$25 PSN card for US accounts. Buy games, DLCs, and PS Plus subscriptions.", price: 2400, compareAt: 2800, qty: 40, featured: false, cat: "games" },
    { vendor: 0, title: "Xbox Game Pass Ultimate - 3 Months", slug: "xbox-game-pass-3months", desc: "Xbox Game Pass Ultimate 3-month subscription. Access 100+ high-quality games on console, PC, and cloud. Includes Xbox Live Gold and EA Play. New releases on day one.", shortDesc: "3 months of Xbox Game Pass Ultimate. 100+ games, cloud gaming, EA Play included.", price: 5800, compareAt: 6500, qty: 25, featured: true, cat: "games" },
    { vendor: 0, title: "Nintendo eShop Gift Card - $35 USD", slug: "nintendo-eshop-35", desc: "Official Nintendo eShop Gift Card worth $35 USD. Purchase digital games, DLC, and Nintendo Switch Online subscriptions. Works on Nintendo Switch, Wii U, and 3DS.", shortDesc: "$35 Nintendo eShop card for digital games, DLC, and Switch Online.", price: 3200, compareAt: null, qty: 30, featured: false, cat: "games" },
    { vendor: 0, title: "Mobile Legends Diamonds - 1000+100 Bonus", slug: "mlbb-diamonds-1100", desc: "Mobile Legends: Bang Bang diamonds top-up. 1000 + 100 bonus diamonds. Instant delivery to your MLBB account. Valid for all servers. Get your favorite skins and heroes today.", shortDesc: "1100 MLBB diamonds (1000+100 bonus). Instant delivery to your account.", price: 1500, compareAt: 1800, qty: 100, featured: true, cat: "games" },
    { vendor: 0, title: "Valorant Points - 5000 VP", slug: "valorant-points-5000", desc: "Riot Games Valorant Points top-up. 5000 VP for weapon skins, battle pass, agents, and bundles. Instant code delivery. Valid for all regions.", shortDesc: "5000 Valorant Points for skins, battle pass, and agents.", price: 5200, compareAt: 5800, qty: 35, featured: false, cat: "games" },
    { vendor: 0, title: "PUBG Mobile UC - 1800+360 Bonus", slug: "pubg-uc-2160", desc: "PUBG Mobile Unknown Cash (UC) top-up. 1800 + 360 bonus UC. Buy Royal Pass, crates, outfits, and weapon skins. Instant delivery worldwide.", shortDesc: "2160 PUBG UC (1800+360 bonus). Royal Pass and skins.", price: 2200, compareAt: null, qty: 60, featured: false, cat: "games" },

    // SoftServe Digital - Software
    { vendor: 1, title: "Microsoft Office 2024 Professional Plus - Lifetime", slug: "office-2024-pro-plus", desc: "Microsoft Office 2024 Professional Plus lifetime license. Includes Word, Excel, PowerPoint, Outlook, OneNote, Publisher, Access, and Teams. One-time purchase, no subscription.", shortDesc: "Lifetime Office 2024 Pro Plus license. Word, Excel, PowerPoint, Outlook + more.", price: 12000, compareAt: 15000, qty: 20, featured: true, cat: "software" },
    { vendor: 1, title: "NordVPN Premium - 2 Year Plan", slug: "nordvpn-2year", desc: "NordVPN Premium 2-year subscription. Military-grade encryption, 6000+ servers in 60 countries, no-logs policy, threat protection, and up to 6 devices simultaneously.", shortDesc: "2-year NordVPN Premium. 6000+ servers, no logs, 6 device protection.", price: 8500, compareAt: 11000, qty: 30, featured: true, cat: "software" },
    { vendor: 1, title: "Kaspersky Total Security - 5 Devices 1 Year", slug: "kaspersky-total-security", desc: "Kaspersky Total Security 1-year license for 5 devices. Antivirus, VPN, password manager, parental controls, file protection, and privacy tools. Cross-platform support.", shortDesc: "Kaspersky Total Security for 5 devices. VPN, password manager included.", price: 4500, compareAt: 5500, qty: 40, featured: false, cat: "software" },
    { vendor: 1, title: "Adobe Creative Cloud Photography Plan - 1 Year", slug: "adobe-cc-photo-1year", desc: "Adobe Creative Cloud Photography plan 1-year subscription. Includes Photoshop, Lightroom, Lightroom Classic, and 20GB cloud storage. Professional photo editing suite.", shortDesc: "1-year Adobe CC Photography: Photoshop + Lightroom + 20GB storage.", price: 14500, compareAt: 17000, qty: 15, featured: true, cat: "software" },
    { vendor: 1, title: "Google One 200GB - 12 Month Plan", slug: "google-one-200gb", desc: "Google One 200GB storage 12-month plan. Share with up to 5 family members. Google experts support, extra member benefits, and Google Photos editing features.", shortDesc: "12 months Google One 200GB. Share with 5 family members.", price: 3500, compareAt: null, qty: 50, featured: false, cat: "software" },

    // CreativeHub LK - Creative Assets
    { vendor: 2, title: "Ultimate Lightroom Presets Bundle - 500+ Presets", slug: "lr-presets-bundle-500", desc: "Ultimate Lightroom preset bundle with 500+ professional presets. Includes portrait, landscape, wedding, street, food, and cinematic styles. Compatible with Lightroom Mobile and Desktop.", shortDesc: "500+ Lightroom presets bundle. Portrait, landscape, wedding, cinematic styles.", price: 2500, compareAt: 3500, qty: 100, featured: true, cat: "creative-assets" },
    { vendor: 2, title: "Cinematic LUTs Pack for Video Editors - 100 LUTs", slug: "cinematic-luts-100", desc: "100 professional cinematic color grading LUTs for video editors. Hollywood film looks, teal-orange, vintage, noir, and modern styles. Compatible with Premiere Pro, DaVinci Resolve, Final Cut Pro, and any LUT-supported software.", shortDesc: "100 cinematic LUTs for Premiere Pro, DaVinci, FCPX. Hollywood film looks.", price: 3000, compareAt: 4000, qty: 80, featured: false, cat: "creative-assets" },
    { vendor: 2, title: "3D Model Pack - Modern Furniture Collection", slug: "3d-furniture-pack", desc: "50 high-quality 3D furniture models for architectural visualization. Includes sofas, chairs, tables, beds, and accessories. FBX, OBJ, and Blender formats. PBR textures included.", shortDesc: "50 modern furniture 3D models. FBX, OBJ, Blender. PBR textures.", price: 5500, compareAt: 7000, qty: 40, featured: false, cat: "creative-assets" },
    { vendor: 2, title: "Royalty-Free Music Pack - 200 Tracks", slug: "music-pack-200", desc: "200 royalty-free music tracks for content creators. Background music for YouTube, podcasts, commercials, and videos. Multiple genres: ambient, corporate, upbeat, cinematic, lo-fi.", shortDesc: "200 royalty-free music tracks. YouTube, podcast, commercial use.", price: 1800, compareAt: 2500, qty: 100, featured: false, cat: "creative-assets" },
    { vendor: 2, title: "Premium Font Bundle - 50 Commercial Fonts", slug: "font-bundle-50", desc: "50 premium commercial-use fonts for designers. Serif, sans-serif, script, display, and monospace families. Includes web font licenses. OTF and TTF formats.", shortDesc: "50 commercial fonts bundle. Serif, script, display. Web license included.", price: 2200, compareAt: null, qty: 60, featured: false, cat: "creative-assets" },

    // DevMart Sri Lanka - Web Development
    { vendor: 3, title: "Next.js E-Commerce Starter Template", slug: "nextjs-ecommerce-starter", desc: "Production-ready Next.js 15 e-commerce starter template. TypeScript, Tailwind CSS, Prisma, Stripe integration, admin dashboard, product management, and shopping cart. Fully documented.", shortDesc: "Next.js 15 e-commerce template. TypeScript, Tailwind, Prisma, Stripe", price: 8500, compareAt: 12000, qty: 30, featured: true, cat: "web-development" },
    { vendor: 3, title: "React Admin Dashboard - Material UI Pro", slug: "react-admin-dashboard", desc: "Complete React admin dashboard template built with Material UI. 40+ pages, 15+ layouts, dark/light mode, data tables, charts, forms, and authentication flows. TypeScript included.", shortDesc: "React admin dashboard with 40+ pages. Material UI, TypeScript, dark mode.", price: 6800, compareAt: 9000, qty: 25, featured: true, cat: "web-development" },
    { vendor: 3, title: "Laravel SaaS Starter Kit", slug: "laravel-saas-starter", desc: "Complete Laravel SaaS starter kit with user management, subscription billing (Stripe), team management, role-based access, API tokens, and admin panel. Tailwind CSS frontend.", shortDesc: "Laravel SaaS starter: users, Stripe billing, teams, RBAC, admin panel.", price: 9500, compareAt: 13000, qty: 20, featured: false, cat: "web-development" },
    { vendor: 3, title: "WordPress Premium Theme Bundle - 10 Themes", slug: "wp-theme-bundle-10", desc: "10 premium WordPress themes with lifetime updates. Multi-purpose, blog, e-commerce, portfolio, and business themes. Elementor compatible. One-click demo import.", shortDesc: "10 premium WP themes bundle. Multi-purpose, blog, shop. Lifetime updates.", price: 4000, compareAt: 6000, qty: 50, featured: false, cat: "web-development" },
    { vendor: 3, title: "REST API Boilerplate - Node.js + Express + MongoDB", slug: "node-api-boilerplate", desc: "Production-ready Node.js REST API boilerplate. Express.js, MongoDB, JWT auth, rate limiting, file upload, email, Swagger docs, Docker support, and unit tests included.", shortDesc: "Node.js + Express + MongoDB API boilerplate. JWT, Swagger, Docker.", price: 5500, compareAt: null, qty: 35, featured: false, cat: "web-development" },
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        vendorId: vendorIds[p.vendor],
        title: p.title,
        slug: p.slug,
        description: p.desc,
        shortDescription: p.shortDesc,
        price: p.price,
        compareAtPrice: p.compareAt || null,
        quantity: p.qty,
        status: "PUBLISHED" as ProductStatus,
        isFeatured: p.featured,
        isDigital: true,
        shippingPrice: 0,
        freeShippingDomestic: true,
        madeToOrder: false,
        processingTime: null,
        publishedAt: new Date(),
      },
    });
    await prisma.productCategory.create({
      data: { productId: product.id, categoryId: getCatId(p.cat) },
    });
  }

  // ===== COUPONS =====
  console.log("Creating coupons...");
  const now = new Date();
  await prisma.coupon.createMany({
    data: [
      { code: "WELCOME10", description: "10% off your first purchase", discountType: "PERCENTAGE" as DiscountType, discountValue: 10, minOrderAmount: 1000, maxDiscountAmount: 2000, usageLimit: 100, usageCount: 0, perUserLimit: 1, startsAt: now, expiresAt: new Date(now.getTime() + 365 * 86400000), isActive: true, forNewCustomersOnly: true },
      { code: "DIGITAL500", description: "Rs. 500 off on digital products", discountType: "FIXED_AMOUNT" as DiscountType, discountValue: 500, minOrderAmount: 2000, maxDiscountAmount: 500, usageLimit: 200, usageCount: 0, perUserLimit: 3, startsAt: now, expiresAt: new Date(now.getTime() + 180 * 86400000), isActive: true, forNewCustomersOnly: false },
      { code: "FREEDEL", description: "Free delivery on all orders", discountType: "FREE_SHIPPING" as DiscountType, discountValue: 0, minOrderAmount: 500, usageLimit: 500, usageCount: 0, perUserLimit: 5, startsAt: now, expiresAt: new Date(now.getTime() + 90 * 86400000), isActive: true, forNewCustomersOnly: false },
    ],
  });

  // ===== BANNERS =====
  console.log("Creating banners...");
  await prisma.banner.createMany({
    data: [
      { title: "Digital Deals", subtitle: "Game keys, software, gift cards - all delivered instantly", imageUrl: "", position: "hero", sortOrder: 1, isActive: true },
      { title: "Gaming Season Sale", subtitle: "Up to 30% off on gaming gift cards and top-ups", imageUrl: "", position: "home_middle", sortOrder: 2, isActive: true },
      { title: "Creator Essentials", subtitle: "Premium design assets, fonts, templates for creative pros", imageUrl: "", position: "home_bottom", sortOrder: 3, isActive: true },
    ],
  });

  // ===== SYSTEM SETTINGS =====
  await prisma.systemSetting.createMany({
    data: [
      { key: "platform_name", value: JSON.stringify("Kandyam"), description: "Platform display name" },
      { key: "default_commission", value: JSON.stringify({ rate: 20, type: "percentage" }), description: "Default commission rate" },
      { key: "payout_schedule", value: JSON.stringify({ schedule: "biweekly", days: [1, 15] }), description: "Payout schedule" },
      { key: "platform_fees", value: JSON.stringify({ transactionFee: 0, listingFee: 0, subscriptionFee: 0 }), description: "Platform fees" },
      { key: "supported_currencies", value: JSON.stringify(["LKR", "USD"]), description: "Supported currencies" },
      { key: "min_withdrawal_amount", value: JSON.stringify(500), description: "Minimum withdrawal in LKR" },
      { key: "max_product_images", value: JSON.stringify(10), description: "Max images per product" },
      { key: "contact_email", value: JSON.stringify("support@kandyam.com"), description: "Contact email" },
    ],
    skipDuplicates: true,
  });

  await prisma.commissionSetting.create({
    data: { name: "Default Commission", rate: 20.0, applicableTo: ["ALL"], isActive: true },
  });

  await prisma.shippingRate.create({
    data: { name: "Digital Delivery", courierName: "Instant", domesticRate: 0, internationalRate: 0, freeShippingMinAmount: 0, estimatedDays: 0, isActive: true },
  });

  console.log("Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
