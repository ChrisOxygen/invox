import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  User,
  Building2,
  CreditCard,
  Settings,
  MapPin,
  Loader2,
} from "lucide-react";
import { useOnboardingState } from "../../context/OnboardingStateContext";
import { useOnboardingActions as useOnboardingActionsContext } from "../../context/OnboardingActionsContext";
import { useOnboardingCompletion } from "../../hooks/useOnboardingCompletion";

function Step7() {
  const state = useOnboardingState();
  const { previousStep, goToStep } = useOnboardingActionsContext();
  const { completeOnboarding, isCompletingOnboarding } =
    useOnboardingCompletion({
      state,
      goToStep,
      clearStorage: () => {}, // Not needed in this context
      resetOnboarding: () => {}, // Not needed in this context
    });

  const handleUpdateProfile = () => {
    // TODO: Save to database and redirect to dashboard
    console.log("Saving onboarding data:", state);
    completeOnboarding();
    // Navigate to dashboard or complete onboarding
  };

  const getSummaryData = () => {
    const sections = [];

    // Business Type
    if (state.businessType) {
      sections.push({
        icon: <User className="w-5 h-5 text-gray-600" />,
        title: "Business Type",
        value: state.businessType,
      });
    }

    // Currency
    if (state.currency) {
      sections.push({
        icon: <MapPin className="w-5 h-5 text-gray-600" />,
        title: "Currency",
        value: state.currency.toUpperCase(),
      });
    }

    // Business Info
    if (state.businessInfo) {
      sections.push({
        icon: <Building2 className="w-5 h-5 text-gray-600" />,
        title: "Business Information",
        value: state.businessInfo.businessName,
        details: [
          state.businessInfo.email,
          state.businessInfo.phone,
          [
            state.businessInfo.addressLine1,
            state.businessInfo.city,
            state.businessInfo.state,
          ]
            .filter(Boolean)
            .join(", "),
        ].filter(Boolean),
      });
    }

    // Payment Methods
    if (state.paymentMethods && state.paymentMethods.length > 0) {
      const methodNames = state.paymentMethods.map((method) => {
        switch (method) {
          case "nigerian-bank":
            return "Nigerian Bank Transfer";
          case "paypal":
            return "PayPal";
          case "wise":
            return "Wise";
          case "bank-transfer":
            return "Bank Transfer (ACH)";
          default:
            return method;
        }
      });

      sections.push({
        icon: <CreditCard className="w-5 h-5 text-gray-600" />,
        title: "Payment Methods",
        value: `${methodNames.length} method${
          methodNames.length > 1 ? "s" : ""
        } configured`,
        details: methodNames,
      });
    }

    // Payment Rules
    if (state.paymentRules) {
      const { paymentTerms, lateFee, invoiceNotes } = state.paymentRules;
      const termDisplay = paymentTerms.startsWith("custom-")
        ? `Net ${paymentTerms.replace("custom-", "")} days`
        : paymentTerms
            .replace("-", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

      const feeDisplay = lateFee.startsWith("custom-")
        ? `Custom: ${lateFee.replace("custom-", "")}`
        : lateFee.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

      sections.push({
        icon: <Settings className="w-5 h-5 text-gray-600" />,
        title: "Payment Rules",
        value: termDisplay,
        details: [
          `Late Fee: ${feeDisplay}`,
          invoiceNotes &&
            `Notes: ${invoiceNotes.substring(0, 50)}${
              invoiceNotes.length > 50 ? "..." : ""
            }`,
        ].filter(Boolean),
      });
    }

    return sections;
  };

  const summaryData = getSummaryData();
  const completedSteps = summaryData.length;

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="w-full text-center space-y-4 sm:space-y-5">
        {/* Header with enhanced icon */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-full mb-3 sm:mb-4 shadow-lg shadow-blue-100/50">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600" />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent leading-tight">
              You&apos;re All Set!
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Here&apos;s a summary of your profile. You can always update these
              settings later.
            </p>
          </div>
        </div>

        {/* Summary Cards with enhanced styling */}
        <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
          {summaryData.map((section, index) => (
            <Card
              key={index}
              className="text-left bg-gradient-to-r from-blue-50/30 to-cyan-50/30 border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {React.cloneElement(section.icon, {
                      className: "w-4 h-4 sm:w-5 sm:h-5 text-blue-600",
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-700">
                        {section.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs font-medium border-blue-200"
                      >
                        ✓
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                      {section.value}
                    </p>
                    {section.details && section.details.length > 0 && (
                      <div className="space-y-0.5">
                        {section.details.map((detail, idx) => (
                          <p
                            key={idx}
                            className="text-xs text-gray-600 truncate"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Completion Status with enhanced styling */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 px-3 py-2 rounded-full shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-blue-700">
                {completedSteps} of 5 sections completed
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons with enhanced styling */}
        <div className="space-y-3 pt-3 sm:pt-4">
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Button
              onClick={previousStep}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 font-medium border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 group transition-all duration-300 text-sm sm:text-base rounded-xl"
            >
              <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Edit
            </Button>

            <Button
              onClick={handleUpdateProfile}
              disabled={isCompletingOnboarding}
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white font-semibold transition-all duration-300 group text-sm sm:text-base rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              {isCompletingOnboarding ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Completing Setup...
                </>
              ) : (
                <>
                  Complete Setup
                  <CheckCircle2 className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step7;
