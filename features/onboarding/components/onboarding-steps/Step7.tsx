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
import { useOnboarding } from "../../context/OnboardingProvider";

function Step7() {
  const { state, previousStep, completeOnboarding, isCompletingOnboarding } =
    useOnboarding();

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
    <div className="flex w-full max-w-[90vw] sm:max-w-[600px] flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 sm:mb-6">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>

          <h1 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight px-2">
            You&apos;re All Set!
          </h1>

          <p className="font-inter text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto px-4 sm:px-2">
            Here&apos;s a summary of your profile. You can always update these
            settings later.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="space-y-3 sm:space-y-4">
          {summaryData.map((section, index) => (
            <Card
              key={index}
              className="text-left bg-white border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{section.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-inter text-sm font-medium text-gray-700">
                        {section.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 text-xs font-medium"
                      >
                        ✓
                      </Badge>
                    </div>
                    <p className="font-space-grotesk text-base sm:text-lg font-semibold text-gray-900 mb-1">
                      {section.value}
                    </p>
                    {section.details && section.details.length > 0 && (
                      <div className="space-y-0.5">
                        {section.details.map((detail, idx) => (
                          <p
                            key={idx}
                            className="font-inter text-xs sm:text-sm text-gray-500 truncate"
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

          {/* Completion Status */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-2 sm:px-4 sm:py-2 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-inter text-sm font-medium text-green-700">
                {completedSteps} of 5 sections completed
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={previousStep}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 font-inter font-medium border-gray-300 text-gray-600 hover:bg-gray-50 group cursor-pointer text-sm sm:text-base"
            >
              <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Edit
            </Button>

            <Button
              onClick={handleUpdateProfile}
              disabled={isCompletingOnboarding}
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-inter font-medium transition-all duration-200 group cursor-pointer text-sm sm:text-base"
            >
              {isCompletingOnboarding ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Completing Setup...
                </>
              ) : (
                <>
                  Complete Setup
                  <CheckCircle2 className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
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
