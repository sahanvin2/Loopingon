"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            className={cn(
              "relative w-full bg-white rounded-xl shadow-lg",
              "border border-cream-200",
              sizeStyles[size],
              className,
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
          >
            <div
              className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl opacity-30"
              style={{
                background:
                  "repeating-linear-gradient(90deg, #C75B39 0px, #C75B39 8px, transparent 8px, transparent 16px, #D4A843 16px, #D4A843 20px, transparent 20px, transparent 28px)",
              }}
            />

            {(title || description) && (
              <div className="px-6 pt-6 pb-4">
                {title && (
                  <h2
                    id="modal-title"
                    className="font-serif text-xl text-charcoal-900"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className="mt-1 text-sm text-warm-gray-600"
                  >
                    {description}
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className={cn(
                "absolute top-4 right-4 p-1.5 rounded-lg",
                "text-warm-gray-500 hover:text-charcoal-700",
                "hover:bg-warm-gray-100 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-terracotta-500",
              )}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
