"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBarProps {
  className?: string;
  expanded?: boolean;
  onExpand?: (expanded: boolean) => void;
  onSubmit?: (query: string) => void;
}

export function SearchBar({
  className,
  expanded: controlledExpanded,
  onExpand,
  onSubmit,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const expanded = controlledExpanded ?? isExpanded;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsExpanded(true);
        onExpand?.(true);
      }
      if (e.key === "Escape") {
        setQuery("");
        setIsExpanded(false);
        onExpand?.(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExpand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSubmit) {
        onSubmit(query.trim());
      } else {
        router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      }
      setIsExpanded(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative", className)}
    >
      <div
        className={cn(
          "flex items-center rounded-full border bg-white transition-all duration-300",
          isFocused || expanded
            ? "w-full ring-2 ring-terracotta-500 border-transparent"
            : "border-warm-gray-300 w-full max-w-md",
        )}
      >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-500 shrink-0" />

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsExpanded(true);
            setIsFocused(true);
            onExpand?.(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search handmade treasures..."
          className={cn(
            "w-full pl-10 pr-12 py-2.5 rounded-full text-sm bg-transparent",
            "text-charcoal-700 placeholder:text-warm-gray-400",
            "focus:outline-none",
          )}
          aria-label="Search products"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-warm-gray-400 hover:text-charcoal-600"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="hidden sm:flex items-center pr-3">
          <kbd
            className={cn(
              "px-1.5 py-0.5 rounded text-xs font-mono",
              "bg-warm-gray-100 text-warm-gray-500 border border-warm-gray-300",
              "hidden md:inline-block",
            )}
          >
            Ctrl+K
          </kbd>
        </div>
      </div>
    </form>
  );
}
