import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  const email = "test_buyer@example.com";
  const password = await hashPassword("Password123!");
  
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash: password,
        fullName: "Test Buyer",
        role: "CUSTOMER",
        emailVerified: true,
      }
    });
    console.log("Created test user:", user.id);
  } else {
    await prisma.user.update({
      where: { email },
      data: { passwordHash: password }
    });
  }

  let vendorUser = await prisma.user.findUnique({ where: { email: "test_vendor@example.com" } });
  if (!vendorUser) {
    vendorUser = await prisma.user.create({
      data: {
        email: "test_vendor@example.com",
        passwordHash: password,
        fullName: "Test Vendor",
        role: "VENDOR",
        emailVerified: true,
      }
    });
  }

  let vendor = await prisma.vendor.findFirst({ where: { userId: vendorUser.id } });
  if (!vendor) {
    vendor = await prisma.vendor.create({
      data: {
        userId: vendorUser.id,
        storeName: "Test Store",
        storeSlug: "test-store",
        businessName: "Test Business",
        storeDescription: "Test",
        contactEmail: "test_vendor@example.com",
        contactPhone: "123456789",
        workshopAddress: "123 Test St",
        workshopCity: "Test City",
        workshopDistrict: "Test District",
        status: "VERIFIED"
      }
    });
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: "TEST-" + Math.floor(Math.random() * 100000),
      customerId: user.id,
      vendorId: vendor.id,
      totalAmount: 5000,
      subtotal: 5000,
      vendorPayoutAmount: 4500,
      commissionAmount: 500,
      status: "DELIVERED",
      paymentStatus: "COMPLETED",
      shippingFee: 0,
      shippingAddress: {
        create: {
          fullName: "Test Buyer",
          addressLine1: "123 Test",
          city: "Test",
          district: "Test",
          postalCode: "12345",
          phone: "123456789"
        }
      },
      deliveredAt: new Date(),
    }
  });

  console.log("Created delivered order:", order.id, order.orderNumber);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
