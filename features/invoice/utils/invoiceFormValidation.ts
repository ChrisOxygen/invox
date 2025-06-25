import { InvoiceFormState } from "../types/invoiceForm";

export const getValidationErrors = (state: InvoiceFormState): string[] => {
  const errors: string[] = [];

  if (!state.client) {
    errors.push("Please select a client");
  }

  if (!state.paymentDueDate) {
    errors.push("Please set a payment due date");
  }

  // Validate invoice items
  if (!state.invoiceItems || state.invoiceItems.length === 0) {
    errors.push("Please add at least one invoice item");
  } else {
    state.invoiceItems.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors.push(`Item ${index + 1}: Description is required`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
      if (item.unitPrice === undefined || item.unitPrice < 0) {
        errors.push(`Item ${index + 1}: Unit price cannot be negative`);
      }
    });
  }

  // Validate dates
  if (
    state.invoiceDate &&
    state.paymentDueDate &&
    state.paymentDueDate < state.invoiceDate
  ) {
    errors.push("Payment due date cannot be before invoice date");
  }

  return errors;
};

export const validateForm = (state: InvoiceFormState): boolean => {
  return getValidationErrors(state).length === 0;
};
