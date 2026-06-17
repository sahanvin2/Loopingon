import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/export/master
// Accessible only by SUPER_ADMIN
router.get(
  "/master",
  authenticate,
  requireRole("SUPER_ADMIN"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Kandyam Admin";
      workbook.created = new Date();

      // --- Sheet 1: Users ---
      const usersSheet = workbook.addWorksheet("Users");
      usersSheet.columns = [
        { header: "ID", key: "id", width: 36 },
        { header: "Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Role", key: "role", width: 15 },
        { header: "Joined At", key: "createdAt", width: 20 },
      ];
      const users = await prisma.user.findMany({
        select: { id: true, fullName: true, email: true, role: true, createdAt: true },
        take: 10000,
      });
      users.forEach(user => {
        usersSheet.addRow({
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        });
      });

      // --- Sheet 2: Orders ---
      const ordersSheet = workbook.addWorksheet("Orders");
      ordersSheet.columns = [
        { header: "Order Number", key: "orderNumber", width: 20 },
        { header: "Customer ID", key: "customerId", width: 36 },
        { header: "Vendor ID", key: "vendorId", width: 36 },
        { header: "Total Amount", key: "totalAmount", width: 15 },
        { header: "Status", key: "status", width: 20 },
        { header: "Created At", key: "createdAt", width: 20 },
      ];
      const orders = await prisma.order.findMany({
        select: { orderNumber: true, customerId: true, vendorId: true, totalAmount: true, status: true, createdAt: true },
        take: 10000,
      });
      orders.forEach(order => {
        ordersSheet.addRow({
          orderNumber: order.orderNumber,
          customerId: order.customerId,
          vendorId: order.vendorId,
          totalAmount: Number(order.totalAmount),
          status: order.status,
          createdAt: order.createdAt.toISOString(),
        });
      });

      // --- Sheet 3: Products ---
      const productsSheet = workbook.addWorksheet("Products");
      productsSheet.columns = [
        { header: "ID", key: "id", width: 36 },
        { header: "Title", key: "title", width: 40 },
        { header: "Price", key: "price", width: 15 },
        { header: "Status", key: "status", width: 20 },
        { header: "Vendor ID", key: "vendorId", width: 36 },
      ];
      const products = await prisma.product.findMany({
        select: { id: true, title: true, price: true, status: true, vendorId: true },
        take: 10000,
      });
      products.forEach(product => {
        productsSheet.addRow({
          id: product.id,
          title: product.title,
          price: Number(product.price),
          status: product.status,
          vendorId: product.vendorId,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=kandyam-master-export.xlsx"
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Master export error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error during export" });
    }
  }
);

export default router;
