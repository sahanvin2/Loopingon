import { prisma } from "./src/config/database.js";
import { addPromotionalEmailJob } from "./src/workers/email.worker.js";

async function run() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      include: { images: true },
      take: 9,
    });

    const mappedProducts = products.map((p) => {
      let imageUrl = "https://via.placeholder.com/150";
      if (p.images && p.images.length > 0) {
        imageUrl = p.images[0].url;
      }
      return {
        name: p.title,
        price: p.price,
        image: imageUrl,
        link: `http://localhost:3000/products/${p.slug}`,
      };
    });

    const curated = mappedProducts.slice(0, 3);
    const featured = mappedProducts.slice(3, 9);

    await addPromotionalEmailJob(
      "snawarathne10@gmail.com",
      "Start your summer sales with sample deals",
      "Summer Sales are Here! 🌞",
      "Try out samples for your summer sourcing needs",
      "https://images.unsplash.com/photo-1572916298517-d2c676239103?auto=format&fit=crop&q=80&w=800", // Sample summer banner
      "Shop Summer Deals",
      "http://localhost:3000/products",
      curated,
      featured
    );

    console.log("Promotional email job added successfully!");
    
    // Give BullMQ a moment to process before exiting
    setTimeout(() => {
      console.log("Exiting test script.");
      process.exit(0);
    }, 3000);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

run();
