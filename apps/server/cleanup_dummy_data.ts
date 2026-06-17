import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting cleanup of dummy data...');

  const realStoreName = "Deepani Guathilake Creations";

  // Find dummy vendors
  const dummyVendors = await prisma.vendor.findMany({
    where: {
      storeName: {
        not: realStoreName
      }
    }
  });

  if (dummyVendors.length === 0) {
    console.log('No dummy vendors found.');
    return;
  }

  const dummyVendorIds = dummyVendors.map(v => v.id);
  const dummyUserIds = dummyVendors.map(v => v.userId);

  console.log(`Found ${dummyVendors.length} dummy vendors.`);

  // Find dummy products
  const dummyProducts = await prisma.product.findMany({
    where: {
      vendorId: {
        in: dummyVendorIds
      }
    }
  });

  const dummyProductIds = dummyProducts.map(p => p.id);
  console.log(`Found ${dummyProducts.length} dummy products.`);

  // Delete associated records for products
  if (dummyProductIds.length > 0) {
    await prisma.productCategory.deleteMany({
      where: { productId: { in: dummyProductIds } }
    });
    console.log('Deleted ProductCategory mappings');

    await prisma.review.deleteMany({
      where: { productId: { in: dummyProductIds } }
    });
    console.log('Deleted Reviews');

    await prisma.cartItem.deleteMany({
      where: { productId: { in: dummyProductIds } }
    });
    console.log('Deleted CartItems');

    await prisma.orderItem.deleteMany({
      where: { productId: { in: dummyProductIds } }
    });
    console.log('Deleted OrderItems');

    // Finally delete products
    await prisma.product.deleteMany({
      where: { id: { in: dummyProductIds } }
    });
    console.log('Deleted dummy Products');
  }

  // Delete vendor records
  await prisma.vendor.deleteMany({
    where: { id: { in: dummyVendorIds } }
  });
  console.log('Deleted dummy Vendors');

  // Delete users associated with dummy vendors (and any other dummy users created by seed.ts)
  // We can delete users who have specific emails from seed
  const seedEmails = [
    "hemachandra@example.com",
    "gunawardena@example.com",
    "kulatunga@example.com",
    "rajapakse@example.com",
    "customer@example.com"
  ];
  
  await prisma.user.deleteMany({
    where: {
      OR: [
        { id: { in: dummyUserIds } },
        { email: { in: seedEmails } }
      ]
    }
  });
  console.log('Deleted dummy Users');

  console.log('Cleanup complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
