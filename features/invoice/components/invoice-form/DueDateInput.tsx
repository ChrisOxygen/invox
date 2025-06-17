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

interface DueDateSelectorProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function DueDateInput({
  value,
  onChange,
  disabled = false,
  placeholder = "Select due date...",
}: DueDateSelectorProps) {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
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
      setMode("preset");
      setSelectedPreset(presetValue);
      const calculatedDate = calculateDueDate(presetValue);
      onChange(calculatedDate);
    }
  };

  // Handle custom date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setIsCalendarOpen(false);
    }
  }; // Handle toggle between modes
  const handleToggleMode = () => {
    if (mode === "preset") {
      setMode("custom");
      setIsCalendarOpen(true);
      onChange(null);
    } else {
      setMode("preset");
      onChange(null);
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
            className="h-auto p-0 text-xs text-gray-600 hover:text-black hover:bg-transparent"
          >
            Enter custom due date
          </Button>
        </div>{" "}
        <Select
          value={selectedPreset || ""}
          onValueChange={handlePresetChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full border-gray-300 focus:border-black  focus:ring-black">
            <SelectValue className="w-full py-3" placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {DUE_DATE_PRESETS.map((preset) => (
              <SelectItem
                key={preset.value}
                value={preset.value}
                className="hover:bg-gray-50 focus:bg-gray-50"
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
          className="h-auto p-0 text-xs text-gray-600 hover:text-black hover:bg-transparent"
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
              "w-full justify-start text-left font-normal border-gray-300 focus:border-black focus:ring-black",
              !value && "text-gray-500"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
            {value instanceof Date ? format(value, "PPP") : "Pick a date..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white border-gray-200"
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

      {/* Custom date help text */}
      <div className="mt-2 text-xs text-gray-600">
        Select a custom due date or use the toggle above to set payment terms
      </div>
    </div>
  );
}

export default DueDateInput;
