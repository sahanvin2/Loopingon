"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Circle, Clock } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";

interface TimelineEvent {
  status: string;
  label: string;
  timestamp?: string;
  completed: boolean;
  isCurrent: boolean;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function OrderTimeline({ events, className }: OrderTimelineProps) {
  return (
    <div className={cn("", className)}>
      <div className="relative">
        {events.map((event, index) => (
          <div key={event.status} className="flex gap-4 pb-8 relative">
            {index < events.length - 1 && (
              <div
                className={cn(
                  "absolute left-[19px] top-10 w-0.5 h-[calc(100%+0.5rem)]",
                  event.completed ? "bg-teal-500" : "bg-warm-gray-200",
                )}
              />
            )}

            <div className="relative z-10 shrink-0">
              {event.completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center",
                  )}
                >
                  <Check className="w-5 h-5 text-teal-600" />
                </motion.div>
              ) : event.isCurrent ? (
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center"
                  >
                    <Clock className="w-5 h-5 text-terracotta-600" />
                  </motion.div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-warm-gray-100 flex items-center justify-center">
                  <Circle className="w-5 h-5 text-warm-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-1.5">
              <h4
                className={cn(
                  "text-sm font-medium",
                  event.completed || event.isCurrent
                    ? "text-charcoal-900"
                    : "text-warm-gray-500",
                )}
              >
                {event.label}
              </h4>
              {event.timestamp && (
                <p className="text-xs text-warm-gray-500 mt-1">
                  {formatDateTime(event.timestamp)}
                </p>
              )}
              {event.isCurrent && !event.completed && (
                <div className="mt-2 flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-terracotta-500"
                  />
                  <span className="text-xs text-terracotta-600 font-medium">
                    In Progress
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
