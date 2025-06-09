import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, ArrowLeft, CreditCard } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingProvider";
import { PAYMENT_METHODS } from "@/constants";
import PayMethodCard from "../PayMethodCard";
import AppDialog from "@/components/AppDialog";
import NigerianBankForm, {
  type NigerianBankDetails,
} from "../payment-forms/NigerianBankForm";
import PayPalForm, { type PayPalDetails } from "../payment-forms/PayPalForm";
import WiseForm, { type WiseDetails } from "../payment-forms/WiseForm";
import ACHForm, { type ACHDetails } from "../payment-forms/ACHForm";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

// Type for payment method form data
type PaymentMethodFormData =
  | NigerianBankDetails
  | PayPalDetails
  | WiseDetails
  | ACHDetails;

function Step5() {
  const {
    nextStep,
    state,
    previousStep,
    setPaymentMethods,
    setPaymentMethodDetails,
  } = useOnboarding();

  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    string[]
  >([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<
    string | null
  >(null);

  // Load saved payment methods from context on mount and derive selection from saved details
  useEffect(() => {
    if (state.paymentMethodDetails) {
      const configuredMethods: string[] = [];

      // Check which payment methods have been configured
      if (state.paymentMethodDetails.nigerianBank) {
        configuredMethods.push("nigerian-bank");
      }
      if (state.paymentMethodDetails.paypal) {
        configuredMethods.push("paypal");
      }
      if (state.paymentMethodDetails.wise) {
        configuredMethods.push("wise");
      }
      if (state.paymentMethodDetails.bankTransfer) {
        configuredMethods.push("bank-transfer");
      }

      setSelectedPaymentMethods(configuredMethods);
    }
  }, [state.paymentMethodDetails]);

  // Determine payment method availability based on currency
  const paymentMethods: PaymentMethod[] = PAYMENT_METHODS.map((method) => {
    if (state.currency?.toUpperCase() === "NGN") {
      // If currency is NGN, only Nigerian bank transfer is available
      return {
        ...method,
        available: method.id === "nigerian-bank",
      };
    } else {
      // For all other currencies, all methods except Nigerian bank transfer are available
      return {
        ...method,
        available: method.id !== "nigerian-bank",
      };
    }
  });

  const handlePaymentMethodSelect = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    if (!method?.available) return;

    // Always open configuration dialog when clicked, regardless of current state
    handlePaymentMethodConfigure(methodId);
  };

  const handlePaymentMethodConfigure = (methodId: string) => {
    setCurrentPaymentMethod(methodId);
    setDialogOpen(true);
  };

  const handlePaymentMethodSave = (
    methodId: string,
    data: PaymentMethodFormData
  ) => {
    try {
      // Update payment method details in context
      const currentDetails = state.paymentMethodDetails || {};

      let updatedDetails: typeof currentDetails;
      switch (methodId) {
        case "nigerian-bank":
          updatedDetails = {
            ...currentDetails,
            nigerianBank: data as NigerianBankDetails,
          };
          break;
        case "paypal":
          updatedDetails = { ...currentDetails, paypal: data as PayPalDetails };
          break;
        case "wise":
          updatedDetails = { ...currentDetails, wise: data as WiseDetails };
          break;
        case "bank-transfer":
          updatedDetails = {
            ...currentDetails,
            bankTransfer: data as ACHDetails,
          };
          break;
        default:
          updatedDetails = currentDetails;
      }

      setPaymentMethodDetails(updatedDetails);

      // Add to selected methods only after successful configuration
      setSelectedPaymentMethods((prev) => {
        if (!prev.includes(methodId)) {
          return [...prev, methodId];
        }
        return prev;
      });

      setDialogOpen(false);
      setCurrentPaymentMethod(null);
    } catch (error) {
      console.error("Error saving payment method details:", error);
    }
  };

  const handlePaymentMethodRemove = (methodId: string) => {
    // Remove from selected methods and clear details
    setSelectedPaymentMethods((prev) => prev.filter((id) => id !== methodId));

    // Clear the payment method details
    const currentDetails = state.paymentMethodDetails || {};
    const updatedDetails = { ...currentDetails };

    switch (methodId) {
      case "nigerian-bank":
        updatedDetails.nigerianBank = undefined;
        break;
      case "paypal":
        updatedDetails.paypal = undefined;
        break;
      case "wise":
        updatedDetails.wise = undefined;
        break;
      case "bank-transfer":
        updatedDetails.bankTransfer = undefined;
        break;
      default:
        break;
    }

    setPaymentMethodDetails(updatedDetails);

    // Close dialog if it's open for this payment method
    if (currentPaymentMethod === methodId) {
      setDialogOpen(false);
      setCurrentPaymentMethod(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentPaymentMethod(null);
  };

  const handleContinue = () => {
    try {
      // Save payment methods to context
      setPaymentMethods(selectedPaymentMethods);
      nextStep();
    } catch (error) {
      console.error("Error continuing to next step:", error);
    }
  };

  const handleSetupLater = () => {
    try {
      // Save empty array if user skips
      setPaymentMethods([]);
      nextStep();
    } catch (error) {
      console.error("Error skipping payment setup:", error);
    }
  };

  // Guard clause to prevent rendering if required data is missing
  if (!state.currency) {
    return (
      <div className="flex w-full max-w-[90vw] sm:max-w-[600px] flex-col items-center justify-center px-4 py-6">
        <div className="text-center">
          <p className="font-inter text-lg text-gray-600">
            Please complete the previous steps first.
          </p>
          <Button
            onClick={previousStep}
            variant="outline"
            className="mt-4 cursor-pointer"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[90vw] sm:max-w-[600px] flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
            <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" />
          </div>

          <h1 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight px-2">
            How Do You Want
            <br />
            to Get Paid?
          </h1>

          <p className="font-inter text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto px-4 sm:px-2">
            The easier you make it for clients to pay, the faster you&apos;ll
            get paid.
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Payment Method Cards */}
          <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto px-2">
              {paymentMethods.map((method) => {
                const isSelected = selectedPaymentMethods.includes(method.id);
                const isDisabled = !method.available;

                const CardComponent = (
                  <PayMethodCard
                    key={method.id}
                    method={method}
                    isSelected={isSelected}
                    onSelect={handlePaymentMethodSelect}
                    onClick={
                      isSelected ? handlePaymentMethodConfigure : undefined
                    }
                  />
                );

                // Wrap disabled cards with tooltip
                if (isDisabled) {
                  return (
                    <Tooltip key={method.id}>
                      <TooltipTrigger asChild>{CardComponent}</TooltipTrigger>
                      <TooltipContent>
                        <p className="font-inter text-sm">
                          This payment method is not available for your selected
                          currency ({state.currency}).
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return CardComponent;
              })}
            </div>
          </TooltipProvider>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2 sm:pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSetupLater}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 font-inter font-medium border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer text-sm sm:text-base"
            >
              Set Up Later
            </Button>

            <Button
              onClick={handleContinue}
              disabled={selectedPaymentMethods.length === 0}
              size="lg"
              className="flex-1 min-h-[52px] h-auto py-4 px-6 sm:h-14 sm:py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-inter font-medium transition-all duration-200 group cursor-pointer text-sm sm:text-base"
            >
              {selectedPaymentMethods.length === 0
                ? "Select Payment Method"
                : "Save Payment Details"}
              {selectedPaymentMethods.length > 0 && (
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              )}
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

      {/* Payment Method Configuration Dialog */}
      <AppDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {currentPaymentMethod === "nigerian-bank" && (
          <NigerianBankForm
            onSubmit={(data) => handlePaymentMethodSave("nigerian-bank", data)}
            onCancel={handleDialogClose}
            onRemove={() => handlePaymentMethodRemove("nigerian-bank")}
            isLoading={false}
            defaultValues={state.paymentMethodDetails?.nigerianBank}
          />
        )}

        {currentPaymentMethod === "paypal" && (
          <PayPalForm
            onSubmit={(data) => handlePaymentMethodSave("paypal", data)}
            onCancel={handleDialogClose}
            onRemove={() => handlePaymentMethodRemove("paypal")}
            isLoading={false}
            defaultValues={state.paymentMethodDetails?.paypal}
          />
        )}

        {currentPaymentMethod === "wise" && (
          <WiseForm
            onSubmit={(data) => handlePaymentMethodSave("wise", data)}
            onCancel={handleDialogClose}
            onRemove={() => handlePaymentMethodRemove("wise")}
            isLoading={false}
            defaultValues={state.paymentMethodDetails?.wise}
          />
        )}

        {currentPaymentMethod === "bank-transfer" && (
          <ACHForm
            onSubmit={(data) => handlePaymentMethodSave("bank-transfer", data)}
            onCancel={handleDialogClose}
            onRemove={() => handlePaymentMethodRemove("bank-transfer")}
            isLoading={false}
            defaultValues={state.paymentMethodDetails?.bankTransfer}
          />
        )}
      </AppDialog>
    </div>
  );
}

export default Step5;
