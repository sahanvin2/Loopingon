"use client";

import { toast as sonnerToast } from "sonner";

export { Toaster } from "sonner";

function triggerToast(message: string, variant: "success" | "error" | "warning" | "info") {
  const styles = {
    success: {
      style: {
        background: "#ecfdf5",
        border: "1px solid #827378",
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
        border: "1px solid #dc9b91",
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
  success: (msg: string) => triggerToast(msg, "success"),
  error: (msg: string) => triggerToast(msg, "error"),
  warning: (msg: string) => triggerToast(msg, "warning"),
  info: (msg: string) => triggerToast(msg, "info"),
};
