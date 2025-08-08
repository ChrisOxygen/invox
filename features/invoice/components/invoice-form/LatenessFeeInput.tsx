"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useInvoiceForm } from "../../index";

// Late fee options constants
const LATE_FEE_OPTIONS = [
  { value: "no-fees", label: "No late fees" },
  { value: "1.5-percent", label: "1.5% per month" },
  { value: "2-percent", label: "2% per month" },
  { value: "25-flat", label: "$25 flat fee" },
  { value: "custom", label: "Custom amount" },
];

function LatenessFeeInput() {
  const [selectedLateFee, setSelectedLateFee] = useState<string>("");
  const [customLateFee, setCustomLateFee] = useState<string>("");
  const [showCustomLateFeeInput, setShowCustomLateFeeInput] =
    useState<boolean>(false);
  const [hasUserTyped, setHasUserTyped] = useState(false);

  const { state, setLateFeeTerms } = useInvoiceForm();
  const { lateFeeTerms, validation } = state;

  // Initialize component state from form state
  useEffect(() => {
    if (lateFeeTerms) {
      // Check if the current value matches a predefined option
      const matchingOption = LATE_FEE_OPTIONS.find(
        (option) => option.label === lateFeeTerms
      );
      if (matchingOption) {
        setSelectedLateFee(matchingOption.value);
        setShowCustomLateFeeInput(false);
        setCustomLateFee("");
      } else {
        // It's a custom value
        setSelectedLateFee("custom");
        setCustomLateFee(lateFeeTerms);
        setShowCustomLateFeeInput(true);
      }
    }
  }, [lateFeeTerms]);

  // Reset hasUserTyped when validation state changes (new submit)
  useEffect(() => {
    setHasUserTyped(false);
  }, [validation.isValid, validation.errors.lateFeeTerms]);

  const hasError = validation.errors.lateFeeTerms && !hasUserTyped;
  const handleLateFeeSelect = (value: string) => {
    setHasUserTyped(true);
    setSelectedLateFee(value);

    if (value === "custom") {
      setShowCustomLateFeeInput(true);
      // Don't set the form value yet, wait for custom input
    } else {
      setShowCustomLateFeeInput(false);
      setCustomLateFee("");
      // Set the display label as the form value
      const selectedOption = LATE_FEE_OPTIONS.find(
        (option) => option.value === value
      );
      if (selectedOption) {
        setLateFeeTerms(selectedOption.label);
      }
    }
  };

  const handleCustomLateFeeChange = (value: string) => {
    setHasUserTyped(true);
    setCustomLateFee(value);
    setLateFeeTerms(value);
  };

  return (
    <div className="w-full">
      {/* Internal Label */}
      <label className="text-sm font-semibold text-gray-900 block mb-3">
        Late Fee Options
      </label>

      <div className="space-y-2">
        <Select onValueChange={handleLateFeeSelect} value={selectedLateFee}>
          <SelectTrigger
            className={`w-full h-11 border-2 transition-all duration-200 ${
              hasError
                ? "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100"
                : "border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            }`}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? "late-fee-error" : undefined}
          >
            <SelectValue placeholder="Select late fee option" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-blue-200 shadow-xl rounded-lg">
            {LATE_FEE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors duration-200"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Error Message */}
        {hasError && (
          <p
            id="late-fee-error"
            className="text-red-500 text-sm mt-1"
            role="alert"
          >
            {validation.errors.lateFeeTerms}
          </p>
        )}

        {/* Custom late fee input */}
        {showCustomLateFeeInput && (
          <div className="space-y-2">
            <Input
              placeholder="Enter custom late fee terms (e.g., $50 flat fee, 3% per month)"
              value={customLateFee}
              onChange={(e) => handleCustomLateFeeChange(e.target.value)}
              maxLength={200}
              className={`h-11 border-2 transition-all duration-200 ${
                hasError
                  ? "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  : "border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              }`}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? "late-fee-error" : "late-fee-helper"}
            />
            {!hasError && (
              <p id="late-fee-helper" className="text-xs text-gray-500">
                Maximum 200 characters
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LatenessFeeInput;
