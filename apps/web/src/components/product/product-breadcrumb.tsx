"use client";

import React from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/breadcrumb";
import { cn } from "@/lib/utils";

interface ProductBreadcrumbProps {
  productTitle: string;
  categoryName?: string;
  categorySlug?: string;
  subcategoryName?: string;
  subcategorySlug?: string;
  className?: string;
}

export function ProductBreadcrumb({
  productTitle,
  categoryName,
  categorySlug,
  subcategoryName,
  subcategorySlug,
  className,
}: ProductBreadcrumbProps) {
  const items: BreadcrumbItem[] = [];

  if (categoryName && categorySlug) {
    items.push({ label: categoryName, href: `/categories/${categorySlug}` });
  }

  if (subcategoryName && subcategorySlug) {
    items.push({
      label: subcategoryName,
      href: `/categories/${subcategorySlug}`,
    });
  }

  items.push({ label: productTitle });

  return <Breadcrumb items={items} className={cn("py-4", className)} />;
}
