import { calculateSubTotal } from ".";
import {
  InvoiceFieldErrors,
  InvoiceFormState,
  invoiceItemErrors,
  InvoiceValidationResult,
} from "../types/invoiceForm";

export const getInvoiceItemErrors = (
  state: InvoiceFormState
): InvoiceValidationResult => {
  const errors: InvoiceFieldErrors = {};
  if (!state.client) {
    errors.client = "Please select a client";
  }

  if (!state.paymentDueDate) {
    errors.paymentDueDate = "Please set a payment due date";
  }

  if (
    state.invoiceDate &&
    state.paymentDueDate &&
    state.paymentDueDate < state.invoiceDate
  ) {
    errors.paymentDueDate = "Payment due date cannot be before invoice date";
  }

  // custom note length
  if (state.customNote && state.customNote.length > 240) {
    errors.customNote = "Custom note cannot exceed 240 characters";
  }

  // late fee text length
  if (state.lateFeeText && state.lateFeeText.length > 200) {
    errors.lateFeeText = "Late fee text cannot exceed 200 characters";
  }

  // Validate invoice items
  if (!state.invoiceItems || state.invoiceItems.length === 0) {
    errors.invoiceItems = "Please add at least one invoice item";
  } else {
    const itemErrors: invoiceItemErrors[] = [];
    state.invoiceItems.forEach((item, index) => {
      const itemError: invoiceItemErrors = {};
      if (!item.description?.trim()) {
        itemError.description = `Item ${index + 1}: Description is required`;
      }
      if (!item.quantity || item.quantity <= 0) {
        itemError.quantity = `Item ${
          index + 1
        }: Quantity must be greater than 0`;
      }
      if (item.unitPrice === undefined || item.unitPrice < 0) {
        itemError.unitPrice = `Item ${
          index + 1
        }: Unit price cannot be negative`;
      }
      if (Object.keys(itemError).length > 0) {
        itemErrors.push(itemError);
      }
    });
    // If there are item errors, add them to the main errors object
    if (itemErrors.length > 0) {
      errors.itemErrors = itemErrors;
    }
  }

  // get subtotal

  if (state.invoiceItems && state.invoiceItems.length > 0) {
    const subtotal = calculateSubTotal(state.invoiceItems);

    if (state.discount) {
      if (state.discount < 0) {
        errors.discount = "Discount cannot be negative";
      }
      if (state.discountType === "flat" && state.discount > subtotal) {
        errors.discount = "Discount cannot be greater than subtotal";
      }
      // If discount is percentage, it should be between 0 and 100
      if (
        state.discountType === "percentage" &&
        (state.discount < 0 || state.discount > 100)
      ) {
        errors.discount = "Discount must be between 0 and 100%";
      }
    }

    // calculate subtotal after discount
    const subtotalAfterDiscount = !state.discount
      ? subtotal
      : state.discountType === "flat" && state.discount
      ? subtotal - state.discount
      : state.discountType === "percentage" && state.discount
      ? subtotal - (subtotal * state.discount) / 100
      : subtotal;

    if (state.tax) {
      if (state.tax < 0) {
        errors.tax = "Tax cannot be negative";
      }
      if (state.taxStructure === "flat" && state.tax > subtotalAfterDiscount) {
        errors.tax = "Tax cannot be greater than subtotal after discount";
      }
      // If tax is percentage, it should be between 0 and 100
      if (
        state.taxStructure === "percentage" &&
        (state.tax < 0 || state.tax > 100)
      ) {
        errors.tax = "Tax must be between 0 and 100%";
      }
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
  };
};
