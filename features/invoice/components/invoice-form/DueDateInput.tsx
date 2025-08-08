"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DUE_DATE_PRESETS } from "@/constants";
import { calculateDueDate } from "@/utils";
import { useInvoiceForm } from "../../index";

export function DueDateInput() {
  const { state, setPaymentDueDate } = useInvoiceForm();
  const { validation, paymentDueDate } = state;
  const [hasUserTyped, setHasUserTyped] = useState(false);
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Internal props - no external configuration needed
  const value = paymentDueDate;
  const disabled = false; // Can be extended later if needed
  const placeholder =
    mode === "preset" ? "Select payment terms..." : "Pick a date...";

  // Reset hasUserTyped when validation state changes (new submit)
  useEffect(() => {
    setHasUserTyped(false);
  }, [validation.isValid, validation.errors.paymentDueDate]);

  const hasError = validation.errors.paymentDueDate && !hasUserTyped;

  // Find if a date matches any preset
  const findMatchingPreset = useCallback((date: Date): string | null => {
    const today = new Date();
    const presetDates = {
      net_15: calculateDueDate("net_15", today),
      net_30: calculateDueDate("net_30", today),
      net_45: calculateDueDate("net_45", today),
      net_60: calculateDueDate("net_60", today),
      due_on_receipt: calculateDueDate("due_on_receipt", today),
      due_end_of_month: calculateDueDate("due_end_of_month", today),
      due_end_of_next_month: calculateDueDate("due_end_of_next_month", today),
    };

    for (const [preset, presetDate] of Object.entries(presetDates)) {
      if (presetDate.getTime() === date.getTime()) {
        return preset;
      }
    }
    return null;
  }, []);

  // Determine if current value matches a preset
  useEffect(() => {
    if (value) {
      const matchingPreset = findMatchingPreset(value);
      if (matchingPreset) {
        setSelectedPreset(matchingPreset);
        setMode("preset");
      } else {
        setSelectedPreset(null);
        setMode("custom");
      }
    } else {
      setSelectedPreset(null);
      setMode("preset");
    }
  }, [value, findMatchingPreset]);

  // Calculate due date based on preset selection
  // Handle preset selection
  const handlePresetChange = (presetValue: string) => {
    if (presetValue === "custom") {
      setMode("custom");
      setIsCalendarOpen(true);
    } else {
      setHasUserTyped(true);
      setMode("preset");
      setSelectedPreset(presetValue);
      const calculatedDate = calculateDueDate(presetValue);
      setPaymentDueDate(calculatedDate);
    }
  };

  // Handle custom date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setHasUserTyped(true);
      setPaymentDueDate(date);
      setIsCalendarOpen(false);
    }
  }; // Handle toggle between modes
  const handleToggleMode = () => {
    if (mode === "preset") {
      setMode("custom");
      setIsCalendarOpen(true);
      setPaymentDueDate(null);
    } else {
      setMode("preset");
      setPaymentDueDate(null);
    }
  };

  // Render preset selector
  if (mode === "preset") {
    return (
      <div className="w-full">
        {/* Header with label and toggle button */}
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-900">
            Payment Terms
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToggleMode}
            disabled={disabled}
            className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700 hover:bg-transparent transition-colors duration-200"
          >
            Enter custom due date
          </Button>
        </div>{" "}
        <Select
          value={selectedPreset || ""}
          onValueChange={handlePresetChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={`w-full h-11 border-2 transition-all duration-200 ${
              hasError
                ? "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100"
                : "border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            }`}
          >
            <SelectValue className="" placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-blue-200 shadow-xl rounded-lg">
            {DUE_DATE_PRESETS.map((preset) => (
              <SelectItem
                key={preset.value}
                value={preset.value}
                className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors duration-200"
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-900">
                    {preset.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {preset.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError && (
          <p className="text-red-500 text-sm mt-1">
            {validation.errors.paymentDueDate}
          </p>
        )}
      </div>
    );
  }
  // Render custom date picker
  return (
    <div className="w-full">
      {/* Header with label and toggle button */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-900">Due Date</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToggleMode}
          disabled={disabled}
          className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700 hover:bg-transparent transition-colors duration-200"
        >
          Set payment terms
        </Button>
      </div>
      {/* Custom date picker */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal h-11 border-2 transition-all duration-200",
              !value && "text-gray-500",
              hasError
                ? "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100"
                : "border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
            {value instanceof Date ? format(value, "PPP") : "Pick a date..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white border-2 border-blue-200 shadow-xl rounded-lg"
          align="start"
        >
          <Calendar
            mode="single"
            selected={value instanceof Date ? value : undefined}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date() || disabled}
            initialFocus
            className="rounded-md border-0"
          />
        </PopoverContent>
      </Popover>

      {hasError && (
        <p className="text-red-500 text-sm mt-1">
          {validation.errors.paymentDueDate}
        </p>
      )}

      {/* Custom date help text */}
      <div className="mt-2 text-xs text-gray-500">
        Select a custom due date or use the toggle above to set payment terms
      </div>
    </div>
  );
}

export default DueDateInput;
