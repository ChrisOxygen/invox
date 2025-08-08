"use client";

import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { DiscountType } from "@prisma/client";
import { useInvoiceForm } from "../../index";

function DiscountInput() {
  const { state, setDiscount } = useInvoiceForm();
  const { discount, discountType, validation } = state;
  const [hasUserTyped, setHasUserTyped] = useState(false);

  // Reset hasUserTyped when validation state changes (new submit)
  useEffect(() => {
    setHasUserTyped(false);
  }, [validation.isValid, validation.errors.discount]);

  const hasError = validation.errors.discount && !hasUserTyped;

  // Dynamic label based on discount type
  const label =
    discountType === DiscountType.FIXED
      ? "Discount Amount"
      : "Discount Percentage";

  // Context-aware placeholder based on discount type
  const placeholder =
    discountType === DiscountType.FIXED
      ? "Discount Amount ($)"
      : "Discount Percentage (%)";

  // Input constraints based on discount type
  const maxValue = discountType === DiscountType.PERCENTAGE ? 100 : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserTyped(true);
    const value = e.target.value;

    // Handle empty input
    if (value === "") {
      setDiscount(0); // Set to 0 for empty input
      return;
    }

    // Convert to number and validate
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setDiscount(numValue);
    }
  };

  return (
    <div className="w-full">
      {/* Dynamic Label */}
      <label className="text-sm font-semibold text-gray-900 block mb-3">
        {label}
      </label>

      <Input
        type="number"
        placeholder={placeholder}
        value={discount ?? ""}
        onChange={handleChange}
        min="0"
        max={maxValue}
        step="0.01"
        inputMode="decimal"
        aria-label={`Enter ${
          discountType === DiscountType.FIXED
            ? "discount amount in dollars"
            : "discount percentage"
        }`}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={hasError ? "discount-error" : undefined}
        className={`h-11 border-2 transition-all duration-200 ${
          hasError
            ? "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100"
            : "border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      {hasError && (
        <p
          id="discount-error"
          className="text-red-500 text-sm mt-1"
          role="alert"
        >
          {validation.errors.discount}
        </p>
      )}

      {/* Helper text for percentage type */}
      {discountType === DiscountType.PERCENTAGE && !hasError && (
        <p className="text-xs text-gray-500 mt-1">
          Enter a value between 0 and 100
        </p>
      )}
    </div>
  );
}

export default DiscountInput;
