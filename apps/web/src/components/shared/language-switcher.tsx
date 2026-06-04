"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface Language {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "si", label: "Sinhala", nativeLabel: "සිංහල", flag: "🇱🇰" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", flag: "🇱🇰" },
];

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const [selected, setSelected] = useState<Language>(() => {
    if (typeof window === "undefined") return languages[0];
    const stored = localStorage.getItem("preferred-language") || "en";
    return languages.find((l) => l.code === stored) || languages[0];
  });
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setSelected(lang);
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", lang.code);
      document.cookie = `preferred-language=${lang.code};path=/;max-age=31536000`;
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm",
          "text-text-700 hover:bg-muted-100 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className="text-base">{selected.flag}</span>
        <span className="hidden sm:inline">{selected.nativeLabel}</span>
        <Languages className="w-3.5 h-3.5 text-muted-500 sm:hidden" />
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-500 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-soft-md",
              "border border-accent-200 overflow-hidden z-50",
            )}
            role="listbox"
            aria-label="Choose language"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2.5 text-sm transition-colors",
                  "hover:bg-primary-50",
                  selected.code === lang.code
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-text-700",
                )}
                role="option"
                aria-selected={selected.code === lang.code}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.nativeLabel}</span>
                {selected.code === lang.code && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary-500" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
