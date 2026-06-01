"use client";

import React from "react";
import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  type: "product" | "category" | "trending";
  label: string;
  href: string;
  thumbnail?: string;
}

interface SearchSuggestionsProps {
  query: string;
  suggestions: Suggestion[];
  isVisible: boolean;
  onSelect?: () => void;
  className?: string;
}

export function SearchSuggestions({
  query,
  suggestions,
  isVisible,
  onSelect,
  className,
}: SearchSuggestionsProps) {
  if (!isVisible || (suggestions.length === 0 && !query)) return null;

  const trending: Suggestion[] = [
    { type: "trending", label: "Handloom sarees", href: "/products?q=handloom+sarees" },
    { type: "trending", label: "Sri Lankan masks", href: "/products?q=sri+lankan+masks" },
    { type: "trending", label: "Brass lamps", href: "/products?q=brass+lamps" },
    { type: "trending", label: "Batik wall hangings", href: "/products?q=batik+wall+hangings" },
    { type: "trending", label: "Clay pottery", href: "/products?q=clay+pottery" },
  ];

  const displaySuggestions = suggestions.length > 0 ? suggestions : trending;

  return (
    <div
      className={cn(
        "absolute top-full mt-2 w-full bg-white rounded-lg shadow-soft-md",
        "border border-cream-200 overflow-hidden z-50",
        className,
      )}
    >
      {query && (
        <Link
          href={`/products?q=${encodeURIComponent(query)}`}
          onClick={onSelect}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 text-sm",
            "hover:bg-terracotta-50 text-terracotta-600 font-medium",
            "border-b border-cream-100",
          )}
        >
          <Search className="w-4 h-4" />
          Search for &ldquo;{query}&rdquo;
        </Link>
      )}

      {suggestions.length === 0 && query && (
        <div className="px-4 py-2.5 border-b border-cream-100">
          <div className="flex items-center gap-2 text-xs text-warm-gray-500 mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Trending Searches
          </div>
        </div>
      )}

      <div className="py-1">
        {displaySuggestions.map((suggestion, i) => (
          <Link
            key={i}
            href={suggestion.href}
            onClick={onSelect}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
              "hover:bg-warm-gray-50 text-charcoal-700",
            )}
          >
            {suggestion.thumbnail ? (
              <div className="w-10 h-10 rounded-md bg-warm-gray-100 overflow-hidden shrink-0">
                <img
                  src={suggestion.thumbnail}
                  alt={suggestion.label}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : suggestion.type === "trending" ? (
              <TrendingUp className="w-4 h-4 text-warm-gray-400 shrink-0" />
            ) : (
              <Search className="w-4 h-4 text-warm-gray-400 shrink-0" />
            )}
            <span>{suggestion.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
