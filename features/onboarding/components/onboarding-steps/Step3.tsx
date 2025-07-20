"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Zap } from "lucide-react";
import { useOnboardingState } from "../../context/OnboardingStateContext";

import { useOnboardingActions as useOnboardingActionsContext } from "../../context/OnboardingActionsContext";
import { CURRENCIES } from "@/constants";
import { CurrencyType } from "@/types/business/onboarding";

function Step3() {
  const state = useOnboardingState();
  const { nextStep, previousStep, setCurrency } = useOnboardingActionsContext();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const initializedRef = useRef(false);
  const initialCurrencyRef = useRef<string | undefined>(undefined);

  // Load saved currency from context - only once on mount
  useEffect(() => {
    if (!initializedRef.current) {
      // Store the initial currency value
      initialCurrencyRef.current = state.currency;

      if (initialCurrencyRef.current) {
        setSelectedCurrency(initialCurrencyRef.current.toLowerCase());
      }
      initializedRef.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleContinue = () => {
    if (selectedCurrency) {
      // Save currency to context first
      setCurrency(selectedCurrency.toUpperCase() as CurrencyType);
      nextStep();
    }
  };

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
  };

  const canContinue = selectedCurrency;

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="w-full text-center space-y-5 sm:space-y-6">
        {/* Header with enhanced icon */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-full mb-3 sm:mb-4 shadow-lg shadow-blue-100/50">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600" />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent leading-tight">
              What&apos;s Your Currency?
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Choose the currency you use most often for invoicing. This will be
              your default for all invoices.
            </p>
          </div>
        </div>

        {/* Main content with enhanced styling */}
        <div className="space-y-4 sm:space-y-5">
          {/* Currency Selection */}
          <div className="space-y-3 max-w-lg mx-auto">
            <Select
              onValueChange={handleCurrencyChange}
              value={selectedCurrency}
            >
              <SelectTrigger className="w-full h-12 sm:h-14 text-left text-sm sm:text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200">
                <SelectValue placeholder="Select your currency" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                {CURRENCIES.map((currency) => (
                  <SelectItem
                    key={currency.value}
                    value={currency.value}
                    className="text-sm sm:text-base hover:bg-blue-50 focus:bg-blue-50 rounded-lg mx-1"
                  >
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency info card */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-lg p-3 sm:p-4 max-w-lg mx-auto">
            <p className="text-xs sm:text-sm text-gray-600">
              ⚡ You can change this anytime in your settings later.
            </p>
          </div>
        </div>

        {/* Action Buttons with enhanced styling */}
        <div className="space-y-3 pt-2 sm:pt-3">
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Button
              onClick={previousStep}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 font-medium border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 group transition-all duration-300 text-sm sm:text-base rounded-xl"
            >
              <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white font-semibold transition-all duration-300 group text-sm sm:text-base rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              Save & Continue
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3;
