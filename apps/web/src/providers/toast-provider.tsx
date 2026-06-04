"use client";

import React from "react";
import { Toaster } from "sonner";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        duration={4000}
        visibleToasts={5}
        toastOptions={{
          style: {
            background: "#fdfaf5",
            border: "1px solid rgba(176, 86, 110, 0.2)",
            color: "#1e191c",
            fontFamily: "Inter, system-ui, sans-serif",
          },
          classNames: {
            toast: "rounded-lg shadow-soft-md",
            title: "text-sm font-semibold",
            description: "text-xs text-muted-700",
            success: "!bg-muted-50 !border-muted-200 !text-muted-900",
            error: "!bg-red-50 !border-red-200 !text-red-900",
            warning: "!bg-accent-50 !border-accent-200 !text-accent-900",
            info: "!bg-blue-50 !border-blue-200 !text-blue-900",
            closeButton: "!text-text-500 hover:!text-text-800",
          },
        }}
        icons={{
          success: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-muted-600"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          ),
          error: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-red-600"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          ),
        }}
      />
    </>
  );
}
