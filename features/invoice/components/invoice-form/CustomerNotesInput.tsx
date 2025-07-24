"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CustomNotesProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  className?: string;
  maxLength?: number;
  rows?: number;
  required?: boolean;
}

export function CustomerNotesInput({
  value,
  onChange,
  placeholder = "Thanks for trusting us",
  disabled = false,
  label = "Custom Notes",
  maxLength = 500,
  rows = 4,
  required = false,
}: CustomNotesProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Respect max length if provided
    if (maxLength && newValue.length > maxLength) {
      return;
    }

    onChange(newValue);
  };

  const characterCount = value.length;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;
  const isAtLimit = maxLength && characterCount >= maxLength;

  return (
    <div className="space-y-2">
      {/* Label */}
      <Label
        htmlFor="custom-notes"
        className="text-sm font-medium text-gray-900"
      >
        {label}
        {required && <span className="text-gray-400 ml-1">*</span>}
      </Label>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          id="custom-notes"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(
            "resize-none min-h-[100px] border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200",
            "placeholder:text-gray-500",
            "text-gray-900",
            "bg-white",
            disabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
            isAtLimit &&
              "border-red-300 focus:border-red-400 focus:ring-red-400"
          )}
          aria-describedby={maxLength ? "notes-character-count" : undefined}
          required={required}
        />

        {/* Character Count */}
        {maxLength && (
          <div
            id="notes-character-count"
            className={cn(
              "absolute bottom-3 right-3 text-xs bg-white px-2 py-1 rounded",
              isAtLimit
                ? "text-red-600"
                : isNearLimit
                ? "text-orange-600"
                : "text-gray-400"
            )}
          >
            {characterCount}/{maxLength}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="text-xs text-gray-500">
        Add a personalized message to your invoice. This will appear at the
        bottom of your invoice.
      </div>
    </div>
  );
}

// Export with original name for backward compatibility
export default CustomerNotesInput;
