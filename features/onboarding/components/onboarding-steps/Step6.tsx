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
import { useOnboarding } from "../../context/OnboardingProvider";

function Step6() {
  const { nextStep, state, previousStep, setPaymentRules } = useOnboarding();
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
    <div className="flex w-full max-w-[90vw] sm:max-w-[600px] flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
            <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" />
          </div>

          <h1 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight px-2">
            Set Your
            <br />
            Payment Rules
          </h1>

          <p className="font-inter text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto px-4 sm:px-2">
            Set up some smart defaults for your invoices. You can change these
            for any individual invoice.
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Form Fields */}
          <div className="space-y-4 sm:space-y-6 max-w-md mx-auto text-left px-2">
            {/* Payment Terms */}
            <div className="space-y-2">
              <label className="font-inter text-sm font-medium text-gray-700 block">
                Payment Terms
              </label>
              <Select
                onValueChange={handlePaymentTermsSelect}
                value={selectedPaymentTerms}
              >
                <SelectTrigger className="w-full h-12 sm:h-14 font-inter text-left text-sm sm:text-base">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map((option) => (
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

              {/* Custom payment days input */}
              {showCustomPaymentInput && (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter number of days"
                    value={customPaymentDays}
                    onChange={(e) => setCustomPaymentDays(e.target.value)}
                    className="h-12 sm:h-14 font-inter text-sm sm:text-base"
                    type="number"
                    min="1"
                  />
                </div>
              )}
            </div>

            {/* Late Fee Options */}
            <div className="space-y-2">
              <label className="font-inter text-sm font-medium text-gray-700 block">
                Late Fee Options
              </label>
              <Select
                onValueChange={handleLateFeeSelect}
                value={selectedLateFee}
              >
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
                    onChange={(e) => setCustomLateFee(e.target.value)}
                    className="h-12 sm:h-14 font-inter text-sm sm:text-base"
                  />
                </div>
              )}
            </div>

            {/* Default Invoice Notes */}
            <div className="space-y-2">
              <label className="font-inter text-sm font-medium text-gray-700 block">
                Default Invoice Notes
              </label>
              <Textarea
                placeholder="Thank you for your business! Payment is due within 30 days."
                value={invoiceNotes}
                onChange={(e) => setInvoiceNotes(e.target.value)}
                className="min-h-[100px] font-inter resize-none text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2 sm:pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCustomizeLater}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 font-inter font-medium border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer text-sm sm:text-base"
            >
              Customize Later
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-inter font-medium transition-all duration-200 group cursor-pointer text-sm sm:text-base"
            >
              Save Settings
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

export default Step6;
