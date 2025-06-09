import React, { useEffect, useState } from "react";
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
import { useOnboarding } from "../../context/OnboardingProvider";
import { USER_BUSINESS_TYPES } from "@/constants";

function Step2() {
  const { nextStep, state, setBusinessType, previousStep } = useOnboarding();
  const [selectedBusiness, setSelectedBusiness] = useState<string>("");
  const [customBusiness, setCustomBusiness] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  // Add useEffect to load saved business type
  useEffect(() => {
    if (state.businessType) {
      if (
        USER_BUSINESS_TYPES.find((type) => type.value === state.businessType)
      ) {
        setSelectedBusiness(state.businessType);
      } else {
        setSelectedBusiness("other");
        setCustomBusiness(state.businessType);
        setShowCustomInput(true);
      }
    }
  }, [state.businessType]);

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
    <div className="flex w-full max-w-[90vw] sm:max-w-[600px] flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">💼</span>
          </div>

          <h1 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight px-2">
            Tell Us
            <br className="" />
            About Your Work
          </h1>

          {/* Simplified to one clear description */}
          <p className="font-inter text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto px-4 sm:px-2">
            What best describes what you do? This helps us recommend the right
            features and templates for you.
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Business Type Selection */}
          <div className="space-y-4 max-w-md mx-auto px-2">
            <Select
              onValueChange={handleBusinessSelect}
              value={selectedBusiness}
            >
              <SelectTrigger className="w-full h-12 sm:h-14 font-inter text-left text-sm sm:text-base">
                <SelectValue placeholder="Choose what describes you best" />
              </SelectTrigger>
              <SelectContent>
                {USER_BUSINESS_TYPES.map((option) => (
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

            {/* Custom business input */}
            {showCustomInput && (
              <div className="space-y-2">
                <Input
                  placeholder="Tell us about your business"
                  value={customBusiness}
                  onChange={(e) => setCustomBusiness(e.target.value)}
                  className="h-12 sm:h-14 font-inter text-sm sm:text-base"
                />
              </div>
            )}
          </div>

          {/* Optional: Keep this if you want to be reassuring */}
          <p className="font-inter text-xs sm:text-sm text-gray-500 max-w-lg mx-auto px-4 sm:px-2">
            You can always change this later as your business grows.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2 sm:pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSkip}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 font-inter font-medium border-gray-300 text-gray-600 hover:bg-gray-50 group cursor-pointer text-sm sm:text-base"
            >
              Skip for Now
              <SkipForward className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-inter font-medium transition-all duration-200 group cursor-pointer text-sm sm:text-base"
            >
              That&apos;s Me!
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          {/* Back button */}
          <Button
            onClick={previousStep}
            variant="ghost"
            size="sm"
            className="min-h-[44px] h-auto py-3 px-4 font-inter text-gray-500 hover:text-gray-700 cursor-pointer text-xs sm:text-sm"
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
