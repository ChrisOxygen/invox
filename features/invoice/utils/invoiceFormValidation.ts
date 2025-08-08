import { calculateSubTotal } from ".";
import { DiscountType, TaxType, InvoiceStatus } from "@prisma/client";
import {
  InvoiceFieldErrors,
  InvoiceFormState,
  invoiceItemErrors,
  InvoiceValidationResult,
} from "../types/invoiceForm";

// Helper function to validate basic field constraints (always applied)
function validateBasicConstraints(
  state: InvoiceFormState,
  errors: InvoiceFieldErrors
) {
  // Custom note length
  if (state.customNote && state.customNote.length > 240) {
    errors.customNote = "Custom note cannot exceed 240 characters";
  }

  // Late fee terms length
  if (state.lateFeeTerms && state.lateFeeTerms.length > 200) {
    errors.lateFeeTerms = "Late fee terms cannot exceed 200 characters";
  }
}

// Helper function to validate required fields (only for SENT/PAID)
function validateRequiredFields(
  state: InvoiceFormState,
  errors: InvoiceFieldErrors
) {
  if (!state.clientId) {
    errors.clientId = "Please select a client";
  }

  if (!state.invoiceNumber) {
    errors.invoiceNumber = "Invoice number is required";
  }

  if (!state.invoiceDate) {
    errors.invoiceDate = "Invoice date is required";
  }

  if (!state.paymentDueDate) {
    errors.paymentDueDate = "Payment due date is required";
  }
}

// Helper function to validate date relationships
function validateDates(state: InvoiceFormState, errors: InvoiceFieldErrors) {
  if (
    state.invoiceDate &&
    state.paymentDueDate &&
    state.paymentDueDate < state.invoiceDate
  ) {
    errors.paymentDueDate = "Payment due date cannot be before invoice date";
  }
}

// Helper function to validate invoice items (lenient for DRAFT, strict for SENT/PAID)
function validateInvoiceItems(
  state: InvoiceFormState,
  errors: InvoiceFieldErrors,
  strict: boolean
) {
  if (strict) {
    // SENT/PAID: Must have items
    if (!state.invoiceItems || state.invoiceItems.length === 0) {
      errors.invoiceItems = "Please add at least one invoice item";
      return;
    }
  }

  // Validate existing items
  if (state.invoiceItems && state.invoiceItems.length > 0) {
    const itemErrors: invoiceItemErrors[] = [];
    state.invoiceItems.forEach((item, index) => {
      const itemError: invoiceItemErrors = {};

      // For strict mode or if description is provided, validate it
      if (strict || item.description) {
        if (!item.description?.trim()) {
          itemError.description = `Item ${index + 1}: Description is required`;
        }
      }

      // For strict mode or if quantity is provided, validate it
      if (strict || item.quantity !== undefined) {
        if (!item.quantity || item.quantity <= 0) {
          itemError.quantity = `Item ${
            index + 1
          }: Quantity must be greater than 0`;
        }
      }

      // For strict mode or if unitPrice is provided, validate it
      if (strict || item.unitPrice !== undefined) {
        if (item.unitPrice === undefined || item.unitPrice < 0) {
          itemError.unitPrice = `Item ${
            index + 1
          }: Unit price cannot be negative`;
        }
      }

      if (Object.keys(itemError).length > 0) {
        itemErrors.push(itemError);
      }
    });

    if (itemErrors.length > 0) {
      errors.itemErrors = itemErrors;
    }
  }
}

// Helper function to validate calculations (tax and discount)
function validateCalculations(
  state: InvoiceFormState,
  errors: InvoiceFieldErrors
) {
  if (state.invoiceItems && state.invoiceItems.length > 0) {
    const subtotal = calculateSubTotal(state.invoiceItems);

    // Validate discount
    if (state.discount) {
      if (state.discount < 0) {
        errors.discount = "Discount cannot be negative";
      }
      if (
        state.discountType === DiscountType.FIXED &&
        state.discount > subtotal
      ) {
        errors.discount = "Discount cannot be greater than subtotal";
      }
      // If discount is percentage, it should be between 0 and 100
      if (
        state.discountType === DiscountType.PERCENTAGE &&
        (state.discount < 0 || state.discount > 100)
      ) {
        errors.discount = "Discount must be between 0 and 100%";
      }
    }

    // Calculate subtotal after discount
    const subtotalAfterDiscount = !state.discount
      ? subtotal
      : state.discountType === DiscountType.FIXED && state.discount
      ? subtotal - state.discount
      : state.discountType === DiscountType.PERCENTAGE && state.discount
      ? subtotal - (subtotal * state.discount) / 100
      : subtotal;

    // Validate tax
    if (state.tax) {
      if (state.tax < 0) {
        errors.tax = "Tax cannot be negative";
      }
      if (
        state.taxType === TaxType.FIXED &&
        state.tax > subtotalAfterDiscount
      ) {
        errors.tax = "Tax cannot be greater than subtotal after discount";
      }
      // If tax is percentage, it should be between 0 and 100
      if (
        state.taxType === TaxType.PERCENTAGE &&
        (state.tax < 0 || state.tax > 100)
      ) {
        errors.tax = "Tax must be between 0 and 100%";
      }
    }
  }
}

export const getInvoiceItemErrors = (
  state: InvoiceFormState
): InvoiceValidationResult => {
  const errors: InvoiceFieldErrors = {};
  const status = state.invoiceStatus || InvoiceStatus.DRAFT;

  // Always validate basic constraints
  validateBasicConstraints(state, errors);

  if (status === InvoiceStatus.DRAFT) {
    // DRAFT: Very flexible validation - minimal requirements
    // Only validate items if they exist, and be lenient
    if (state.invoiceItems && state.invoiceItems.length > 0) {
      validateInvoiceItems(state, errors, false); // lenient = false (not strict)
      validateCalculations(state, errors);
    }

    // For drafts, only validate dates if both are provided
    if (state.invoiceDate && state.paymentDueDate) {
      validateDates(state, errors);
    }
  } else if (
    status === InvoiceStatus.SENT ||
    status === InvoiceStatus.PAID ||
    status === InvoiceStatus.OVERDUE
  ) {
    // SENT/PAID/OVERDUE: Strict validation - complete data required
    validateRequiredFields(state, errors);
    validateInvoiceItems(state, errors, true); // strict = true
    validateCalculations(state, errors);
    validateDates(state, errors);
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
  };
};
