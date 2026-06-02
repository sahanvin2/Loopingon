"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CRAFT_TYPES, SRI_LANKAN_DISTRICTS, MATERIALS } from "@/lib/constants";

interface SearchFiltersProps {
  filters: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onClearAll: () => void;
  className?: string;
}

const pricePresets = [
  { label: "Under Rs. 1,000", min: 0, max: 1000 },
  { label: "Rs. 1,000 - Rs. 5,000", min: 1000, max: 5000 },
  { label: "Rs. 5,000 - Rs. 10,000", min: 5000, max: 10000 },
  { label: "Rs. 10,000 - Rs. 25,000", min: 10000, max: 25000 },
  { label: "Over Rs. 25,000", min: 25000, max: undefined },
];

const shippingOptions = [
  { value: "free_domestic", label: "Free Domestic" },
  { value: "international", label: "International Available" },
];

const artisanFeatures = [
  { value: "eco_friendly", label: "Eco-Friendly" },
  { value: "fair_trade", label: "Fair Trade" },
  { value: "customizable", label: "Customizable" },
  { value: "made_to_order", label: "Made to Order" },
];

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-blush-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-sm font-medium text-charcoal-700"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-500" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function findActiveCount(filters: Record<string, unknown>): number {
  let count = 0;
  if (filters.craftType) count++;
  if (filters.rating) count++;
  if (filters.district) count++;
  if (filters.shipping) count++;
  if (filters.features && Array.isArray(filters.features) && filters.features.length > 0)
    count += filters.features.length;
  if (filters.materials && Array.isArray(filters.materials) && filters.materials.length > 0)
    count += filters.materials.length;
  if (filters.onSale) count++;
  return count;
}

export function SearchFilters({
  filters,
  onChange,
  onClearAll,
  className,
}: SearchFiltersProps) {
  const [priceMin, setPriceMin] = useState((filters.minPrice as string) || "");
  const [priceMax, setPriceMax] = useState((filters.maxPrice as string) || "");
  const activeCount = findActiveCount(filters);

  const setPriceRange = (min?: number, max?: number) => {
    setPriceMin(min?.toString() || "");
    setPriceMax(max?.toString() || "");
    onChange("minPrice", min);
    onChange("maxPrice", max);
  };

  return (
    <div className={cn("bg-white rounded-lg border border-blush-200", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-blush-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-600" />
          <span className="text-sm font-medium text-charcoal-700">
            Filters
          </span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-medium">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="max-h-[60vh] overflow-y-auto divide-y divide-cream-200">
        <AccordionSection title="Craft Type">
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {CRAFT_TYPES.slice(0, 15).map((craft) => (
              <label key={craft.value} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={filters.craftType === craft.value}
                  onChange={() =>
                    onChange("craftType", filters.craftType === craft.value ? undefined : craft.value)
                  }
                  className="w-3.5 h-3.5 rounded border-blush-300 text-rose-600"
                />
                <span className="text-muted-600">{craft.label}</span>
              </label>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Price Range">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => {
                  setPriceMin(e.target.value);
                  const v = e.target.value ? parseFloat(e.target.value) : undefined;
                  onChange("minPrice", v);
                }}
                className={cn(
                  "w-1/2 px-3 py-1.5 rounded-lg border border-blush-300 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-rose-500",
                )}
              />
              <span className="text-muted-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => {
                  setPriceMax(e.target.value);
                  const v = e.target.value ? parseFloat(e.target.value) : undefined;
                  onChange("maxPrice", v);
                }}
                className={cn(
                  "w-1/2 px-3 py-1.5 rounded-lg border border-blush-300 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-rose-500",
                )}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pricePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPriceRange(preset.min, preset.max)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs border transition-colors",
                    "border-blush-300 text-muted-600 hover:border-rose-400 hover:text-rose-600",
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Rating">
          <div className="space-y-1.5">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={filters.rating === rating}
                  onChange={() =>
                    onChange("rating", filters.rating === rating ? undefined : rating)
                  }
                  className="w-3.5 h-3.5 rounded border-blush-300 text-rose-600"
                />
                <span className="text-muted-600">
                  {rating}+ Stars
                </span>
              </label>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Location">
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {SRI_LANKAN_DISTRICTS.map((district) => (
              <label key={district} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={filters.district === district}
                  onChange={() =>
                    onChange(
                      "district",
                      filters.district === district ? undefined : district,
                    )
                  }
                  className="w-3.5 h-3.5 rounded border-blush-300 text-rose-600"
                />
                <span className="text-muted-600">{district}</span>
              </label>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Shipping">
          <div className="space-y-1.5">
            {shippingOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={filters.shipping === option.value}
                  onChange={() =>
                    onChange(
                      "shipping",
                      filters.shipping === option.value ? undefined : option.value,
                    )
                  }
                  className="w-3.5 h-3.5 rounded border-blush-300 text-rose-600"
                />
                <span className="text-muted-600">{option.label}</span>
              </label>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Features">
          <div className="space-y-1.5">
            {artisanFeatures.map((feature) => {
              const arr = (filters.features as string[]) || [];
              const checked = arr.includes(feature.value);
              return (
                <label
                  key={feature.value}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? arr.filter((f) => f !== feature.value)
                        : [...arr, feature.value];
                      onChange("features", next.length > 0 ? next : undefined);
                    }}
                    className="w-3.5 h-3.5 rounded border-blush-300 text-rose-600"
                  />
                  <span className="text-muted-600">{feature.label}</span>
                </label>
              );
            })}
          </div>
        </AccordionSection>

        <AccordionSection title="On Sale">
          <label className="flex items-center gap-2 cursor-pointer text-sm py-1">
            <input
              type="checkbox"
              checked={!!filters.onSale}
              onChange={() => onChange("onSale", !filters.onSale ? true : undefined)}
              className="w-3.5 h-3.5 rounded border-blush-300 text-rose-600"
            />
            <span className="text-muted-600">Show only sale items</span>
          </label>
        </AccordionSection>
      </div>
    </div>
  );
}
