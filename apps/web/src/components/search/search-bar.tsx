"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, History, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

const POPULAR_SEARCHES = [
  "Batik Tote Bag",
  "Clay Planter",
  "Wooden Name Board",
  "Soy Wax Candle",
  "Resin Ocean Art",
];

const CATEGORY_SUGGESTIONS = [
  { name: "Home Decor", icon: Tag },
  { name: "Jewelry", icon: Tag },
  { name: "Bags & Accessories", icon: Tag },
];

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
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const expanded = controlledExpanded ?? isExpanded;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuery("");
        setIsExpanded(false);
        onExpand?.(false);
        inputRef.current?.blur();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setIsFocused(false);
        onExpand?.(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (onSubmit) {
      onSubmit(suggestion);
    } else {
      router.push(`/products?q=${encodeURIComponent(suggestion)}`);
    }
    setIsExpanded(false);
    onExpand?.(false);
  };

  const showSuggestions = (isFocused || expanded) && (query.length > 0 || !query);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className="w-full relative z-20"
      >
      <div
        className={cn(
          "flex items-center rounded-full border bg-white transition-all duration-300",
          isFocused || expanded
            ? "w-full ring-2 ring-primary-500 border-transparent"
            : "border-muted-300 w-full max-w-md",
        )}
      >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-500 shrink-0" />

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
            "text-text-700 placeholder:text-muted-400",
            "focus:outline-none",
          )}
          aria-label="Search products"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-400 hover:text-text-600"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      </form>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-soft-xl border border-surface-200 overflow-hidden z-10 py-4"
          >
            {query.length > 0 ? (
              <div className="px-4">
                <p className="text-xs font-bold text-muted-400 uppercase tracking-wider mb-2 px-2">Suggestions</p>
                {POPULAR_SEARCHES.filter(s => s.toLowerCase().includes(query.toLowerCase())).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-700 hover:bg-surface-50 hover:text-primary-600 rounded-lg transition-colors text-left"
                  >
                    <Search className="w-4 h-4 text-muted-400 shrink-0" />
                    <span>
                      <span className="font-semibold">{query}</span>
                      {suggestion.toLowerCase().split(query.toLowerCase())[1] || suggestion.substring(query.length)}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 px-6">
                <div className="flex-1">
                  <p className="flex items-center gap-2 text-xs font-bold text-muted-400 uppercase tracking-wider mb-3">
                    <TrendingUp className="w-4 h-4" /> Trending Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((search) => (
                      <button
                        key={search}
                        type="button"
                        onClick={() => handleSuggestionClick(search)}
                        className="px-3 py-1.5 rounded-full bg-surface-100 text-text-600 text-xs font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="flex items-center gap-2 text-xs font-bold text-muted-400 uppercase tracking-wider mb-3">
                    <History className="w-4 h-4" /> Suggested Categories
                  </p>
                  <div className="space-y-1">
                    {CATEGORY_SUGGESTIONS.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => handleSuggestionClick(cat.name)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-600 hover:bg-surface-50 hover:text-primary-600 rounded-lg transition-colors text-left"
                      >
                        <cat.icon className="w-4 h-4 text-muted-400" />
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
