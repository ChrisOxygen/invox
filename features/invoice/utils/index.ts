import { InvoiceFormState } from "../types/invoiceForm";
import { ColorTheme, InvoiceWithRelations } from "../types/invoiceTypes";
import { PaymentGatewayType } from "@prisma/client";
import {
  nigerianBankAccountSchema,
  paypalAccountSchema,
  wiseAccountSchema,
  achAccountSchema,
} from "@/shared/validators/payment";
import { COLOR_THEMES } from "../constants";

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

// Type definition for invoice item
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Date formatting utility
export const formatDate = (date: Date): string =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Currency formatting utility
export const formatCurrency = (amount: number | null): string => {
  if (amount === null || amount === undefined) return "$0.00";
  return `$${Number(amount).toFixed(2)}`;
};

/**
 * Validates and converts invoice items from JSON/object format to typed array
 * @param {unknown} invoiceItems - The invoice items data (can be JSON, object, or array)
 * @returns {InvoiceItem[]} Array of validated invoice items
 */
export function validateAndConvertInvoiceItems(
  invoiceItems: unknown
): InvoiceItem[] {
  // Handle null, undefined, or empty values
  if (!invoiceItems) {
    return [];
  }

  // If it's a string, try to parse as JSON
  if (typeof invoiceItems === "string") {
    try {
      invoiceItems = JSON.parse(invoiceItems);
    } catch (error) {
      console.error("Failed to parse invoice items JSON:", error);
      return [];
    }
  }

  // Convert object with numeric keys to array
  if (
    typeof invoiceItems === "object" &&
    invoiceItems !== null &&
    !Array.isArray(invoiceItems)
  ) {
    // Check if it's an object with numeric keys (like {0: {...}, 1: {...}})
    const keys = Object.keys(invoiceItems);
    const isNumericKeys = keys.every((key) => !isNaN(Number(key)));

    if (isNumericKeys && keys.length > 0) {
      // Convert to array by sorting numeric keys
      const itemsObject = invoiceItems as Record<string, unknown>;
      invoiceItems = keys
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => itemsObject[key]);
    } else {
      // Single item object, wrap in array
      invoiceItems = [invoiceItems];
    }
  }

  // Ensure it's an array
  if (!Array.isArray(invoiceItems)) {
    console.error(
      "Invoice items is not an array after conversion:",
      invoiceItems
    );
    return [];
  }

  // Validate and convert each item
  return invoiceItems
    .map((item, index) => {
      // Validate item structure
      if (!item || typeof item !== "object") {
        console.warn(`Invalid invoice item at index ${index}:`, item);
        return null;
      }

      const { description, quantity, unitPrice, total } = item;

      // Validate required fields
      if (typeof description !== "string" || !description.trim()) {
        console.warn(`Invalid description at index ${index}:`, description);
        return null;
      }

      if (typeof quantity !== "number" || quantity <= 0) {
        console.warn(`Invalid quantity at index ${index}:`, quantity);
        return null;
      }

      if (typeof unitPrice !== "number" || unitPrice < 0) {
        console.warn(`Invalid unitPrice at index ${index}:`, unitPrice);
        return null;
      }

      // Calculate total if not provided or incorrect
      const calculatedTotal = quantity * unitPrice;
      const finalTotal = typeof total === "number" ? total : calculatedTotal;

      // Warn if provided total doesn't match calculated total
      if (
        typeof total === "number" &&
        Math.abs(total - calculatedTotal) > 0.01
      ) {
        console.warn(
          `Total mismatch at index ${index}: provided ${total}, calculated ${calculatedTotal}`
        );
      }

      return {
        description: description.trim(),
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        total: Number(finalTotal),
      };
    })
    .filter((item): item is InvoiceItem => item !== null); // Remove invalid items
}

// Type definitions for validated payment account data
export interface ValidatedPaymentAccountData {
  isValid: boolean;
  data: unknown;
  errors: string[];
  gatewayType: PaymentGatewayType;
}

/**
 * Validates payment account data based on the gateway type
 * @param {PaymentGatewayType} gatewayType - The payment gateway type
 * @param {unknown} accountData - The account data to validate
 * @returns {ValidatedPaymentAccountData} Validation result with errors and validated data
 */
export function validatePaymentAccountData(
  gatewayType: PaymentGatewayType,
  accountData: unknown
): ValidatedPaymentAccountData {
  const result: ValidatedPaymentAccountData = {
    isValid: false,
    data: null,
    errors: [],
    gatewayType,
  };

  // Handle null or undefined accountData
  if (!accountData) {
    result.errors.push("Account data is required");
    return result;
  }

  // Parse JSON string if needed
  let parsedData = accountData;
  if (typeof accountData === "string") {
    try {
      parsedData = JSON.parse(accountData);
    } catch (error) {
      result.errors.push("Invalid JSON format in account data");
      return result;
    }
  }

  // Validate based on gateway type
  try {
    switch (gatewayType) {
      case PaymentGatewayType.PAYPAL:
        const paypalResult = paypalAccountSchema.safeParse(parsedData);
        if (paypalResult.success) {
          result.isValid = true;
          result.data = paypalResult.data;
        } else {
          result.errors = paypalResult.error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          );
        }
        break;

      case PaymentGatewayType.WISE:
        const wiseResult = wiseAccountSchema.safeParse(parsedData);
        if (wiseResult.success) {
          result.isValid = true;
          result.data = wiseResult.data;
        } else {
          result.errors = wiseResult.error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          );
        }
        break;

      case PaymentGatewayType.NIGERIAN_BANK:
        const nigerianBankResult =
          nigerianBankAccountSchema.safeParse(parsedData);
        if (nigerianBankResult.success) {
          result.isValid = true;
          result.data = nigerianBankResult.data;
        } else {
          result.errors = nigerianBankResult.error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          );
        }
        break;

      case PaymentGatewayType.ACH:
        const achResult = achAccountSchema.safeParse(parsedData);
        if (achResult.success) {
          result.isValid = true;
          result.data = achResult.data;
        } else {
          result.errors = achResult.error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          );
        }
        break;

      default:
        result.errors.push(`Unsupported gateway type: ${gatewayType}`);
        break;
    }
  } catch (error) {
    result.errors.push(
      `Validation error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  return result;
}

/**
 * Helper function to safely extract payment account data with validation
 * @param {PaymentGatewayType} gatewayType - The payment gateway type
 * @param {unknown} accountData - The account data to extract from
 * @returns {Record<string, string>} Safe key-value pairs for display
 */
export function extractPaymentAccountDisplayData(
  gatewayType: PaymentGatewayType,
  accountData: unknown
): Record<string, string> {
  const validation = validatePaymentAccountData(gatewayType, accountData);

  if (!validation.isValid || !validation.data) {
    return {
      error: validation.errors.join(", ") || "Invalid account data",
    };
  }

  const data = validation.data as Record<string, unknown>;
  const displayData: Record<string, string> = {};

  switch (gatewayType) {
    case PaymentGatewayType.PAYPAL:
      displayData["PayPal Email"] = String(data.email || "");
      break;

    case PaymentGatewayType.WISE:
      displayData["Wise Email"] = String(data.email || "");
      break;

    case PaymentGatewayType.NIGERIAN_BANK:
      displayData["Bank Name"] = String(data.bankName || "");
      displayData["Account Number"] = String(data.accountNumber || "");
      displayData["Account Name"] = String(data.accountName || "");
      break;

    case PaymentGatewayType.ACH:
      displayData["Bank Name"] = String(data.bankName || "");
      displayData["Routing Number"] = String(data.routingNumber || "");
      displayData["Account Number"] = String(data.accountNumber || "");
      displayData["Account Type"] = String(data.accountType || "");
      break;

    default:
      displayData["Gateway"] = gatewayType;
      // Try to extract common fields
      if (data.email) displayData["Email"] = String(data.email);
      if (data.accountNumber)
        displayData["Account Number"] = String(data.accountNumber);
      if (data.bankName) displayData["Bank Name"] = String(data.bankName);
      break;
  }

  return displayData;
}

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

// Helper function to get theme colors
export const getThemeColors = (theme: ColorTheme = "classic") =>
  COLOR_THEMES[theme];

// Type definitions for render targets
export type RenderTarget = "pdf" | "web";

// Web styling interface
export interface WebStyles {
  page: string;
  header: string;
  headerTitle: string;
  logoView: string;
  logo: string;
  signatureView: string;
  signatureImageView: string;
  signature: string;
  bodyView: string;
  detailsSectionView: string;
  invoiceToView: string;
  invoiceDetailsView: string;
  invoiceDetailsRowView: string;
  itemsTableView: string;
  tableHeaderView: string;
  tableRowContainerView: string;
  tableRowView: string;
  termsAndTotalView: string;
  termsView: string;
  TermsRowView: string;
  paymentInfoRowView: string;
  totalView: string;
  totalRowView: string;
  footerView: string;
  sectionTitle: string;
  clientText: string;
  clientBusinessName: string;
  invoiceLabel: string;
  invoiceValue: string;
  tableHeader: string;
  itemDescription: string;
  itemPrice: string;
  itemQuantity: string;
  itemTotal: string;
  termsTitle: string;
  termsText: string;
  paymentInfoHeader: string;
  paymentInfoTitle: string;
  paymentInfoText: string;
  totalLabel: string;
  totalValue: string;
  grandTotalLabel: string;
  grandTotalValue: string;
  divider: string;
  itemBorder: string;
  footerText: string;
  footerEmail: string;
  footerPageNumber: string;
}

// Helper function to create web styles with theme support
// Note: Theme colors are applied via inline styles in components for dynamic theming
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createWebStyles = (theme: ColorTheme = "classic"): WebStyles => {
  // Future enhancement: Could use theme to modify layout classes if needed
  return {
    page: `flex flex-col w-[794px] mx-auto bg-white shadow-lg`,
    header: "flex flex-row items-center",
    headerTitle: `flex flex-col basis-[70%] px-5 py-2.5 text-[30px] text-center font-semibold tracking-[10px]`,
    logoView: "flex flex-col basis-[30%] items-center justify-center px-2.5",
    logo: "w-[100px] h-[80px] object-contain",
    signatureView: "flex flex-col items-center justify-center mt-10",
    signatureImageView: "flex flex-row items-center justify-between mt-5",
    signature: "flex flex-col items-center object-contain -mb-1.5",
    bodyView: "flex flex-col p-[30px] gap-[30px]",
    detailsSectionView:
      "mt-[30px] flex flex-row items-end justify-between gap-10",
    invoiceToView: "flex flex-col basis-[40%] gap-1",
    invoiceDetailsView: "flex basis-[40%] flex-col gap-1",
    invoiceDetailsRowView: "flex flex-row items-center justify-between gap-2.5",
    itemsTableView: "flex flex-col mt-5",
    tableHeaderView: `flex flex-row items-center justify-between py-2 px-1.5`,
    tableRowContainerView: "flex flex-col",
    tableRowView: "flex flex-row items-center justify-between py-[15px]",
    termsAndTotalView: "flex flex-row items-start justify-between gap-10",
    termsView: "flex flex-col basis-[40%] gap-5",
    TermsRowView: "flex flex-col gap-1",
    paymentInfoRowView: "flex-row items-start justify-between gap-2.5",
    totalView: "flex flex-col basis-[40%] gap-2.5",
    totalRowView: "flex flex-row items-center justify-between gap-2.5",
    footerView: `flex flex-row items-center p-[30px] text-xs gap-2.5`,
    sectionTitle: `text-[13px] font-bold uppercase mb-1.5`,
    clientText: "text-[13px]",
    clientBusinessName: "text-[13px] font-bold uppercase",
    invoiceLabel: "text-[13px] font-bold uppercase",
    invoiceValue: "text-[13px]",
    tableHeader: `text-base font-bold uppercase`,
    itemDescription: "text-[13px] basis-[50%] pl-1.5",
    itemPrice: "text-[13px] text-center basis-[20%]",
    itemQuantity: "text-[13px] text-center basis-[10%]",
    itemTotal: "text-[13px] text-right pr-1.5 basis-[20%]",
    termsTitle: `text-[13px] font-semibold capitalize`,
    termsText: "text-xs",
    paymentInfoHeader: `relative py-1.5`,
    paymentInfoTitle: `text-xs font-semibold capitalize`,
    paymentInfoText: "text-[13px]",
    totalLabel: `text-[13px] font-bold uppercase text-right basis-[60%]`,
    totalValue: "text-[13px] text-right font-semibold basis-[40%]",
    grandTotalLabel: `text-[15px] font-bold uppercase text-right basis-[60%]`,
    grandTotalValue: `text-[15px] text-right font-semibold basis-[40%]`,
    divider: `w-full h-px`,
    itemBorder: `border-b`,
    footerText: `text-[13px] font-bold`,
    footerEmail: `text-[13px] pl-2.5 border-l`,
    footerPageNumber: "text-[13px] ml-auto",
  };
};
