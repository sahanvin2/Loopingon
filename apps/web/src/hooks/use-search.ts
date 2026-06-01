"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, Product } from "@/types";
import type { SearchInput } from "@/lib/validators";
import { useDebounce } from "./use-debounce";

interface SearchResult {
  products: Product[];
  suggestions: string[];
  totalCount: number;
}

export function useSearch(query: string, filters?: Partial<SearchInput>) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["search", debouncedQuery, filters],
    queryFn: async () => {
      const params: Record<string, unknown> = {
        query: debouncedQuery,
        page: 1,
        limit: 20,
        ...filters,
      };

      const response = await get<PaginatedResponse<Product>>("/search", params);
      return response;
    },
    enabled: debouncedQuery.length >= 2 || Object.keys(filters || {}).length > 0,
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useSuggestions(query: string) {
  const debouncedQuery = useDebounce(query, 200);

  return useQuery({
    queryKey: ["search", "suggestions", debouncedQuery],
    queryFn: async () => {
      const response = await get<ApiResponse<string[]>>("/search/suggestions", {
        query: debouncedQuery,
      });
      return response.data;
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 1000,
  });
}

export function useTrendingSearches() {
  return useQuery({
    queryKey: ["search", "trending"],
    queryFn: async () => {
      const response = await get<ApiResponse<string[]>>("/search/trending");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchProducts(params: Partial<SearchInput>) {
  return useQuery({
    queryKey: ["search", "products", params],
    queryFn: async () => {
      const response = await get<PaginatedResponse<Product>>("/search/products", params);
      return response;
    },
    enabled: !!(params.query || params.category || params.craftType),
    staleTime: 30 * 1000,
  });
}
