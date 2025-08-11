import { InvoiceFormState } from "../types/invoiceForm";
import { InvoiceWithRelations } from "../types/invoiceTypes";

export function calculateSubTotal(
  items: {
    description?: string;
    quantity?: number;
    unitPrice?: number;
  }[]
): number {
  return items.reduce((total, item) => {
    // Skip items without quantity or unitPrice
    if (!item.quantity || !item.unitPrice) {
      return total;
    }
    return total + item.quantity * item.unitPrice;
  }, 0);
}

// Re-export validation utilities
export * from "./invoiceFormValidation";

// Re-export fingerprinting utilities
export * from "./invoiceFormUtils";

// Calculate total with tax and discount (both as absolute amounts)
export const calculateTotal = (
  subtotal: number,
  taxAmount: number = 0,
  discountAmount: number = 0
): number => {
  // Tax and discount are both subtracted from subtotal as absolute amounts
  const total = subtotal - taxAmount - discountAmount;
  return Math.max(0, Math.round(total * 100) / 100); // Ensure non-negative and round to 2 decimal places
};

/**
 * Formats invoice data from either InvoiceFormState or InvoiceWithRelations
 * @param {InvoiceFormState | InvoiceWithRelations} data - The invoice data
 * @returns {FormattedInvoiceData} Formatted invoice data object
 */
export function formatInvoiceData(
  data: InvoiceFormState | InvoiceWithRelations
): FormattedInvoiceData {
  // Type guards to determine which type we're working with
  const isInvoiceFormState = (
    item: InvoiceFormState | InvoiceWithRelations
  ): item is InvoiceFormState => {
    return "formMode" in item && "businessDetails" in item;
  };

  const isInvoiceWithRelations = (
    item: InvoiceFormState | InvoiceWithRelations
  ): item is InvoiceWithRelations => {
    return "client" in item && "business" in item && "id" in item;
  };

  // Helper function to safely get string values with fallback
  const safeString = (value: string | null | undefined): string => {
    return value || "";
  };

  // Helper function to safely get number values with fallback
  const safeNumber = (value: number | null | undefined): number => {
    return typeof value === "number" && !isNaN(value) ? value : 0;
  };

  // Format date to readable string
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "";
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format items array with calculations
  const formatItems = (
    items:
      | Array<{ description?: string; quantity?: number; unitPrice?: number }>
      | undefined
      | null
  ) => {
    if (!items || !Array.isArray(items)) return [];

    return items.map((item, index) => {
      const description = safeString(item?.description);
      const quantity = safeNumber(item?.quantity);
      const unitPrice = safeNumber(item?.unitPrice);
      const total = quantity * unitPrice;

      return {
        id: index + 1,
        description,
        quantity,
        unitPrice,
        total,
      };
    });
  };

  // Handle different data types
  let formattedData: FormattedInvoiceData;

  if (isInvoiceFormState(data)) {
    // Handle InvoiceFormState - simplified version
    formattedData = {
      // Invoice metadata
      invoiceId: safeString(data.invoiceId),
      invoiceNumber: safeString(data.invoiceNumber),
      invoiceDate: formatDate(data.invoiceDate),
      invoiceDueDate: formatDate(data.paymentDueDate),

      // Client information - using clientId since client object doesn't exist
      clientName: "",
      clientBusinessName: "",
      clientAddress: "",
      clientEmail: "",

      // Items and calculations
      items: formatItems(data.invoiceItems),

      // Financial data
      tax: safeNumber(data.tax),
      discount: safeNumber(data.discount),

      // Additional notes
      customNotes: safeString(data.customNote),
      lateFeeText: safeString(data.lateFeeTerms),

      // Business information
      businessDetails: data.businessDetails
        ? {
            businessName: safeString(
              data.businessDetails.business?.businessName
            ),
            email: safeString(data.businessDetails.business?.email),
            phone: safeString(data.businessDetails.business?.phone),
            address: [
              data.businessDetails.business?.addressLine1,
              data.businessDetails.business?.addressLine2,
              data.businessDetails.business?.city,
              data.businessDetails.business?.state,
              data.businessDetails.business?.zipCode,
            ]
              .filter(Boolean)
              .join(", "),
            logo: safeString(data.businessDetails.business?.logo),
            signature: safeString(data.businessDetails.signature),
          }
        : null,

      // Payment account information
      paymentAccount: data.paymentAccount
        ? {
            accountName: safeString(data.paymentAccount.accountName),
            gatewayType: safeString(data.paymentAccount.gatewayType),
            accountData: data.paymentAccount.accountData,
          }
        : null,

      // Calculated totals (will be updated below)
      calculations: {
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        finalTotal: 0,
      },
    };
  } else if (isInvoiceWithRelations(data)) {
    // Handle InvoiceWithRelations
    const buildClientAddress = (client: typeof data.client): string => {
      if (!client) return "";
      const addressParts = [client.address].filter(Boolean);
      return addressParts.join(", ");
    };

    formattedData = {
      // Invoice metadata
      invoiceId: safeString(data.id),
      invoiceNumber: safeString(data.invoiceNumber),
      invoiceDate: formatDate(data.invoiceDate),
      invoiceDueDate: formatDate(data.paymentDueDate),

      // Client information
      clientName: safeString(
        data.client?.contactPersonName || data.client?.BusinessName
      ),
      clientBusinessName: safeString(data.client?.BusinessName),
      clientAddress: buildClientAddress(data.client),
      clientEmail: safeString(data.client?.email),

      // Items and calculations
      items: formatItems(data.invoiceItems),

      // Financial data - using tax instead of taxes
      tax: safeNumber(data.tax),
      discount: safeNumber(data.discount),

      // Additional notes - InvoiceWithRelations doesn't have customNote/lateFeeText in the base model
      customNotes: "", // Default empty for InvoiceWithRelations
      lateFeeText: "", // Default empty for InvoiceWithRelations

      // Business information
      businessDetails: data.business
        ? {
            businessName: safeString(data.business.businessName),
            email: safeString(data.business.email),
            phone: safeString(data.business.phone),
            address: [
              data.business.addressLine1,
              data.business.addressLine2,
              data.business.city,
              data.business.state,
              data.business.zipCode,
            ]
              .filter(Boolean)
              .join(", "),
            logo: safeString(data.business.logo),
            signature: "", // InvoiceWithRelations doesn't have user signature directly
          }
        : null,

      // Payment account information (InvoiceWithRelations doesn't have payment account directly)
      paymentAccount: null,

      // Calculated totals (will be updated below)
      calculations: {
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        finalTotal: 0,
      },
    };
  } else {
    // Fallback for unknown type
    throw new Error("Invalid data type provided to formatInvoiceData");
  }

  // Calculate financial totals with absolute amounts
  const subtotal = formattedData.items.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const taxAmount = formattedData.tax;
  const discountAmount = formattedData.discount;
  const finalTotal = Math.max(0, subtotal - taxAmount - discountAmount);

  // Update calculations
  formattedData.calculations = {
    subtotal,
    taxAmount,
    discountAmount,
    finalTotal,
  };

  return formattedData;
}

// Type definition for the formatted invoice data
export interface FormattedInvoiceData {
  invoiceId: string;
  invoiceNumber: string;
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
    logo?: string;
    signature?: string;
  } | null;
  paymentAccount: {
    accountName: string;
    gatewayType: string;
    accountData: unknown; // JsonValue type from Prisma
  } | null;
  calculations: {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    finalTotal: number;
  };
}
