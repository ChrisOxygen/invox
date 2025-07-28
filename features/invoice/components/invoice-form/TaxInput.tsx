"use client";

import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { useInvoiceForm } from "../../index";

function TaxInput() {
  const { state, setTax } = useInvoiceForm();
  const { tax, validation } = state;
  const [hasUserTyped, setHasUserTyped] = useState(false);

  // Reset hasUserTyped when validation state changes (new submit)
  useEffect(() => {
    setHasUserTyped(false);
  }, [validation.isValid, validation.errors.tax]);

  const hasError = validation.errors.tax && !hasUserTyped;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserTyped(true);
    setTax(Number(e.target.value));
  };

  return (
    <div className="">
      <Input
        type="number"
        placeholder="Tax Amount"
        value={tax}
        onChange={handleChange}
        className={`h-11 border-2 transition-all duration-200 ${
          hasError
            ? "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100"
            : "border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      {hasError && (
        <p className="text-red-500 text-sm mt-1">{validation.errors.tax}</p>
      )}
    </div>
  );
}

export default TaxInput;
