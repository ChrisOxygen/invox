import {
  PrismaClient,
  InvoiceStatus,
  TaxType,
  DiscountType,
} from "@prisma/client";
import { CalculationResult } from "@/utils/invoice-calculations";
import { ZCreateInvoiceInput } from "@/dataSchemas/invoice";

const prisma = new PrismaClient();

export interface CreateInvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  paymentDueDate: Date;
  subtotal: number;
  tax: number;
  taxType: TaxType;
  discount: number;
  discountType: DiscountType;
  total: number;
  invoiceItems: unknown;
  paymentAccountId?: string;
  status: InvoiceStatus;
  isFavorite: boolean;
  businessId: string;
  clientId: string;
  customNote?: string;
  lateFeeTerms?: string;
}

/**
 * Creates invoice record in database with transaction
 */
export async function createInvoiceRecord(
  data: CreateInvoiceData
): Promise<{ id: string }> {
  const invoice = await prisma.$transaction(async (tx) => {
    // Double-check invoice number uniqueness within transaction
    const existing = await tx.invoice.findFirst({
      where: {
        invoiceNumber: data.invoiceNumber,
        businessId: data.businessId,
      },
      select: { id: true },
    });

    if (existing) {
      throw new Error("Invoice number already exists");
    }

    // Create the invoice
    return await tx.invoice.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any, // Type assertion for JSON field compatibility
      select: {
        id: true,
      },
    });
  });

  return invoice;
}

/**
 * Builds invoice data object from calculation results and input
 */
export function buildInvoiceData(
  validatedData: ZCreateInvoiceInput,
  calculations: CalculationResult,
  invoiceNumber: string,
  businessId: string
): CreateInvoiceData {
  return {
    invoiceNumber,
    invoiceDate: validatedData.invoiceDate,
    paymentDueDate: validatedData.paymentDueDate,
    subtotal: calculations.subtotal,
    tax: calculations.taxAmount,
    taxType: validatedData.taxType || "PERCENTAGE",
    discount: calculations.discountAmount,
    discountType: validatedData.discountType || "PERCENTAGE",
    total: calculations.total,
    invoiceItems: calculations.sanitizedItems,
    paymentAccountId: validatedData.paymentAccountId,
    status: validatedData.status || InvoiceStatus.DRAFT,
    isFavorite: validatedData.isFavorite || false,
    businessId,
    clientId: validatedData.clientId,
    customNote: validatedData.customNote,
    lateFeeTerms: validatedData.lateFeeTerms,
  };
}
