import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, ArrowLeft, CreditCard } from "lucide-react";
import { useOnboardingState } from "../../context/OnboardingStateContext";
import { useOnboardingActions as useOnboardingActionsContext } from "../../context/OnboardingActionsContext";
import { PAYMENT_METHODS } from "@/constants";
import PayMethodCard from "../PayMethodCard";
import AppDialog from "@/components/AppDialog";
import NigerianBankForm from "../payment-forms/NigerianBankForm";
import PayPalForm from "../payment-forms/PayPalForm";
import WiseForm from "../payment-forms/WiseForm";
import ACHForm from "../payment-forms/ACHForm";
import {
  AchAccount,
  PaypalAccount,
  WiseAccount,
  NigerianBankAccount,
} from "@/types/schemas/payments";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

// Type for payment method form data - using the actual schema types
type PaymentMethodFormData =
  | NigerianBankAccount
  | PaypalAccount
  | WiseAccount
  | AchAccount;

function Step5() {
  const state = useOnboardingState();
  const { nextStep, previousStep, setPaymentMethods, setPaymentMethodDetails } =
    useOnboardingActionsContext();

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
            nigerianBank: data as NigerianBankAccount,
          };
          break;
        case "paypal":
          updatedDetails = { ...currentDetails, paypal: data as PaypalAccount };
          break;
        case "wise":
          updatedDetails = { ...currentDetails, wise: data as WiseAccount };
          break;
        case "bank-transfer":
          // Map AchAccount to PaymentMethodDetails.bankTransfer format
          const achData = data as AchAccount;
          updatedDetails = {
            ...currentDetails,
            bankTransfer: {
              accountNumber: achData.accountNumber,
              routingNumber: achData.routingNumber,
              bankName: achData.bankName,
              accountHolderName: "Account Holder", // Default value - should be collected from user in future
            },
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
      <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4 py-6">
        <div className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6 sm:p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-full mb-4 shadow-lg shadow-blue-100/50">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-lg font-medium text-gray-800 mb-2">
            Previous Steps Required
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Please complete the previous steps first to continue with payment
            setup.
          </p>
          <Button
            onClick={previousStep}
            variant="outline"
            className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="w-full text-center space-y-4 sm:space-y-5">
        {/* Header with enhanced icon */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-full mb-3 sm:mb-4 shadow-lg shadow-blue-100/50">
            <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600" />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent leading-tight">
              How Do You Want to Get Paid?
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              The easier you make it for clients to pay, the faster you&apos;ll
              get paid.
            </p>
          </div>
        </div>

        {/* Main content with enhanced styling */}
        <div className="space-y-4 sm:space-y-5">
          {/* Payment Method Cards */}
          <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
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
                      <TooltipContent className="bg-white border-2 border-blue-100 shadow-xl rounded-lg">
                        <p className="text-sm text-gray-600">
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

          {/* Info card */}
          {selectedPaymentMethods.length > 0 && (
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-lg p-3 sm:p-4 max-w-2xl mx-auto">
              <p className="text-xs sm:text-sm text-gray-600">
                💳 {selectedPaymentMethods.length} payment method
                {selectedPaymentMethods.length > 1 ? "s" : ""} configured. You
                can add more later in settings.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons with enhanced styling */}
        <div className="space-y-3 pt-2 sm:pt-3">
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Button
              onClick={handleSetupLater}
              variant="outline"
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 font-medium border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 group transition-all duration-300 text-sm sm:text-base rounded-xl"
            >
              Set Up Later
            </Button>

            <Button
              onClick={handleContinue}
              disabled={selectedPaymentMethods.length === 0}
              size="lg"
              className="flex-1 min-h-[48px] sm:min-h-[52px] h-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white font-semibold transition-all duration-300 group text-sm sm:text-base rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              {selectedPaymentMethods.length === 0
                ? "Select Payment Method"
                : "Save Payment Details"}
              {selectedPaymentMethods.length > 0 && (
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              )}
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
