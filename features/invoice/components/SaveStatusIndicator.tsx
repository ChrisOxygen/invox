"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, Clock, Save, AlertCircle } from "lucide-react";

export type SaveStatus = "unsaved" | "saved" | "saved_to_draft" | "saving";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  className?: string;
}

const statusConfig = {
  unsaved: {
    icon: AlertCircle,
    text: "Unsaved",
    className: "text-gray-500",
  },
  saved: {
    icon: Check,
    text: "Saved",
    className: "text-green-700",
  },
  saved_to_draft: {
    icon: Save,
    text: "Saved to Draft",
    className: "text-blue-700",
  },
  saving: {
    icon: Clock,
    text: "Saving",
    className: "text-yellow-700",
  },
};

export function SaveStatusIndicator({
  status,
  className,
}: SaveStatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
        config.className,
        className
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          status === "saving" && "animate-spin"
        )}
      />
      <span>{config.text}</span>
    </div>
  );
}
