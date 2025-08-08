"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useInvoiceForm } from "../../index";

function CustomerNotesInput() {
  const [hasUserTyped, setHasUserTyped] = useState(false);

  const { state, setCustomNote } = useInvoiceForm();
  const { customNote, validation } = state;

  // Reset hasUserTyped when validation state changes (new submit)
  useEffect(() => {
    setHasUserTyped(false);
  }, [validation.isValid, validation.errors.customNote]);

  const hasError = validation.errors.customNote && !hasUserTyped;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Respect max length (240 characters to match validation)
    if (newValue.length > 240) {
      return;
    }

    setHasUserTyped(true);
    setCustomNote(newValue);
  };

  const characterCount = customNote.length;
  const maxLength = 240;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isAtLimit = characterCount >= maxLength;

  return (
    <div className="w-full">
      {/* Internal Label */}
      <label 
        htmlFor="custom-notes"
        className="text-sm font-semibold text-gray-900 block mb-3"
      >
        Customer Notes
      </label>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          id="custom-notes"
          value={customNote}
          onChange={handleChange}
          placeholder="Thanks for trusting us with your business..."
          rows={4}
          className={cn(
            "resize-none min-h-[100px] border-2 transition-all duration-200",
            "placeholder:text-gray-500",
            "text-gray-900",
            "bg-white",
            hasError
              ? "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100"
              : "border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100",
            isAtLimit &&
              "border-red-300 focus:border-red-400 focus:ring-red-400"
          )}
          aria-describedby="notes-character-count notes-helper"
          aria-invalid={hasError ? "true" : "false"}
        />

        {/* Character Count */}
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
      </div>

      {/* Error Message */}
      {hasError && (
        <p id="custom-notes-error" className="text-red-500 text-sm mt-1" role="alert">
          {validation.errors.customNote}
        </p>
      )}

      {/* Helper Text */}
      {!hasError && (
        <p id="notes-helper" className="text-xs text-gray-500 mt-1">
          Add a personalized message to your invoice. This will appear at the bottom of your invoice.
        </p>
      )}
    </div>
  );
}

export default CustomerNotesInput;
