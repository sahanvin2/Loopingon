"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-6 text-warm-gray-400 flex items-center justify-center w-16 h-16">
          {icon}
        </div>
      ) : (
        <div className="mb-6 w-16 h-16 rounded-full bg-warm-gray-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-warm-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}

      <h3 className="font-serif text-xl text-charcoal-900 mb-2">{title}</h3>
      {description && <p className="text-warm-gray-600 max-w-sm mb-8">{description}</p>}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action &&
            (action.href ? (
              <Link
                href={action.href}
                className={cn(
                  "inline-flex items-center justify-center px-6 py-2.5 rounded-lg",
                  "bg-terracotta-600 text-white font-medium text-sm",
                  "hover:bg-terracotta-700 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2",
                )}
              >
                {action.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={action.onClick}
                className={cn(
                  "inline-flex items-center justify-center px-6 py-2.5 rounded-lg",
                  "bg-terracotta-600 text-white font-medium text-sm",
                  "hover:bg-terracotta-700 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2",
                )}
              >
                {action.label}
              </button>
            ))}
          {secondaryAction &&
            (secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className={cn(
                  "inline-flex items-center justify-center px-6 py-2.5 rounded-lg",
                  "border border-warm-gray-300 text-charcoal-700 font-medium text-sm",
                  "hover:bg-warm-gray-50 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-warm-gray-400 focus:ring-offset-2",
                )}
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className={cn(
                  "inline-flex items-center justify-center px-6 py-2.5 rounded-lg",
                  "border border-warm-gray-300 text-charcoal-700 font-medium text-sm",
                  "hover:bg-warm-gray-50 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-warm-gray-400 focus:ring-offset-2",
                )}
              >
                {secondaryAction.label}
              </button>
            ))}
        </div>
      )}
    </motion.div>
  );
}
