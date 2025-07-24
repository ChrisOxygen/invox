"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, Clock, Save, AlertCircle } from "lucide-react";
import { useInvoiceForm } from "../context/InvoiceFormProvider";
import { createFingerprint } from "../utils";

export type SaveStatus = "unsaved" | "saved" | "saved_to_draft" | "saving";

interface SaveStatusIndicatorProps {
  className?: string;
}

const statusConfig = {
  unsaved: {
    icon: AlertCircle,
    text: "Unsaved",
    className: "text-amber-600 bg-amber-50 border border-amber-200",
  },
  saved: {
    icon: Check,
    text: "Saved",
    className: "text-green-600 bg-green-50 border border-green-200",
  },
  saved_to_draft: {
    icon: Save,
    text: "Saved to Draft",
    className: "text-blue-600 bg-blue-50 border border-blue-200",
  },
  saving: {
    icon: Clock,
    text: "Saving",
    className: "text-blue-600 bg-blue-50 border border-blue-200",
  },
};

export function SaveStatusIndicator({ className }: SaveStatusIndicatorProps) {
  const { state, isSaving } = useInvoiceForm();
  const [status, setStatus] = useState<SaveStatus>("unsaved");

  // Initialize form state fingerprint
  const [formFingerprint, setFormFingerprint] = useState("");

  // Generate a fingerprint of key form state values that should trigger "unsaved" status
  useEffect(() => {
    const newFingerprint = createFingerprint(state);

    // If there's a previous fingerprint and it's different, form has changed
    if (formFingerprint && formFingerprint !== newFingerprint && !isSaving) {
      setStatus("unsaved");
    }

    setFormFingerprint(newFingerprint);
  }, [state, formFingerprint, isSaving]);

  // Track saving state
  useEffect(() => {
    if (isSaving) {
      setStatus("saving");
    } else if (status === "saving") {
      // Just finished saving
      if (state.invoiceStatus === "DRAFT") {
        setStatus("saved_to_draft");
      } else {
        setStatus("saved");
      }
    }
  }, [isSaving, state.invoiceStatus, status]);

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm",
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
      <span className="hidden sm:inline">{config.text}</span>
    </div>
  );
}
