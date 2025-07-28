"use client";

import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { useInvoiceForm } from "../../index";

function DiscountInput() {
  const { state, setDiscount } = useInvoiceForm();
  const { discount, validation } = state;
  const [hasUserTyped, setHasUserTyped] = useState(false);

  // Reset hasUserTyped when validation state changes (new submit)
  useEffect(() => {
    setHasUserTyped(false);
  }, [validation.isValid, validation.errors.discount]);

  const hasError = validation.errors.discount && !hasUserTyped;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserTyped(true);
    setDiscount(Number(e.target.value));
  };

  return (
    <div className="">
      <Input
        type="number"
        placeholder="Discount Amount"
        value={discount}
        onChange={handleChange}
        className={`h-11 border-2 transition-all duration-200 ${
          hasError
            ? "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100"
            : "border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      {hasError && (
        <p className="text-red-500 text-sm mt-1">
          {validation.errors.discount}
        </p>
      )}
    </div>
  );
}

export default DiscountInput;
