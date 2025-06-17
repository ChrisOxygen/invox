"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useInvoiceForm } from "../../context/InvoiceFormProvider";

function LatenessFeeInput() {
  const [selectedLateFee, setSelectedLateFee] = useState<string>("");
  const [customLateFee, setCustomLateFee] = useState<string>("");
  const [showCustomLateFeeInput, setShowCustomLateFeeInput] =
    useState<boolean>(false);

  const { setLateFeeText } = useInvoiceForm();

  const lateFeeOptions = [
    { value: "no-fees", label: "No late fees" },
    { value: "1.5-percent", label: "1.5% per month" },
    { value: "2-percent", label: "2% per month" },
    { value: "25-flat", label: "$25 flat fee" },
    { value: "custom", label: "Custom amount" },
  ];
  const handleLateFeeSelect = (value: string) => {
    setSelectedLateFee(value);
    setLateFeeText(value);
    if (value === "custom") {
      setShowCustomLateFeeInput(true);
    } else {
      setShowCustomLateFeeInput(false);
      setCustomLateFee("");
    }
  };

  const handleCustomLateFeeChange = (value: string) => {
    setCustomLateFee(value);
    setLateFeeText(value);
  };
  return (
    <div className="">
      {/* Late Fee Options */}
      <div className="space-y-2">
        <label className="font-inter hidden text-sm font-medium text-gray-700 ">
          Late Fee Options
        </label>
        <Select onValueChange={handleLateFeeSelect} value={selectedLateFee}>
          <SelectTrigger className="w-full h-12 sm:h-14 font-inter text-left text-sm sm:text-base">
            <SelectValue placeholder="Select late fee option" />
          </SelectTrigger>
          <SelectContent>
            {lateFeeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="font-inter text-sm sm:text-base"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Custom late fee input */}
        {showCustomLateFeeInput && (
          <div className="space-y-2">
            <Input
              placeholder="Enter custom amount or percentage"
              value={customLateFee}
              onChange={(e) => handleCustomLateFeeChange(e.target.value)}
              className="h-12 sm:h-14 font-inter text-sm sm:text-base"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default LatenessFeeInput;
