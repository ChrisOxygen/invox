"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, SkipForward, ArrowLeft } from "lucide-react";
import { useOnboardingState } from "../../context/OnboardingStateContext";
import { useOnboardingActions as useOnboardingActionsContext } from "../../context/OnboardingActionsContext";
import { USER_BUSINESS_TYPES } from "@/constants";

function Step2() {
  const state = useOnboardingState();
  const { nextStep, setBusinessType, previousStep } =
    useOnboardingActionsContext();
  const [selectedBusiness, setSelectedBusiness] = useState<string>("");
  const [customBusiness, setCustomBusiness] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const initializedRef = useRef(false);
  const initialBusinessTypeRef = useRef<string | undefined>(undefined);

  // Initialize from saved business type - only once on mount
  useEffect(() => {
    if (!initializedRef.current) {
      // Store the initial business type value
      initialBusinessTypeRef.current = state.businessType;

      if (initialBusinessTypeRef.current) {
        if (
          USER_BUSINESS_TYPES.find(
            (type) => type.value === initialBusinessTypeRef.current
          )
        ) {
          setSelectedBusiness(initialBusinessTypeRef.current);
        } else {
          setSelectedBusiness("other");
          setCustomBusiness(initialBusinessTypeRef.current);
          setShowCustomInput(true);
        }
      }
      initializedRef.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBusinessSelect = (value: string) => {
    setSelectedBusiness(value);
    if (value === "other") {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomBusiness("");
    }
  };

  const handleContinue = () => {
    const businessType =
      selectedBusiness === "other" ? customBusiness : selectedBusiness;
    setBusinessType(businessType);
    nextStep();
  };

  const handleSkip = () => {
    nextStep();
  };

  const canContinue =
    selectedBusiness && (selectedBusiness !== "other" || customBusiness.trim());

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="w-full text-center space-y-5 sm:space-y-6">
        {/* Header with enhanced icon */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-full mb-3 sm:mb-4 shadow-lg shadow-blue-100/50">
            <span className="text-xl sm:text-2xl md:text-3xl">💼</span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Tell Us About Your Work
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              What best describes what you do? This helps us recommend the right
              features and templates for you.
            </p>
          </div>
        </div>

        {/* Main content with enhanced styling */}
        <div className="space-y-4 sm:space-y-5">
          {/* Business Type Selection */}
          <div className="space-y-3 max-w-lg mx-auto">
            <Select
              onValueChange={handleBusinessSelect}
              value={selectedBusiness}
            >
              <SelectTrigger className="w-full h-12 sm:h-14 text-left text-sm sm:text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200">
                <SelectValue placeholder="Choose what describes you best" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                {USER_BUSINESS_TYPES.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm sm:text-base hover:bg-blue-50 focus:bg-blue-50 rounded-lg mx-1"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Custom business input */}
            {showCustomInput && (
              <div className="space-y-2">
                <Input
                  placeholder="Tell us about your business"
                  value={customBusiness}
                  onChange={(e) => setCustomBusiness(e.target.value)}
                  className="h-12 sm:h-14 text-sm sm:text-base border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>
            )}
          </div>

          {/* Reassuring message */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg p-3 sm:p-4 max-w-lg mx-auto">
            <p className="text-xs sm:text-sm text-gray-600">
              💡 You can always change this later as your business grows.
            </p>
          </div>
        </div>

        {/* Action Buttons with enhanced styling */}
        <div className="space-y-3 pt-2 sm:pt-3">
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Button
              onClick={handleSkip}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 font-medium border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 group transition-all duration-300 text-sm sm:text-base rounded-xl"
            >
              Skip for Now
              <SkipForward className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white font-semibold transition-all duration-300 group text-sm sm:text-base rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              That&apos;s Me!
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Back button */}
          <Button
            onClick={previousStep}
            variant="ghost"
            size="sm"
            className="min-h-[40px] h-auto py-2 px-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 text-xs sm:text-sm rounded-lg"
          >
            <ArrowLeft className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Step2;
