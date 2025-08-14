import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPaymentAccounts } from "@/features/payments/hooks/useGetPaymentAccounts";
import { useInvoiceForm } from "../../index";
import { Button } from "@/components/ui/button";
import { InvoiceStatus } from "@prisma/client";
import { useState, useEffect } from "react";

function PaymentDetailsSelect() {
  const { state, setPaymentAccount } = useInvoiceForm();
  const { paymentAccount, validation, invoiceStatus } = state;
  const { paymentAccounts, isPending: gettingPaymentAccounts } =
    useGetPaymentAccounts();
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Reset interaction state when validation changes (new submit)
  useEffect(() => {
    setHasUserInteracted(false);
  }, [validation.isValid, validation.errors.paymentAccount]);

  // Determine if payment account is required based on invoice status
  const isRequired =
    invoiceStatus === InvoiceStatus.SENT ||
    invoiceStatus === InvoiceStatus.PAID ||
    invoiceStatus === InvoiceStatus.OVERDUE;

  const hasError = validation.errors.paymentAccount && !hasUserInteracted;

  return (
    <div className="w-full">
      {/* Dynamic Label */}
      <label className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
        Payment Details
        {isRequired && (
          <span className="text-red-500 text-sm sm:text-base">*</span>
        )}
      </label>

      {/* Loading State */}
      {gettingPaymentAccounts && (
        <div className="flex items-center justify-center h-9 sm:h-11 border-2 border-blue-200 rounded-md bg-gray-50">
          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-600"></div>
          <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">
            <span className="hidden sm:inline">Loading accounts...</span>
            <span className="sm:hidden">Loading...</span>
          </span>
        </div>
      )}

      {/* No Accounts Available */}
      {!gettingPaymentAccounts && paymentAccounts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-20 sm:h-24 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
            <span className="hidden sm:inline">
              No payment accounts available
            </span>
            <span className="sm:hidden">No accounts available</span>
          </p>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-7 sm:h-8"
            onClick={() => {}}
          >
            <span className="hidden sm:inline">Add Payment Account</span>
            <span className="sm:hidden">Add Account</span>
          </Button>
        </div>
      )}

      {/* Select Component */}
      {!gettingPaymentAccounts && paymentAccounts.length > 0 && (
        <Select
          disabled={gettingPaymentAccounts}
          value={paymentAccount?.id || ""}
          onValueChange={(value) => {
            setHasUserInteracted(true);
            const selectedAccount = paymentAccounts.find(
              (account) => account.id === value
            );
            if (selectedAccount) {
              setPaymentAccount(selectedAccount.id);
            }
          }}
        >
          <SelectTrigger
            className={`w-full h-9 sm:h-11 border-2 transition-all duration-200 text-xs sm:text-sm ${
              hasError
                ? "border-red-500 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100"
                : "border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            }`}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? "payment-account-error" : undefined}
          >
            <SelectValue placeholder="Select payment account" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-blue-200 shadow-xl rounded-lg">
            <SelectGroup>
              <SelectLabel className="text-gray-700 font-semibold text-xs sm:text-sm">
                Available Accounts
              </SelectLabel>
              {paymentAccounts.map((account) => (
                <SelectItem
                  key={account.id}
                  value={account.id}
                  className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors duration-200 text-xs sm:text-sm"
                >
                  {account.accountName}
                </SelectItem>
              ))}
            </SelectGroup>
            <div className="border-t border-blue-100 py-1 sm:py-2">
              <Button
                className="bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 text-xs sm:text-sm h-7 sm:h-8"
                onClick={() => {}}
              >
                <span className="hidden sm:inline">Add New Account</span>
                <span className="sm:hidden">Add Account</span>
              </Button>
            </div>
          </SelectContent>
        </Select>
      )}

      {/* Error Message */}
      {hasError && (
        <p
          id="payment-account-error"
          className="text-red-500 text-xs sm:text-sm mt-1"
          role="alert"
        >
          {validation.errors.paymentAccount}
        </p>
      )}
    </div>
  );
}

export default PaymentDetailsSelect;
