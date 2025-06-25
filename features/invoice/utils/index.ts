import { InvoiceFormState } from "../context/InvoiceFormProvider";
import { InvoiceItem } from "@/types/invoice";

// Calculate item total
export const calculateItemTotal = (
  quantity: number,
  unitPrice: number
): number => {
  return Math.round(quantity * unitPrice * 100) / 100; // Round to 2 decimal places
};

// Calculate subtotal from items
export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

// Calculate total with tax and discount
export const calculateTotal = (
  subtotal: number,
  taxRate: number = 0,
  discount: number = 0
): number => {
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discount;
  return Math.max(0, Math.round(total * 100) / 100); // Ensure non-negative and round to 2 decimal places
};

// Validate invoice items
export const validateInvoiceItems = (items: InvoiceItem[]): boolean => {
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }

  return items.every(
    (item) =>
      item.description?.trim() &&
      item.quantity > 0 &&
      item.unitPrice >= 0 &&
      item.total >= 0
  );
};

// Check if invoice is editable based on status
export const isInvoiceEditable = (status: string): boolean => {
  return status === "DRAFT" || status === "SENT";
};

// Check if invoice can be deleted
export const isInvoiceDeletable = (status: string): boolean => {
  return status !== "PAID";
};

// Format invoice status for display
export const formatInvoiceStatus = (status: string): string => {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "SENT":
      return "Sent";
    case "PAID":
      return "Paid";
    case "OVERDUE":
      return "Overdue";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

// Get status color for UI
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "DRAFT":
      return "gray";
    case "SENT":
      return "blue";
    case "PAID":
      return "green";
    case "OVERDUE":
      return "red";
    case "CANCELLED":
      return "yellow";
    default:
      return "gray";
  }
};

// Check if invoice is overdue
export const isInvoiceOverdue = (
  paymentDueDate: Date,
  status: string
): boolean => {
  if (status === "PAID" || status === "CANCELLED") {
    return false;
  }
  return new Date() > new Date(paymentDueDate);
};

// Format currency
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Generates a unique invoice number with format INV-XXXXXX
 * Uses current timestamp to ensure uniqueness
 * @returns {string} Invoice number in format INV-XXXXXX (6 digits)
 */
export function generateInvoiceNumber(): string {
  const now = new Date();

  // Get milliseconds since epoch and take modulo to get 6 digits
  const timestamp = now.getTime();

  // Take last 6 digits and ensure it's always 6 digits
  const uniqueNumber = (timestamp % 1000000).toString().padStart(6, "0");

  return `INV-${uniqueNumber}`;
}

/**
 * Formats invoice provider state into a structured object for invoice templates
 * @param {InvoiceFormState} state - The invoice form state
 * @returns {FormattedInvoiceData} Formatted invoice data object
 */
export function formatInvoiceData(state: InvoiceFormState) {
  // Helper function to safely get string values with fallback
  const safeString = (value: string | null | undefined): string => {
    return value || "";
  };

  // Helper function to safely get number values with fallback
  const safeNumber = (value: number | null | undefined): number => {
    return typeof value === "number" && !isNaN(value) ? value : 0;
  };

  // Format date to readable string
  const formatDate = (date: Date | null | undefined): string => {
    if (!date || !(date instanceof Date)) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format items array with calculations
  const formatItems = (items: typeof state.invoiceItems) => {
    if (!items || !Array.isArray(items)) return [];

    return items.map((item, index) => {
      const description = safeString(item?.description);
      const quantity = safeNumber(item?.quantity);
      const unitPrice = safeNumber(item?.unitPrice);
      const total = quantity * unitPrice;

      return {
        id: index + 1, // Add ID for template use
        description,
        quantity,
        unitPrice,
        total,
      };
    });
  };

  // Build client address from available fields
  const buildClientAddress = (client: typeof state.client): string => {
    if (!client) return "";

    const addressParts = [client.address].filter(Boolean); // Remove empty/null values

    return addressParts.join(", ");
  };

  // Format the complete invoice data
  const formattedData = {
    // Invoice metadata
    invoiceId: safeString(state.invoiceId),
    invoiceNumber: safeString(state.invoiceNumber),
    invoiceDate: formatDate(state.invoiceDate),
    invoiceDueDate: formatDate(state.paymentDueDate),

    // Client information
    clientName: safeString(
      state.client?.contactPersonName || state.client?.BusinessName
    ),
    clientBusinessName: safeString(state.client?.BusinessName),
    clientAddress: buildClientAddress(state.client),
    clientEmail: safeString(state.client?.email),

    // Items and calculations
    items: formatItems(state.invoiceItems),

    // Financial data
    tax: safeNumber(state.tax),
    discount: safeNumber(state.discount),

    // Additional notes
    customNotes: safeString(state.customNote),
    lateFeeText: safeString(state.lateFeeText),

    // Business information (if needed for templates)
    businessDetails: state.businessDetails
      ? {
          businessName: safeString(
            state.businessDetails.business?.businessName
          ),
          email: safeString(state.businessDetails.business?.email),
          phone: safeString(state.businessDetails.business?.phone),
          address: [
            state.businessDetails.business?.addressLine1,
            state.businessDetails.business?.addressLine2,
            state.businessDetails.business?.city,
            state.businessDetails.business?.state,
            state.businessDetails.business?.zipCode,
          ]
            .filter(Boolean)
            .join(", "),
        }
      : null,

    // Payment account information
    paymentAccount: state.paymentAccount
      ? {
          accountName: safeString(state.paymentAccount.accountName),
          gatewayType: safeString(state.paymentAccount.gatewayType),
          accountData: state.paymentAccount.accountData, // Keep as is for template use
          // Note: accountData is Json type, handle carefully in templates
        }
      : null,

    // Calculated totals
    calculations: {
      subtotal: formatItems(state.invoiceItems).reduce(
        (sum, item) => sum + item.total,
        0
      ),
      taxAmount: 0, // Will be calculated based on subtotal and tax percentage
      discountAmount: 0, // Will be calculated based on subtotal and discount
      finalTotal: 0, // Will be calculated after tax and discount
    },
  };

  // Calculate financial totals
  const subtotal = formattedData.calculations.subtotal;
  const discountAmount = (subtotal * formattedData.discount) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * formattedData.tax) / 100;
  const finalTotal = subtotalAfterDiscount + taxAmount;

  // Update calculations
  formattedData.calculations.taxAmount = taxAmount;
  formattedData.calculations.discountAmount = discountAmount;
  formattedData.calculations.finalTotal = finalTotal;

  return formattedData;
}

// Type definition for the formatted invoice data
export interface FormattedInvoiceData {
  invoiceId: string;
  invoiceDate: string;
  invoiceDueDate: string;
  clientName: string;
  clientBusinessName: string;
  clientAddress: string;
  clientEmail: string;
  items: Array<{
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  tax: number;
  discount: number;
  customNotes: string;
  lateFeeText: string;
  businessDetails: {
    businessName: string;
    email: string;
    phone: string;
    address: string;
  } | null;
  paymentAccount: {
    accountName: string;
    gatewayType: string;
    accountData: JSON; // Keep as is for template use
  } | null;
  calculations: {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    finalTotal: number;
  };
}
