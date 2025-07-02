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
    clientId: state.client?.id,

    // Invoice details
    invoiceNumber: state.invoiceNumber,
    invoiceDate: state.invoiceDate?.getTime(), // Use timestamp for stable comparison
    paymentDueDate: state.paymentDueDate?.getTime(), // Use timestamp for stable comparison
    paymentTerms: state.paymentTerms,
    acceptedPaymentMethods: state.acceptedPaymentMethods,

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

    // Additional information
    customNote: state.customNote,
    lateFeeText: state.lateFeeText,
    isFavorite: state.isFavorite,

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

/**
 * Determines if the form state has changed significantly compared to the previous fingerprint
 *
 * @param currentState Current invoice form state
 * @param previousFingerprint Previous fingerprint to compare against
 * @returns true if the form has meaningful changes, false otherwise
 */
export function hasFormChanged(
  currentState: InvoiceFormState,
  previousFingerprint: string | null
): boolean {
  // If there's no previous fingerprint, consider it changed
  if (!previousFingerprint) {
    return true;
  }

  // Generate current fingerprint and compare
  const currentFingerprint = createFingerprint(currentState);
  return currentFingerprint !== previousFingerprint;
}
