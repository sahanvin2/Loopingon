"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn, range } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
  pageParam?: string;
  siblingCount?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
  pageParam = "page",
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const useLinks = !!baseUrl;
  const buildHref = (page: number) => {
    if (!baseUrl) return "#";
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}${pageParam}=${page}`;
  };

  const getPageNumbers = (): (number | "dots")[] => {
    const totalNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "dots" as const, totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, "dots" as const, ...rightRange];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, "dots" as const, ...middleRange, "dots" as const, totalPages];
  };

  const pages = getPageNumbers();

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      {useLinks ? (
        currentPage <= 1 ? (
          <span
            className={cn(
              "inline-flex items-center justify-center w-9 h-9 rounded-lg",
              "text-muted-400",
            )}
            aria-hidden="true"
          >
            <ChevronLeft className="w-4 h-4" />
          </span>
        ) : (
          <Link
            href={buildHref(currentPage - 1)}
            className={cn(
              "inline-flex items-center justify-center w-9 h-9 rounded-lg",
              "text-muted-600 hover:bg-muted-100 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1",
            )}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        )
      ) : (
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            "inline-flex items-center justify-center w-9 h-9 rounded-lg",
            "text-muted-600 hover:bg-muted-100 transition-colors",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1",
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      <div className="hidden sm:flex items-center gap-1">
        {pages.map((page, idx) =>
          page === "dots" ? (
            <span
              key={`dots-${idx}`}
              className="inline-flex items-center justify-center w-9 h-9 text-muted-400"
              aria-hidden="true"
            >
              <MoreHorizontal className="w-4 h-4" />
            </span>
          ) : useLinks ? (
            <Link
              key={page}
              href={buildHref(page)}
              className={cn(
                "inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1",
                page === currentPage
                  ? "bg-rose-600 text-white shadow-sm pointer-events-none"
                  : "text-charcoal-700 hover:bg-rose-50 hover:text-rose-700",
              )}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={`page-${page}-${currentPage}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {page}
                </motion.span>
              </AnimatePresence>
            </Link>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange?.(page)}
              disabled={page === currentPage}
              className={cn(
                "inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1",
                page === currentPage
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-charcoal-700 hover:bg-rose-50 hover:text-rose-700",
              )}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={`page-${page}-${currentPage}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {page}
                </motion.span>
              </AnimatePresence>
            </button>
          ),
        )}
      </div>

      <span className="sm:hidden text-sm text-muted-600 font-medium px-3" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>

      {useLinks ? (
        currentPage >= totalPages ? (
          <span
            className={cn(
              "inline-flex items-center justify-center w-9 h-9 rounded-lg",
              "text-muted-400",
            )}
            aria-hidden="true"
          >
            <ChevronRight className="w-4 h-4" />
          </span>
        ) : (
          <Link
            href={buildHref(currentPage + 1)}
            className={cn(
              "inline-flex items-center justify-center w-9 h-9 rounded-lg",
              "text-muted-600 hover:bg-muted-100 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1",
            )}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        )
      ) : (
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            "inline-flex items-center justify-center w-9 h-9 rounded-lg",
            "text-muted-600 hover:bg-muted-100 transition-colors",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1",
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </nav>
  );
}
