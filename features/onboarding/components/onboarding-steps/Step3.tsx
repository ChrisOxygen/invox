import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Zap } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingProvider";
import { CURRENCIES } from "@/constants";
import { CurrencyType } from "@/types/business/onboarding";

function Step3() {
  const { nextStep, state, previousStep, setCurrency } = useOnboarding();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");

  // Load saved currency from context on mount
  useEffect(() => {
    if (state.currency) {
      setSelectedCurrency(state.currency.toLowerCase());
    }
  }, [state.currency]);

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
    <div className="flex w-full max-w-[90vw] sm:max-w-[600px] flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" />
          </div>

          <h1 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight px-2">
            What&apos;s Your Currency?
          </h1>

          <p className="font-inter text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto px-4 sm:px-2">
            Choose the currency you use most often for invoicing.
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Currency Selection */}
          <div className="space-y-4 max-w-md mx-auto px-2">
            <Select
              onValueChange={handleCurrencyChange}
              value={selectedCurrency}
            >
              <SelectTrigger className="w-full h-12 sm:h-14 font-inter text-left text-sm sm:text-base">
                <SelectValue placeholder="Select your currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem
                    key={currency.value}
                    value={currency.value}
                    className="font-inter text-sm sm:text-base"
                  >
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2 sm:pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={previousStep}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 font-inter font-medium border-gray-300 text-gray-600 hover:bg-gray-50 group cursor-pointer text-sm sm:text-base"
            >
              <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-inter font-medium transition-all duration-200 group cursor-pointer text-sm sm:text-base"
            >
              Save & Continue
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3;
