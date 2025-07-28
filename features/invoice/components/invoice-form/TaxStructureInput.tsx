"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import React from "react";
import { useInvoiceForm } from "../../index";

function TaxStructureInput() {
  const { state, setTaxStructure } = useInvoiceForm();
  const { taxStructure } = state;

  return (
    <div className="w-full">
      <RadioGroup
        value={taxStructure}
        onValueChange={(value) =>
          setTaxStructure(value as "flat" | "percentage")
        }
        className="flex flex-row gap-6 w-full"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="flat"
            id="tax-flat"
            className="border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 transition-all duration-200"
          />
          <Label
            htmlFor="tax-flat"
            className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
          >
            Flat Amount
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="percentage"
            id="tax-percentage"
            className="border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 transition-all duration-200"
          />
          <Label
            htmlFor="tax-percentage"
            className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
          >
            Percentage
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default TaxStructureInput;
