"use client";

import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const currencies = [
  { code: "LKR", symbol: "රු", name: "Sri Lankan Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
];

interface CurrencyContextType {
  currency: string;
  setCurrency: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "LKR",
  setCurrency: () => {},
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

interface CurrencySwitcherProps {
  className?: string;
}

export function CurrencySwitcher({ className }: CurrencySwitcherProps) {
  const [selected, setSelected] = useState(() => {
    if (typeof window === "undefined") return currencies[0];
    const stored = localStorage.getItem("preferred-currency") || "LKR";
    return currencies.find((c) => c.code === stored) || currencies[0];
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

  const handleSelect = (currency: (typeof currencies)[0]) => {
    setSelected(currency);
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-currency", currency.code);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: selected.code,
        setCurrency: (code: string) => {
          const c = currencies.find((cur) => cur.code === code);
          if (c) setSelected(c);
        },
      }}
    >
      <div ref={ref} className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm",
            "text-charcoal-700 hover:bg-muted-100 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-rose-500",
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Select currency"
        >
          <span className="font-medium">{selected.symbol}</span>
          <span className="hidden sm:inline">{selected.code}</span>
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
                "absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-soft-md",
                "border border-blush-200 overflow-hidden z-50",
              )}
              role="listbox"
              aria-label="Choose currency"
            >
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleSelect(currency)}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-3 py-2.5 text-sm transition-colors",
                    "hover:bg-rose-50",
                    selected.code === currency.code
                      ? "bg-rose-50 text-rose-700 font-medium"
                      : "text-charcoal-700",
                  )}
                  role="option"
                  aria-selected={selected.code === currency.code}
                >
                  <span className="font-medium w-8 text-left">{currency.symbol}</span>
                  <span>{currency.name}</span>
                  {selected.code === currency.code && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CurrencyContext.Provider>
  );
}
