"use client";

import { toast as sonnerToast } from "sonner";

export { Toaster } from "sonner";

function showToast(message: string, variant: "success" | "error" | "warning" | "info") {
  const styles = {
    success: {
      style: {
        background: "#ecfdf5",
        border: "1px solid #2D8B7D",
        color: "#1a4944",
      },
    },
    error: {
      style: {
        background: "#fef2f2",
        border: "1px solid #dc2626",
        color: "#991b1b",
      },
    },
    warning: {
      style: {
        background: "#fefce8",
        border: "1px solid #D4A843",
        color: "#735a1f",
      },
    },
    info: {
      style: {
        background: "#eef7f5",
        border: "1px solid #88cdbf",
        color: "#1a4944",
      },
    },
  };

  sonnerToast[variant === "info" ? "message" : variant](message, {
    ...styles[variant],
    duration: 4000,
  });
}

export const showToast = {
  success: (msg: string) => showToast(msg, "success"),
  error: (msg: string) => showToast(msg, "error"),
  warning: (msg: string) => showToast(msg, "warning"),
  info: (msg: string) => showToast(msg, "info"),
};
