import { prisma } from "../config/database.js";

export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u0D80-\u0DFF\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .substring(0, 200);
}

export function generateProductSlug(name: string): string {
  return generateSlug(`${name}-${Date.now().toString(36)}`);
}

export async function generateUniqueSlug(
  text: string,
  model: "product" | "category" | "vendor",
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(text);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let existing: { id: string } | null = null;

    switch (model) {
      case "product":
        existing = await prisma.product.findFirst({
          where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
          select: { id: true },
        });
        break;
      case "category":
        existing = await prisma.category.findFirst({
          where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
          select: { id: true },
        });
        break;
      case "vendor":
        existing = await prisma.vendor.findFirst({
          where: { storeSlug: slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
          select: { id: true },
        });
        break;
    }

    if (!existing) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export function slugify(text: string): string {
  return generateSlug(text);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-5);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `KDY-${timestamp}${random}`;
}

export function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKT-${timestamp}-${random}`;
}
