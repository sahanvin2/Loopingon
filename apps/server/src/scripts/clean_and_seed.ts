import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting cleanup and seed...');

  // 1. Delete all existing orders and products to avoid FK constraints
  console.log('Deleting all existing order items...');
  await prisma.orderItem.deleteMany({});
  
  console.log('Deleting all existing orders...');
  await prisma.order.deleteMany({});

  console.log('Deleting all existing products...');
  const deletedProducts = await prisma.product.deleteMany({});
  console.log(`Deleted ${deletedProducts.count} products.`);

  // 2. Delete all dummy users and their vendors
  console.log('Deleting dummy users (*@kandyam.com) and their vendors...');
  
  // Find dummy users
  const dummyUsers = await prisma.user.findMany({
    where: { email: { endsWith: '@kandyam.com' } },
    select: { id: true }
  });
  const dummyUserIds = dummyUsers.map(u => u.id);

  if (dummyUserIds.length > 0) {
    await prisma.vendor.deleteMany({
      where: { userId: { in: dummyUserIds } }
    });
    const deletedUsers = await prisma.user.deleteMany({
      where: { id: { in: dummyUserIds } }
    });
    console.log(`Deleted ${deletedUsers.count} dummy users.`);
  }

  // 3. Ensure the admin user has a Vendor profile
  console.log('Ensuring System Admin is a Vendor...');
  const adminUser = await prisma.user.findUnique({
    where: { email: 'sahannawarathne2004@gmail.com' }
  });

  if (!adminUser) {
    console.error('Admin user not found! Aborting seed.');
    return;
  }

  let vendor = await prisma.vendor.findUnique({
    where: { userId: adminUser.id }
  });

  if (!vendor) {
    console.log('Creating Vendor profile for admin...');
    vendor = await prisma.vendor.create({
      data: {
        userId: adminUser.id,
        storeName: 'Kandyam Official',
        storeSlug: 'kandyam-official',
        storeDescription: 'Official store for digital products',
        status: 'VERIFIED'
      }
    });
  }

  // 4. Create the 4 new real products
  console.log('Creating new real products...');

  const products = [
    {
      vendorId: vendor.id,
      title: 'Adobe Creative Cloud Subscription 1 Month - Private Account (Global)',
      slug: 'adobe-cc-1-month-private',
      description: `Product info\nDelivery speed\n7 hrs - 18 hrs\nAccount\nAdobe Creative Cloud Subscription 1 Month - Private Account (Global)\nIndividual Paid Subscription, No Team Joining - 1000 AI Credits\n\nSubscription Length: Uninterrupted One Month (30 Days)\nDelivery Method: Manual Delivery After Order Confirmation\n\nWhat You Will Receive\n• Subscription Credentials\n• Connected Outlook or Hotmail (Email ID + password)\n\nActivation Process\n• Place your order on G2G\n• After order confirmation, account will be prepared\n• Login details will be delivered via G2G order\n• Change account password and enable 2FA after receiving\n\nDelivery Time\n• Usually within mentioned time frame in listing\n\nImportant Notes\n• This is a private account (not shared)\n• Please change password and set 2FA after receiving\n• Works on mobile, PC, and smart devices\n• After Sales Support available via G2G chat\n\n4000 AI Credits (Not this one) also available at fair price.`,
      price: 5500,
      currency: 'LKR',
      quantity: 1000,
      status: 'PUBLISHED',
      isDigital: true
    },
    {
      vendorId: vendor.id,
      title: 'Adobe Creative Cloud Subscription 1 Month - Private Account (Global)',
      slug: 'adobe-cc-1-month-private-auto',
      description: `Product info\nDelivery speed\nInstant\nDelivery method\nAuto delivery\nCan activate in Sri Lanka\nAccount\nAdobe Creative Cloud Subscription 1 Month - Private Account (Global)\nYou can purchase our product even when we are offline; it is delivered automatically and instantly from stock!\n\nDELİVERY\n\n• Complete your purchase.\n• Your order will be processed shortly.\n• A ready-to-use Adobe Creative Cloud account will be delivered.\n• Login credentials (Email & Password) are included.\n• Simply sign in and start using all Adobe applications.\n\nWHAT'S INCLUDED\n\nFull Adobe Creative Cloud Access\n\nAccess to 30+ Adobe applications, including:\n\n• Photoshop\n\n• Illustrator\n\n• Premiere Pro\n\n• After Effects\n\n• Lightroom\n\n• Acrobat Pro\n\n• InDesign\n\n• Audition\n\n• Media Encoder\n\n• XD\n\n• And many more.\n\nPREMİUM FEATURES\n\n• 100GB Cloud Storage\n\n• Adobe Fonts\n\n• Adobe Portfolio\n\n• Creative Cloud Libraries\n\n• Desktop & Mobile Sync\n\n• Cloud Collaboration\n\n• Official Updates`,
      price: 2000,
      currency: 'LKR',
      quantity: 1000,
      status: 'PUBLISHED',
      isDigital: true
    },
    {
      vendorId: vendor.id,
      title: 'Adobe subscription 3 months Account',
      slug: 'adobe-cc-3-months',
      description: `Product info\nDelivery speed\nInstant\nDelivery method\nAuto delivery\nCan activate in Sri Lanka\nAccount\nAdobe subscription 3 months Account\n(Individual Plan, No Trial or Team Joining) Adobe Creative Cloud Pro Subscription - 1000 AI Credits Each Month\n\nSubscription Length: 3 Months Plus\nDelivery Method: Auto Delivery After Order Confirmation\n\nWhat You Will Receive\n• Subscription Credentials (Login Email + Password)\n• Connected email (Outlook or Hotmail Account + Password)\n\nActivation Process\n• Place your order on G2G\n• After order confirmation, account will be auto delivered\n• Login details will be delivered via G2G order page\n• Change account password and enable 2FA after receiving\n\nDelivery Time\n• Instant\n\nImportant Notes\n• This is a private account (not shared)\n• Please change password and set 2FA after receiving\n• Works on mobile, PC, and smart devices\n• After Sales Support available via G2G chat`,
      price: 12000,
      currency: 'LKR',
      quantity: 1000,
      status: 'PUBLISHED',
      isDigital: true
    },
    {
      vendorId: vendor.id,
      title: 'Adobe subscription 3 months Account',
      slug: 'adobe-cc-3-months-auto',
      description: `Product info\nDelivery speed\nInstant\nDelivery method\nAuto delivery\nCan activate in Sri Lanka\nAccount\nAdobe subscription 3 months Account\nYou can purchase our product even when we are offline; it is delivered automatically and instantly from stock!\n\nDELİVERY\n\n• Complete your purchase.\n• Your order will be processed shortly.\n• A ready-to-use Adobe Creative Cloud account will be delivered.\n• Login credentials (Email & Password) are included.\n• Simply sign in and start using all Adobe applications.\n\nWHAT'S INCLUDED\n\nFull Adobe Creative Cloud Access\n\nAccess to 30+ Adobe applications, including:\n\n• Photoshop\n\n• Illustrator\n\n• Premiere Pro\n\n• After Effects\n\n• Lightroom\n\n• Acrobat Pro\n\n• InDesign\n\n• Audition\n\n• Media Encoder\n\n• XD\n\n• And many more.\n\nPREMİUM FEATURES\n\n• 100GB Cloud Storage\n\n• Adobe Fonts\n\n• Adobe Portfolio\n\n• Creative Cloud Libraries\n\n• Desktop & Mobile Sync\n\n• Cloud Collaboration\n\n• Official Updates`,
      price: 3000,
      currency: 'LKR',
      quantity: 1000,
      status: 'PUBLISHED',
      isDigital: true
    }
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: prod as any
    });
  }

  console.log(`Successfully added ${products.length} products.`);
  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
