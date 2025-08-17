"use client";

import { useGetInvoiceById } from "./useGetInvoiceById";
import { useUserAndBusiness } from "./useUserAndBusiness";
import { useGetClientById } from "../../clients/hooks/useGetClientById";
import { useGetPaymentAccount } from "../../payments/hooks/useGetPaymentAccount";

export function useInvoiceWithRelations(invoiceId: string) {
  // Step 1: Get invoice
  const {
    invoice,
    isPending: invoicePending,
    isError: invoiceError,
    error: invoiceErrorMessage,
  } = useGetInvoiceById(invoiceId);

  // Step 2: Get user and business (can run in parallel with invoice)
  const {
    data: userBusiness,
    isPending: userBusinessPending,
    isError: userBusinessError,
    error: userBusinessErrorMessage,
  } = useUserAndBusiness();

  // Step 3: Get client (only after invoice is loaded)
  const {
    client,
    isPending: clientPending,
    isError: clientError,
    error: clientErrorMessage,
  } = useGetClientById(invoice?.clientId || "", !!invoice?.clientId);

  // Step 4: Get payment account (only after invoice is loaded and if paymentAccountId exists)
  const {
    paymentAccount,
    isPending: paymentAccountPending,
    isError: paymentAccountError,
    error: paymentAccountErrorMessage,
  } = useGetPaymentAccount(invoice?.paymentAccountId || "");

  // Calculate loading states
  const isLoading = invoicePending || userBusinessPending;
  const isPending =
    isLoading ||
    (!!invoice &&
      (clientPending || (!!invoice.paymentAccountId && paymentAccountPending)));

  // Calculate error states
  const hasError =
    invoiceError || userBusinessError || clientError || paymentAccountError;
  const errorMessage =
    invoiceErrorMessage ||
    userBusinessErrorMessage ||
    clientErrorMessage ||
    paymentAccountErrorMessage;

  // Check if all required data is loaded
  const isComplete = !!(
    (
      invoice &&
      userBusiness &&
      client &&
      (!invoice.paymentAccountId || paymentAccount)
    ) // Payment account is optional
  );

  return {
    // Data
    invoice,
    user: userBusiness || null,
    business: userBusiness?.business || null,
    client,
    paymentAccount,

    // States
    isLoading,
    isPending,
    isComplete,
    hasError,
    errorMessage,

    // Individual loading states (for granular control if needed)
    invoicePending,
    userBusinessPending,
    clientPending,
    paymentAccountPending,

    // Individual error states
    invoiceError,
    userBusinessError,
    clientError,
    paymentAccountError,
  };
}
