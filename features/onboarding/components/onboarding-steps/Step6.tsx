import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Settings } from "lucide-react";
import { useOnboardingState } from "../../context/OnboardingStateContext";
import { useOnboardingActions as useOnboardingActionsContext } from "../../context/OnboardingActionsContext";

function Step6() {
  const state = useOnboardingState();
  const { nextStep, previousStep, setPaymentRules } =
    useOnboardingActionsContext();
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState<string>("");
  const [customPaymentDays, setCustomPaymentDays] = useState<string>("");
  const [showCustomPaymentInput, setShowCustomPaymentInput] =
    useState<boolean>(false);

  const [selectedLateFee, setSelectedLateFee] = useState<string>("");
  const [customLateFee, setCustomLateFee] = useState<string>("");
  const [showCustomLateFeeInput, setShowCustomLateFeeInput] =
    useState<boolean>(false);

  const [invoiceNotes, setInvoiceNotes] = useState<string>("");

  // Load saved payment rules from context on mount
  useEffect(() => {
    if (state.paymentRules) {
      const { paymentTerms, lateFee, invoiceNotes } = state.paymentRules;

      // Handle payment terms
      if (paymentTerms.startsWith("custom-")) {
        setSelectedPaymentTerms("custom");
        setCustomPaymentDays(paymentTerms.replace("custom-", ""));
        setShowCustomPaymentInput(true);
      } else {
        setSelectedPaymentTerms(paymentTerms);
      }

      // Handle late fees
      if (lateFee.startsWith("custom-")) {
        setSelectedLateFee("custom");
        setCustomLateFee(lateFee.replace("custom-", ""));
        setShowCustomLateFeeInput(true);
      } else {
        setSelectedLateFee(lateFee);
      }

      // Handle invoice notes
      setInvoiceNotes(invoiceNotes);
    }
  }, [state.paymentRules]);

  const paymentTermsOptions = [
    { value: "net-15", label: "Net 15 (Due in 15 days)" },
    { value: "net-30", label: "Net 30 (Due in 30 days) - Most popular" },
    { value: "net-60", label: "Net 60 (Due in 60 days)" },
    { value: "due-on-receipt", label: "Due on Receipt" },
    { value: "custom", label: "Custom days" },
  ];

  const lateFeeOptions = [
    { value: "no-fees", label: "No late fees" },
    { value: "1.5-percent", label: "1.5% per month" },
    { value: "2-percent", label: "2% per month" },
    { value: "25-flat", label: "$25 flat fee" },
    { value: "custom", label: "Custom amount" },
  ];

  const handlePaymentTermsSelect = (value: string) => {
    setSelectedPaymentTerms(value);
    if (value === "custom") {
      setShowCustomPaymentInput(true);
    } else {
      setShowCustomPaymentInput(false);
      setCustomPaymentDays("");
    }
  };

  const handleLateFeeSelect = (value: string) => {
    setSelectedLateFee(value);
    if (value === "custom") {
      setShowCustomLateFeeInput(true);
    } else {
      setShowCustomLateFeeInput(false);
      setCustomLateFee("");
    }
  };

  const handleContinue = () => {
    // Add payment rules to context
    const paymentRules = {
      paymentTerms:
        selectedPaymentTerms === "custom"
          ? `custom-${customPaymentDays}`
          : selectedPaymentTerms,
      lateFee:
        selectedLateFee === "custom"
          ? `custom-${customLateFee}`
          : selectedLateFee,
      invoiceNotes: invoiceNotes,
    };

    setPaymentRules(paymentRules);
    nextStep();
  };

  const handleCustomizeLater = () => {
    nextStep();
  };

  const canContinue =
    selectedPaymentTerms &&
    selectedLateFee &&
    (selectedPaymentTerms !== "custom" || customPaymentDays.trim()) &&
    (selectedLateFee !== "custom" || customLateFee.trim());

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="w-full text-center space-y-4 sm:space-y-5">
        {/* Header with enhanced icon */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-full mb-3 sm:mb-4 shadow-lg shadow-blue-100/50">
            <Settings className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600" />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Set Your Payment Rules
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Set up some smart defaults for your invoices. You can change these
              for any individual invoice.
            </p>
          </div>
        </div>

        {/* Main content with enhanced styling */}
        <div className="space-y-3 sm:space-y-4">
          {/* Form Fields */}
          <div className="space-y-3 sm:space-y-4 max-w-md mx-auto text-left">
            {/* Payment Terms */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 block">
                Payment Terms
              </label>
              <Select
                onValueChange={handlePaymentTermsSelect}
                value={selectedPaymentTerms}
              >
                <SelectTrigger className="w-full h-10 sm:h-11 text-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-xs sm:text-sm"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Custom payment days input */}
              {showCustomPaymentInput && (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter number of days"
                    value={customPaymentDays}
                    onChange={(e) => setCustomPaymentDays(e.target.value)}
                    className="h-10 sm:h-11 text-sm border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all duration-200"
                    type="number"
                    min="1"
                  />
                </div>
              )}
            </div>

            {/* Late Fee Options */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 block">
                Late Fee Options
              </label>
              <Select
                onValueChange={handleLateFeeSelect}
                value={selectedLateFee}
              >
                <SelectTrigger className="w-full h-10 sm:h-11 text-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200">
                  <SelectValue placeholder="Select late fee option" />
                </SelectTrigger>
                <SelectContent>
                  {lateFeeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-xs sm:text-sm"
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
                    onChange={(e) => setCustomLateFee(e.target.value)}
                    className="h-10 sm:h-11 text-sm border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all duration-200"
                  />
                </div>
              )}
            </div>

            {/* Default Invoice Notes */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 block">
                Default Invoice Notes
              </label>
              <Textarea
                placeholder="Thank you for your business! Payment is due within 30 days."
                value={invoiceNotes}
                onChange={(e) => setInvoiceNotes(e.target.value)}
                className="min-h-[80px] sm:min-h-[90px] text-sm border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all duration-200 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons with enhanced styling */}
        <div className="space-y-3 pt-2 sm:pt-3">
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Button
              onClick={handleCustomizeLater}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 font-medium border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 transition-all duration-300 text-sm sm:text-base rounded-xl"
            >
              Customize Later
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white font-semibold transition-all duration-300 group text-sm sm:text-base rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              Save Settings
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

export default Step6;
