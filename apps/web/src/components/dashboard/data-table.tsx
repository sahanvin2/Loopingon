"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortDirection = "asc" | "desc" | null;

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: any) => React.ReactNode);
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  showSelection?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  getRowId?: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  showSelection = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row) => (row.id as string) || "",
  onRowClick,
  emptyMessage = "No data found",
  className,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  const handleSort = (accessor: keyof T | string) => {
    if (typeof accessor !== "string") return;
    if (sortColumn === accessor) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else setSortDirection("asc");
    } else {
      setSortColumn(accessor);
      setSortDirection("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedRows.size === data.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map((row) => getRowId(row))));
    }
  };

  const handleSelectRow = (rowId: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedRows);
    if (next.has(rowId)) next.delete(rowId);
    else next.add(rowId);
    onSelectionChange(next);
  };

  const renderSortIcon = (columnAccessor: keyof T | string) => {
    if (typeof columnAccessor !== "string") return null;
    if (sortColumn !== columnAccessor)
      return <ChevronsUpDown className="w-3.5 h-3.5 text-warm-gray-400" />;
    if (sortDirection === "asc")
      return <ChevronUp className="w-3.5 h-3.5 text-terracotta-600" />;
    return <ChevronDown className="w-3.5 h-3.5 text-terracotta-600" />;
  };

  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-lg border border-cream-200 overflow-hidden", className)}>
        <div className="divide-y divide-cream-200">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-4 w-4 rounded bg-warm-gray-200 animate-pulse" />
              <div className="h-4 flex-1 rounded bg-warm-gray-200 animate-pulse" />
              <div className="h-4 w-20 rounded bg-warm-gray-200 animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-warm-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-cream-200 overflow-hidden",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-200 bg-cream-50">
              {showSelection && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedRows.size === data.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-cream-300 text-terracotta-600 focus:ring-terracotta-500"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col, i) => {
                const accessorStr = typeof col.accessor === "string" ? col.accessor : null;
                return (
                  <th
                    key={i}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-semibold text-warm-gray-600 uppercase tracking-wider",
                      col.headerClassName,
                    )}
                  >
                    {col.sortable && accessorStr ? (
                      <button
                        type="button"
                        onClick={() => handleSort(accessorStr)}
                        className="inline-flex items-center gap-1 hover:text-charcoal-700 transition-colors"
                      >
                        {col.header}
                        {renderSortIcon(accessorStr)}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showSelection ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-warm-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => {
                const rowId = getRowId(row);
                return (
                  <tr
                    key={rowId || rowIndex}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "transition-colors",
                      rowIndex % 2 === 0 ? "bg-white" : "bg-cream-50/50",
                      onRowClick && "cursor-pointer hover:bg-terracotta-50",
                      selectedRows.has(rowId) && "bg-terracotta-50",
                    )}
                  >
                    {showSelection && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowId)}
                          onChange={() => handleSelectRow(rowId)}
                          className="w-4 h-4 rounded border-cream-300 text-terracotta-600 focus:ring-terracotta-500"
                          aria-label={`Select row ${rowId}`}
                        />
                      </td>
                    )}
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn(
                          "px-4 py-3 text-sm text-charcoal-700",
                          col.className,
                        )}
                      >
                        {typeof col.accessor === "function"
                          ? col.accessor(row)
                          : (row[col.accessor] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
