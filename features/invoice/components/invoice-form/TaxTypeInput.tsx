"use client";

import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TaxType } from "@prisma/client";
import { useInvoiceForm } from "../../index";

function TaxTypeInput() {
  const { state, setTaxType } = useInvoiceForm();
  const { taxType, validation } = state;
  const [hasUserTyped, setHasUserTyped] = useState(false);

  // Reset hasUserTyped when validation state changes (new submit)
  useEffect(() => {
    setHasUserTyped(false);
  }, [validation.isValid, validation.errors.tax]);

  const hasError = validation.errors.tax && !hasUserTyped;

  const handleValueChange = (value: string) => {
    setHasUserTyped(true);
    setTaxType(value as TaxType);
  };

  return (
    <div className="w-full">
      <fieldset className="w-full">
        <legend className="sr-only">Tax Type Selection</legend>
        <RadioGroup
          value={taxType}
          onValueChange={handleValueChange}
          className="flex flex-row gap-6 w-full"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={TaxType.FIXED}
              id="tax-fixed"
              className={`border-2 transition-all duration-200 ${
                hasError
                  ? "border-red-300 hover:border-red-400 focus:border-red-500"
                  : "border-blue-200 hover:border-blue-400 focus:border-blue-600"
              }`}
            />
            <Label
              htmlFor="tax-fixed"
              className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
            >
              Fixed Amount
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={TaxType.PERCENTAGE}
              id="tax-percentage"
              className={`border-2 transition-all duration-200 ${
                hasError
                  ? "border-red-300 hover:border-red-400 focus:border-red-500"
                  : "border-blue-200 hover:border-blue-400 focus:border-blue-600"
              }`}
            />
            <Label
              htmlFor="tax-percentage"
              className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
            >
              Percentage
            </Label>
          </div>
        </RadioGroup>
      </fieldset>

      {/* Error Message */}
      {hasError && (
        <p className="text-red-500 text-sm mt-2 font-medium">
          {validation.errors.tax}
        </p>
      )}
    </div>
  );
}

export default TaxTypeInput;
