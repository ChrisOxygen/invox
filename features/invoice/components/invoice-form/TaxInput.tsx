"use client";

import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { TaxType } from "@prisma/client";
import { useInvoiceForm } from "../../index";

function TaxInput() {
  const { state, setTax } = useInvoiceForm();
  const { tax, taxType, validation } = state;
  const [hasUserTyped, setHasUserTyped] = useState(false);

  // Reset hasUserTyped when validation state changes (new submit)
  useEffect(() => {
    setHasUserTyped(false);
  }, [validation.isValid, validation.errors.tax]);

  const hasError = validation.errors.tax && !hasUserTyped;

  // Dynamic label based on tax type
  const label = taxType === TaxType.FIXED ? "Tax Amount" : "Tax Percentage";

  // Context-aware placeholder based on tax type
  const placeholder =
    taxType === TaxType.FIXED ? "Tax Amount ($)" : "Tax Percentage (%)";

  // Input constraints based on tax type
  const maxValue = taxType === TaxType.PERCENTAGE ? 100 : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserTyped(true);
    const value = e.target.value;

    // Handle empty input
    if (value === "") {
      setTax(0); // Set to 0 for empty input
      return;
    }

    // Convert to number and validate
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setTax(numValue);
    }
  };

  return (
    <div className="w-full">
      {/* Dynamic Label */}
      <label className="text-xs sm:text-sm font-semibold text-gray-900 block mb-2 sm:mb-3">
        {label}
      </label>

      <Input
        type="number"
        placeholder={placeholder}
        value={tax ?? ""}
        onChange={handleChange}
        min="0"
        max={maxValue}
        step="0.01"
        inputMode="decimal"
        aria-label={`Enter ${
          taxType === TaxType.FIXED ? "tax amount in dollars" : "tax percentage"
        }`}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={hasError ? "tax-error" : undefined}
        className={`h-9 sm:h-11 border-2 transition-all duration-200 text-xs sm:text-sm ${
          hasError
            ? "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100"
            : "border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      {hasError && (
        <p
          id="tax-error"
          className="text-red-500 text-xs sm:text-sm mt-1"
          role="alert"
        >
          {validation.errors.tax}
        </p>
      )}

      {/* Helper text for percentage type */}
      {taxType === TaxType.PERCENTAGE && !hasError && (
        <p className="text-xs text-gray-500 mt-1">
          Enter a value between 0 and 100
        </p>
      )}
    </div>
  );
}

export default TaxInput;
