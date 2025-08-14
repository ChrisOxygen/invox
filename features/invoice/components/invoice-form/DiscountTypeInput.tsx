"use client";

import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DiscountType } from "@prisma/client";
import { useInvoiceForm } from "../../index";

function DiscountTypeInput() {
  const { state, setDiscountType } = useInvoiceForm();
  const { discountType, validation } = state;
  const [hasUserTyped, setHasUserTyped] = useState(false);

  // Reset hasUserTyped when validation state changes (new submit)
  useEffect(() => {
    setHasUserTyped(false);
  }, [validation.isValid, validation.errors.discount]);

  const hasError = validation.errors.discount && !hasUserTyped;

  const handleValueChange = (value: string) => {
    setHasUserTyped(true);
    setDiscountType(value as DiscountType);
  };

  return (
    <div className="w-full">
      {/* Label */}
      <label className="text-xs sm:text-sm font-semibold text-gray-900 block mb-2 sm:mb-3">
        Discount Type
      </label>

      <fieldset className="w-full">
        <legend className="sr-only">Discount Type Selection</legend>
        <RadioGroup
          value={discountType}
          onValueChange={handleValueChange}
          className="flex flex-row gap-4 sm:gap-6 w-full"
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <RadioGroupItem
              value={DiscountType.FIXED}
              id="discount-fixed"
              className={`border-2 transition-all duration-200 w-4 h-4 sm:w-5 sm:h-5 ${
                hasError
                  ? "border-red-300 hover:border-red-400 focus:border-red-500"
                  : "border-blue-200 hover:border-blue-400 focus:border-blue-600"
              }`}
            />
            <Label
              htmlFor="discount-fixed"
              className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
            >
              <span className="hidden sm:inline">Fixed Amount</span>
              <span className="sm:hidden">Fixed</span>
            </Label>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <RadioGroupItem
              value={DiscountType.PERCENTAGE}
              id="discount-percentage"
              className={`border-2 transition-all duration-200 w-4 h-4 sm:w-5 sm:h-5 ${
                hasError
                  ? "border-red-300 hover:border-red-400 focus:border-red-500"
                  : "border-blue-200 hover:border-blue-400 focus:border-blue-600"
              }`}
            />
            <Label
              htmlFor="discount-percentage"
              className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
            >
              Percentage
            </Label>
          </div>
        </RadioGroup>
      </fieldset>

      {/* Error Message */}
      {hasError && (
        <p className="text-red-500 text-xs sm:text-sm mt-2 font-medium">
          {validation.errors.discount}
        </p>
      )}
    </div>
  );
}

export default DiscountTypeInput;
