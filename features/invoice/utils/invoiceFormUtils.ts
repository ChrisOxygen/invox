import { InvoiceFormState } from "../types/invoiceForm";

/**
 * Creates a stable fingerprint (hash) of the relevant invoice form data
 * to track meaningful changes and prevent unnecessary auto-saves.
 *
 * The fingerprint only includes fields that would be sent to the server
 * when saving the invoice, excluding metadata like formMode or hasUnsavedChanges.
 *
 * @param state The current invoice form state
 * @returns A string representing the fingerprint of the form state
 */
export function createFingerprint(state: InvoiceFormState): string {
  // Extract only the fields that are relevant for detecting changes
  // that should trigger auto-save
  const relevantData = {
    // Client information
    clientId: state.clientId,

    // Invoice details
    invoiceNumber: state.invoiceNumber,
    invoiceDate: state.invoiceDate?.getTime(), // Use timestamp for stable comparison
    paymentDueDate: state.paymentDueDate?.getTime(), // Use timestamp for stable comparison

    // Invoice items - we need to normalize these to ensure consistent comparison
    items:
      state.invoiceItems?.map((item) => ({
        description: item.description || "",
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
      })) || [],

    // Financial details
    tax: state.tax,
    discount: state.discount,
    taxType: state.taxType,
    discountType: state.discountType,

    // Additional information
    customNote: state.customNote,
    lateFeeTerms: state.lateFeeTerms,
    isFavorite: state.isFavorite,
    invoiceStatus: state.invoiceStatus,

    // Payment details
    paymentAccountId: state.paymentAccount?.id,
  };

  // Convert to string for fingerprinting
  // Using JSON.stringify with stable key ordering to ensure consistent hashing
  const fingerprint = JSON.stringify(
    relevantData,
    Object.keys(relevantData).sort()
  );

  return fingerprint;
}
