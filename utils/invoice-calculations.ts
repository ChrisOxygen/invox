import { TaxType, DiscountType } from "@prisma/client";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CalculationResult {
  sanitizedItems: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
}

export interface CalculationInput {
  items: Array<{
    description?: string;
    quantity: number;
    unitPrice: number;
  }>;
  tax: number;
  taxType?: TaxType;
  discount?: number;
  discountType?: DiscountType;
}

/**
 * Sanitizes and calculates totals for invoice items
 */
export function sanitizeInvoiceItems(
  items: CalculationInput["items"]
): InvoiceItem[] {
  return items.map((item, index) => {
    const sanitizedItem = {
      description: item.description?.trim() || `Item ${index + 1}`,
      quantity: Math.max(1, Math.round(item.quantity || 1)),
      unitPrice: Math.max(0.01, Number((item.unitPrice || 0).toFixed(2))),
    };

    const itemTotal = sanitizedItem.quantity * sanitizedItem.unitPrice;

    return {
      ...sanitizedItem,
      total: Number(itemTotal.toFixed(2)),
    };
  });
}

/**
 * Calculates tax amount based on type
 */
export function calculateTax(
  subtotal: number,
  tax: number,
  taxType: TaxType = "PERCENTAGE"
): number {
  if (tax <= 0) return 0;

  const taxAmount = taxType === "PERCENTAGE" ? (subtotal * tax) / 100 : tax;

  return Math.max(0, Number(taxAmount.toFixed(2)));
}

/**
 * Calculates discount amount based on type
 */
export function calculateDiscount(
  baseAmount: number,
  discount: number,
  discountType: DiscountType = "PERCENTAGE"
): number {
  if (discount <= 0) return 0;

  const discountAmount =
    discountType === "PERCENTAGE" ? (baseAmount * discount) / 100 : discount;

  // Ensure discount doesn't exceed base amount
  return Math.min(baseAmount, Math.max(0, Number(discountAmount.toFixed(2))));
}

/**
 * Performs complete invoice calculations
 */
export function calculateInvoiceTotals(
  input: CalculationInput
): CalculationResult {
  // Sanitize items and calculate subtotal
  const sanitizedItems = sanitizeInvoiceItems(input.items);
  const subtotal = sanitizedItems.reduce((sum, item) => sum + item.total, 0);

  if (subtotal <= 0) {
    throw new Error("Subtotal must be greater than zero");
  }

  // Calculate tax
  const taxAmount = calculateTax(subtotal, input.tax, input.taxType);

  // Calculate discount (applied after taxes)
  const baseForDiscount = subtotal + taxAmount;
  const discountAmount = input.discount
    ? calculateDiscount(baseForDiscount, input.discount, input.discountType)
    : 0;

  // Calculate final total
  const total = subtotal + taxAmount - discountAmount;

  if (total <= 0) {
    throw new Error("Final total must be greater than zero");
  }

  return {
    sanitizedItems,
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount,
    discountAmount,
    total: Number(total.toFixed(2)),
  };
}
