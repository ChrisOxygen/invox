"use server";

import {
  PrismaClient,
  Prisma,
  InvoiceStatus,
  Client,
  Business,
  TaxType,
  DiscountType,
} from "@prisma/client";
import { ApiResponse } from "@/types/api";
import { UserWithBusiness } from "@/types/database";
import {
  InvoiceWithRelations,
  InvoiceResponse,
  InvoiceListApiResponse,
  InvoiceStatsResponse,
  InvoiceDeleteResponse,
} from "../types/invoiceTypes";
import { _requireAuthentication } from "@/features/auth/actions";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  invoiceFiltersSchema,
  paginationSchema,
  deleteInvoiceSchema,
  ZInvoiceFiltersInput,
  ZPaginationInput,
  ZDeleteInvoiceInput,
  ZCreateInvoiceInput,
  ZUpdateInvoiceInput,
} from "@/features/invoice/validation/invoiceSchemas";
import { calculateInvoiceTotals } from "@/utils/invoice-calculations";
import {
  validateUserBusinessAndClient,
  generateUniqueInvoiceNumber,
} from "@/utils/invoice-validation";
import { createInvoiceRecord } from "@/utils/invoice-persistence";
import {
  handleInvoiceError,
  createSuccessResponse,
  ValidationError,
} from "@/utils/invoice-errors";

const prisma = new PrismaClient();

// Centralized timestamp logic
function calculateStatusTimestamps(
  newStatus: InvoiceStatus,
  existingInvoice?: {
    status: InvoiceStatus;
    sentAt?: Date | null;
    paidAt?: Date | null;
  }
): Partial<{ sentAt: Date; paidAt: Date }> {
  const timestamps: Partial<{ sentAt: Date; paidAt: Date }> = {};

  if (newStatus === InvoiceStatus.SENT || newStatus === InvoiceStatus.PAID) {
    const now = new Date();

    // Handle status changes for existing invoices
    if (existingInvoice) {
      if (newStatus !== existingInvoice.status) {
        if (newStatus === InvoiceStatus.SENT && !existingInvoice.sentAt) {
          timestamps.sentAt = now;
        }
        if (newStatus === InvoiceStatus.PAID) {
          if (!existingInvoice.sentAt) {
            timestamps.sentAt = now;
          }
          timestamps.paidAt = now;
        }
      }
    }
    // Handle initial timestamps for new invoices
    else {
      if (newStatus === InvoiceStatus.SENT) {
        timestamps.sentAt = now;
      }
      if (newStatus === InvoiceStatus.PAID) {
        timestamps.sentAt = now;
        timestamps.paidAt = now;
      }
    }
  }

  return timestamps;
}

// Extract common calculation setup
function prepareCalculationInput(
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total?: number;
  }>,
  tax = 0,
  taxType: TaxType = TaxType.PERCENTAGE,
  discount = 0,
  discountType: DiscountType = DiscountType.PERCENTAGE
) {
  return {
    items,
    tax,
    taxType,
    discount,
    discountType,
  };
}

// Status handler for invoice creation and updates
async function handleInvoiceStatusLogic(
  status: InvoiceStatus,
  validatedData: {
    invoiceNumber?: string | null;
    invoiceDate?: Date | null;
    paymentDueDate?: Date | null;
    items?: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total?: number;
    }>;
    tax?: number;
    taxType?: TaxType;
    discount?: number;
    discountType?: DiscountType;
  },
  businessId: string,
  existingInvoice?: {
    status: InvoiceStatus;
    sentAt?: Date | null;
    paidAt?: Date | null;
  }
) {
  let invoiceNumber = validatedData.invoiceNumber;
  let invoiceDate = validatedData.invoiceDate;
  let paymentDueDate = validatedData.paymentDueDate;
  let calculations = null;

  if (status === InvoiceStatus.DRAFT) {
    // DRAFT: Very flexible, allow minimal data
    if (validatedData.items && validatedData.items.length > 0) {
      calculations = calculateInvoiceTotals(
        prepareCalculationInput(
          validatedData.items,
          validatedData.tax,
          validatedData.taxType,
          validatedData.discount,
          validatedData.discountType
        )
      );
    } else {
      // For DRAFT with no items, set minimal calculations
      calculations = {
        sanitizedItems: [],
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 0,
      };
    }
  } else if (status === InvoiceStatus.SENT || status === InvoiceStatus.PAID) {
    // SENT/PAID: Require complete data
    if (!invoiceNumber) {
      invoiceNumber = await generateUniqueInvoiceNumber(businessId);
    }

    if (!invoiceDate) {
      invoiceDate = new Date();
    }

    if (!paymentDueDate) {
      // Default to 30 days from invoice date
      paymentDueDate = new Date(invoiceDate);
      paymentDueDate.setDate(
        paymentDueDate.getDate() + INVOICE_DEFAULTS.dueDaysOffset
      );
    }

    if (!validatedData.items || validatedData.items.length === 0) {
      throw new ValidationError("Items are required for SENT/PAID status");
    }

    // Calculate totals (required for SENT/PAID)
    calculations = calculateInvoiceTotals(
      prepareCalculationInput(
        validatedData.items,
        validatedData.tax,
        validatedData.taxType,
        validatedData.discount,
        validatedData.discountType
      )
    );
  }

  // Calculate status timestamps using centralized logic
  const statusTimestamps = calculateStatusTimestamps(status, existingInvoice);

  return {
    invoiceNumber,
    invoiceDate,
    paymentDueDate,
    calculations,
    statusTimestamps,
  };
}

// Default values configuration
const INVOICE_DEFAULTS = {
  tax: 0,
  taxType: TaxType.PERCENTAGE,
  discount: 0,
  discountType: DiscountType.PERCENTAGE,
  isFavorite: false,
  invoiceNumber: "DRAFT",
  dueDaysOffset: 30,
} as const;

// Type definitions for data builders
interface InvoiceDataInput {
  clientId?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total?: number;
  }>;
  tax?: number;
  taxType?: TaxType;
  discount?: number;
  discountType?: DiscountType;
  isFavorite?: boolean;
  paymentAccountId?: string | null;
  customNote?: string | null;
  lateFeeTerms?: string | null;
  invoiceNumber?: string | null;
  invoiceDate?: Date | null;
  paymentDueDate?: Date | null;
  status?: InvoiceStatus;
}

// Centralized field merger utility
function mergeInvoiceFields(
  validatedData: InvoiceDataInput,
  existingData?: Partial<InvoiceDataInput>,
  defaults = INVOICE_DEFAULTS
) {
  return {
    invoiceNumber:
      validatedData.invoiceNumber ??
      existingData?.invoiceNumber ??
      defaults.invoiceNumber,
    invoiceDate: validatedData.invoiceDate ?? existingData?.invoiceDate ?? null,
    paymentDueDate:
      validatedData.paymentDueDate ?? existingData?.paymentDueDate ?? null,
    tax: validatedData.tax ?? existingData?.tax ?? defaults.tax,
    taxType: validatedData.taxType ?? existingData?.taxType ?? defaults.taxType,
    discount:
      validatedData.discount ?? existingData?.discount ?? defaults.discount,
    discountType:
      validatedData.discountType ??
      existingData?.discountType ??
      defaults.discountType,
    isFavorite:
      validatedData.isFavorite ??
      existingData?.isFavorite ??
      defaults.isFavorite,
    paymentAccountId:
      validatedData.paymentAccountId ?? existingData?.paymentAccountId ?? null,
    customNote: validatedData.customNote ?? existingData?.customNote ?? null,
    lateFeeTerms:
      validatedData.lateFeeTerms ?? existingData?.lateFeeTerms ?? null,
  };
}

// Data builder for invoice updates
function buildInvoiceUpdateData(
  validatedData: {
    clientId?: string;
    invoiceNumber?: string | null;
    invoiceDate?: Date | null;
    paymentDueDate?: Date | null;
    items?: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total?: number;
    }>;
    tax?: number;
    taxType?: TaxType;
    discount?: number;
    discountType?: DiscountType;
    status?: InvoiceStatus;
    paymentAccountId?: string | null;
    isFavorite?: boolean;
    customNote?: string | null;
    lateFeeTerms?: string | null;
  },
  calculations: {
    subtotal: number;
    total: number;
    sanitizedItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total?: number;
    }>;
  } | null,
  statusTimestamps: Partial<{
    sentAt: Date;
    paidAt: Date;
  }>
) {
  // Merge fields using the centralized utility
  const merged = mergeInvoiceFields(validatedData);

  return {
    updatedAt: new Date(),
    ...(validatedData.clientId && { clientId: validatedData.clientId }),
    ...(validatedData.invoiceNumber !== undefined && {
      invoiceNumber: validatedData.invoiceNumber,
    }),
    ...(validatedData.invoiceDate !== undefined && {
      invoiceDate: validatedData.invoiceDate,
    }),
    ...(validatedData.paymentDueDate !== undefined && {
      paymentDueDate: validatedData.paymentDueDate,
    }),
    ...(validatedData.items && {
      invoiceItems: calculations?.sanitizedItems
        ? JSON.parse(JSON.stringify(calculations.sanitizedItems))
        : JSON.parse(JSON.stringify(validatedData.items)),
    }),
    ...(calculations && {
      subtotal: calculations.subtotal,
      total: calculations.total,
    }),
    tax: merged.tax,
    taxType: merged.taxType,
    discount: merged.discount,
    discountType: merged.discountType,
    isFavorite: merged.isFavorite,
    paymentAccountId: merged.paymentAccountId,
    customNote: merged.customNote,
    lateFeeTerms: merged.lateFeeTerms,
    ...statusTimestamps,
  };
}

// Data builder for complete invoice updates (SENT/PAID)
function buildCompleteInvoiceUpdateData(
  validatedData: {
    clientId?: string;
    paymentAccountId?: string | null;
    isFavorite?: boolean;
    customNote?: string | null;
    lateFeeTerms?: string | null;
  },
  mergedData: {
    tax: number;
    taxType: TaxType;
    discount: number;
    discountType: DiscountType;
    status?: InvoiceStatus;
  },
  finalInvoiceNumber: string,
  finalInvoiceDate: Date,
  finalPaymentDueDate: Date,
  calculations: {
    subtotal: number;
    total: number;
    sanitizedItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total?: number;
    }>;
  },
  statusTimestamps: Partial<{
    sentAt: Date;
    paidAt: Date;
  }>
) {
  return {
    updatedAt: new Date(),
    ...(validatedData.clientId && { clientId: validatedData.clientId }),
    invoiceNumber: finalInvoiceNumber,
    invoiceDate: finalInvoiceDate,
    paymentDueDate: finalPaymentDueDate,
    invoiceItems: JSON.parse(JSON.stringify(calculations.sanitizedItems)),
    subtotal: calculations.subtotal,
    total: calculations.total,
    tax: mergedData.tax,
    taxType: mergedData.taxType,
    discount: mergedData.discount,
    discountType: mergedData.discountType,
    status: mergedData.status,
    paymentAccountId: validatedData.paymentAccountId,
    isFavorite: validatedData.isFavorite,
    customNote: validatedData.customNote,
    lateFeeTerms: validatedData.lateFeeTerms,
    ...statusTimestamps,
  };
}

// Consolidated invoice creation function
async function createInvoice(
  validatedData: {
    clientId: string;
    tax?: number;
    taxType?: TaxType;
    discount?: number;
    discountType?: DiscountType;
    paymentAccountId?: string | null;
    isFavorite?: boolean;
    customNote?: string | null;
    lateFeeTerms?: string | null;
  },
  businessId: string,
  invoiceNumber: string | null,
  invoiceDate: Date | null,
  paymentDueDate: Date | null,
  calculations: {
    subtotal: number;
    total: number;
    sanitizedItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total?: number;
    }>;
  } | null,
  status: InvoiceStatus,
  statusTimestamps: Partial<{ sentAt: Date; paidAt: Date }> = {},
  isDraft: boolean = false
) {
  if (isDraft) {
    // For drafts, use simpler creation
    const invoiceData = {
      businessId,
      clientId: validatedData.clientId,
      invoiceNumber: invoiceNumber || null,
      invoiceDate: invoiceDate || null,
      paymentDueDate: paymentDueDate || null,
      invoiceItems: JSON.parse(
        JSON.stringify(calculations?.sanitizedItems || [])
      ),
      tax: validatedData.tax || null,
      taxType: validatedData.taxType || TaxType.PERCENTAGE,
      discount: validatedData.discount || 0,
      discountType: validatedData.discountType || DiscountType.PERCENTAGE,
      subtotal: calculations?.subtotal || null,
      total: calculations?.total || null,
      status,
      isFavorite: validatedData.isFavorite || false,
      paymentAccountId: validatedData.paymentAccountId || null,
      customNote: validatedData.customNote || null,
      lateFeeTerms: validatedData.lateFeeTerms || null,
    };

    return await prisma.invoice.create({ data: invoiceData });
  } else {
    // For complete invoices, use the external creation utility and apply timestamps
    const invoiceData = {
      invoiceNumber: invoiceNumber!,
      invoiceDate: invoiceDate!,
      paymentDueDate: paymentDueDate!,
      subtotal: calculations!.subtotal,
      tax: validatedData.tax || 0,
      taxType: validatedData.taxType || TaxType.PERCENTAGE,
      discount: validatedData.discount || 0,
      discountType: validatedData.discountType || DiscountType.PERCENTAGE,
      total: calculations!.total,
      invoiceItems: calculations!.sanitizedItems,
      status,
      isFavorite: validatedData.isFavorite || false,
      businessId,
      clientId: validatedData.clientId,
      paymentAccountId: validatedData.paymentAccountId || undefined,
      customNote: validatedData.customNote || undefined,
      lateFeeTerms: validatedData.lateFeeTerms || undefined,
    };

    const newInvoice = await createInvoiceRecord(invoiceData);

    // Apply timestamps if needed
    if (Object.keys(statusTimestamps).length > 0) {
      await prisma.invoice.update({
        where: { id: newInvoice.id },
        data: statusTimestamps,
      });
    }

    return newInvoice;
  }
}

// Wrapper for creating draft invoices
async function createDraftInvoice(
  validatedData: {
    clientId: string;
    tax?: number;
    taxType?: TaxType;
    discount?: number;
    discountType?: DiscountType;
    paymentAccountId?: string | null;
    isFavorite?: boolean;
    customNote?: string | null;
    lateFeeTerms?: string | null;
  },
  businessId: string,
  invoiceNumber: string | null,
  invoiceDate: Date | null,
  paymentDueDate: Date | null,
  calculations: {
    subtotal: number;
    total: number;
    sanitizedItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total?: number;
    }>;
  } | null,
  status: InvoiceStatus
) {
  return createInvoice(
    validatedData,
    businessId,
    invoiceNumber,
    invoiceDate,
    paymentDueDate,
    calculations,
    status,
    {},
    true // isDraft = true
  );
}

// Database operation for creating complete invoices
async function createCompleteInvoice(
  validatedData: {
    clientId: string;
    tax?: number;
    taxType?: TaxType;
    discount?: number;
    discountType?: DiscountType;
    isFavorite?: boolean;
    paymentAccountId?: string | null;
    customNote?: string | null;
    lateFeeTerms?: string | null;
  },
  businessId: string,
  invoiceNumber: string,
  invoiceDate: Date,
  paymentDueDate: Date,
  calculations: {
    subtotal: number;
    total: number;
    sanitizedItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total?: number;
    }>;
  },
  status: InvoiceStatus,
  statusTimestamps: Partial<{
    sentAt: Date;
    paidAt: Date;
  }>
) {
  return createInvoice(
    validatedData,
    businessId,
    invoiceNumber,
    invoiceDate,
    paymentDueDate,
    calculations,
    status,
    statusTimestamps,
    false // isDraft = false
  );
}

// Helper function to transform Prisma invoice result to InvoiceWithRelations
function transformInvoiceToWithRelations(invoice: {
  id: string;
  invoiceNumber: string | null;
  invoiceDate: Date | null;
  paymentDueDate: Date | null;
  subtotal: number | null;
  tax: number | null;
  taxType: TaxType;
  discount?: number;
  discountType: DiscountType;
  total: number | null;
  invoiceItems: unknown;
  paymentAccountId?: string | null;
  status: InvoiceStatus;
  isFavorite: boolean;
  businessId: string;
  clientId: string;
  customNote?: string | null;
  lateFeeTerms?: string | null;
  sentAt?: Date | null;
  paidAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  client: Client;
  business: Business;
}): InvoiceWithRelations {
  return {
    ...invoice,
    invoiceNumber: invoice.invoiceNumber || INVOICE_DEFAULTS.invoiceNumber,
    invoiceDate: invoice.invoiceDate || new Date(),
    paymentDueDate: invoice.paymentDueDate || new Date(),
    subtotal: invoice.subtotal || 0,
    tax: invoice.tax || INVOICE_DEFAULTS.tax,
    total: invoice.total || 0,
    discount: invoice.discount || INVOICE_DEFAULTS.discount,
    paymentAccountId: invoice.paymentAccountId || null,
    customNote: invoice.customNote || null,
    lateFeeTerms: invoice.lateFeeTerms || null,
    sentAt: invoice.sentAt || null,
    paidAt: invoice.paidAt || null,
    invoiceItems: Array.isArray(invoice.invoiceItems)
      ? invoice.invoiceItems
      : undefined,
  };
}

// Get user and business details for invoice creation
export async function _getUserAndBusiness(): Promise<
  ApiResponse<UserWithBusiness>
> {
  try {
    const session = await _requireAuthentication();

    // Get user with business
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        business: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      message: "User and business details retrieved successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error getting user and business for invoice:", error);
    return {
      success: false,
      message: "Failed to retrieve user and business details",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Create a new invoice - Handles DRAFT, SENT, and PAID status correctly
export async function _createInvoice(
  data: ZCreateInvoiceInput
): Promise<ApiResponse<string>> {
  try {
    const session = await _requireAuthentication();

    // Validate input data
    const validatedData = createInvoiceSchema.safeParse(data);
    if (!validatedData.success) {
      throw new ValidationError(
        `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    // Validate user, business, and client
    const { user } = await validateUserBusinessAndClient(
      session.user.id,
      validatedData.data.clientId
    );

    const invoiceStatus = validatedData.data.status || InvoiceStatus.DRAFT;

    // Handle status-specific logic
    const {
      invoiceNumber,
      invoiceDate,
      paymentDueDate,
      calculations,
      statusTimestamps,
    } = await handleInvoiceStatusLogic(
      invoiceStatus,
      validatedData.data,
      user.business!.id
    );

    // Create invoice based on status
    let newInvoice;
    if (invoiceStatus === InvoiceStatus.DRAFT) {
      newInvoice = await createDraftInvoice(
        validatedData.data,
        user.business!.id,
        invoiceNumber ?? null,
        invoiceDate ?? null,
        paymentDueDate ?? null,
        calculations,
        invoiceStatus
      );

      return createSuccessResponse(
        newInvoice.id,
        "Draft invoice created successfully"
      );
    } else {
      newInvoice = await createCompleteInvoice(
        validatedData.data,
        user.business!.id,
        invoiceNumber!,
        invoiceDate!,
        paymentDueDate!,
        calculations!,
        invoiceStatus,
        statusTimestamps
      );

      return createSuccessResponse(
        newInvoice.id,
        "Invoice created successfully"
      );
    }
  } catch (error) {
    return handleInvoiceError(error);
  }
}

// Update an existing invoice
export async function _updateInvoice(
  data: ZUpdateInvoiceInput
): Promise<ApiResponse<string>> {
  try {
    const session = await _requireAuthentication();

    // Validate input data
    const validatedData = updateInvoiceSchema.safeParse(data);
    if (!validatedData.success) {
      throw new ValidationError(
        `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    // Get the existing invoice first
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: validatedData.data.invoiceId,
        business: {
          userId: session.user.id,
        },
      },
      include: {
        client: true,
        business: true,
      },
    });

    if (!existingInvoice) {
      throw new ValidationError("Invoice not found or access denied");
    }

    // Check if invoice is paid (cannot be updated)
    if (existingInvoice.status === InvoiceStatus.PAID) {
      throw new ValidationError("Cannot update a paid invoice");
    }

    // If client is being changed, validate it belongs to user
    if (
      validatedData.data.clientId &&
      validatedData.data.clientId !== existingInvoice.clientId
    ) {
      await validateUserBusinessAndClient(
        session.user.id,
        validatedData.data.clientId
      );
    }

    // Merge existing data with update data using centralized utility
    const mergedFields = mergeInvoiceFields(validatedData.data, {
      invoiceNumber: existingInvoice.invoiceNumber,
      invoiceDate: existingInvoice.invoiceDate,
      paymentDueDate: existingInvoice.paymentDueDate,
      tax: existingInvoice.tax ?? undefined,
      taxType: existingInvoice.taxType,
      discount: existingInvoice.discount ?? undefined,
      discountType: existingInvoice.discountType,
      paymentAccountId: existingInvoice.paymentAccountId,
      isFavorite: existingInvoice.isFavorite,
      customNote: existingInvoice.customNote,
      lateFeeTerms: existingInvoice.lateFeeTerms,
    });

    const mergedData = {
      clientId: validatedData.data.clientId || existingInvoice.clientId,
      businessId: existingInvoice.businessId,
      ...mergedFields,
      items:
        validatedData.data.items ||
        (existingInvoice.invoiceItems as Array<{
          description: string;
          quantity: number;
          unitPrice: number;
          total?: number;
        }>) ||
        [],
      status: validatedData.data.status || existingInvoice.status,
    };

    // Handle status-specific validation and logic
    const newStatus = mergedData.status;
    const {
      invoiceNumber: finalInvoiceNumber,
      invoiceDate: finalInvoiceDate,
      paymentDueDate: finalPaymentDueDate,
      calculations,
      statusTimestamps,
    } = await handleInvoiceStatusLogic(
      newStatus,
      {
        invoiceNumber: mergedFields.invoiceNumber,
        invoiceDate: mergedFields.invoiceDate,
        paymentDueDate: mergedFields.paymentDueDate,
        items: mergedData.items,
        tax: mergedFields.tax,
        taxType: mergedFields.taxType,
        discount: mergedFields.discount,
        discountType: mergedFields.discountType,
      },
      existingInvoice.businessId,
      existingInvoice
    );

    // Update invoice based on status
    let updatedInvoice;
    if (newStatus === InvoiceStatus.DRAFT) {
      const updateData = buildInvoiceUpdateData(
        validatedData.data,
        calculations,
        statusTimestamps
      );

      updatedInvoice = await prisma.invoice.update({
        where: { id: validatedData.data.invoiceId },
        data: updateData as Prisma.InvoiceUpdateInput,
      });

      return createSuccessResponse(
        updatedInvoice.id,
        "Draft invoice updated successfully"
      );
    } else if (
      newStatus === InvoiceStatus.SENT ||
      newStatus === InvoiceStatus.PAID
    ) {
      const updateData = buildCompleteInvoiceUpdateData(
        validatedData.data,
        {
          tax: mergedFields.tax,
          taxType: mergedFields.taxType,
          discount: mergedFields.discount,
          discountType: mergedFields.discountType,
          status: newStatus,
        },
        finalInvoiceNumber!,
        finalInvoiceDate!,
        finalPaymentDueDate!,
        calculations!,
        statusTimestamps
      );

      updatedInvoice = await prisma.invoice.update({
        where: { id: validatedData.data.invoiceId },
        data: updateData as Prisma.InvoiceUpdateInput,
      });

      return createSuccessResponse(
        updatedInvoice.id,
        "Invoice updated successfully"
      );
    }

    // This shouldn't be reached, but just in case
    throw new ValidationError("Invalid invoice status");
  } catch (error) {
    return handleInvoiceError(error);
  }
}

// Get single invoice
export async function _getInvoice(invoiceId: string): Promise<InvoiceResponse> {
  try {
    const session = await _requireAuthentication();

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        business: {
          userId: session.user.id,
        },
      },
      include: {
        client: true,
        business: true,
      },
    });

    if (!invoice) {
      return {
        success: false,
        message: "Invoice not found or access denied",
      };
    }

    return {
      success: true,
      message: "Invoice retrieved successfully",
      data: transformInvoiceToWithRelations(invoice),
    };
  } catch (error) {
    console.error("Error getting invoice:", error);
    return {
      success: false,
      message: "Failed to retrieve invoice",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Get invoices with filters and pagination
export async function _getInvoices(
  filters?: ZInvoiceFiltersInput,
  pagination?: ZPaginationInput
): Promise<InvoiceListApiResponse> {
  try {
    const session = await _requireAuthentication();

    // Validate pagination
    const validatedPagination = paginationSchema.safeParse(pagination || {});
    if (!validatedPagination.success) {
      return {
        success: false,
        message: `Pagination validation error: ${validatedPagination.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Validate filters if provided
    let validatedFilters;
    if (filters) {
      const filterValidation = invoiceFiltersSchema.safeParse(filters);
      if (!filterValidation.success) {
        return {
          success: false,
          message: `Filter validation error: ${filterValidation.error.errors
            .map((e) => e.message)
            .join(", ")}`,
        };
      }
      validatedFilters = filterValidation.data;
    }

    // Get user's business
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        business: true,
      },
    });

    if (!user || !user.business) {
      return {
        success: false,
        message: "Business profile not found",
      };
    }

    const { page, limit, sortBy, sortOrder } = validatedPagination.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: {
      businessId: string;
      status?: InvoiceStatus;
      clientId?: string;
      invoiceDate?: {
        gte?: Date;
        lte?: Date;
      };
      paymentDueDate?: {
        gte?: Date;
        lte?: Date;
      };
      OR?: Array<{
        client?: { BusinessName?: { contains: string; mode: "insensitive" } };
        invoiceNumber?: { contains: string; mode: "insensitive" };
      }>;
    } = {
      businessId: user.business.id,
    };

    if (validatedFilters) {
      if (validatedFilters.status) {
        whereClause.status = validatedFilters.status;
      }
      if (validatedFilters.clientId) {
        whereClause.clientId = validatedFilters.clientId;
      }
      if (validatedFilters.dateFrom || validatedFilters.dateTo) {
        whereClause.invoiceDate = {};
        if (validatedFilters.dateFrom) {
          whereClause.invoiceDate.gte = validatedFilters.dateFrom;
        }
        if (validatedFilters.dateTo) {
          whereClause.invoiceDate.lte = validatedFilters.dateTo;
        }
      }
      if (validatedFilters.dueDateFrom || validatedFilters.dueDateTo) {
        whereClause.paymentDueDate = {};
        if (validatedFilters.dueDateFrom) {
          whereClause.paymentDueDate.gte = validatedFilters.dueDateFrom;
        }
        if (validatedFilters.dueDateTo) {
          whereClause.paymentDueDate.lte = validatedFilters.dueDateTo;
        }
      }

      // Handle search query for client name and invoice number
      if (validatedFilters.searchQuery) {
        whereClause.OR = [
          {
            client: {
              BusinessName: {
                contains: validatedFilters.searchQuery,
                mode: "insensitive",
              },
            },
          },
          {
            invoiceNumber: {
              contains: validatedFilters.searchQuery,
              mode: "insensitive",
            },
          },
        ];
      }
    }

    // Get invoices and total count
    const [invoices, totalCount] = await Promise.all([
      prisma.invoice.findMany({
        where: whereClause,
        include: {
          client: true,
          business: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.invoice.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      message: "Invoices retrieved successfully",
      data: {
        invoices: invoices.map(transformInvoiceToWithRelations),
        totalCount,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error getting invoices:", error);
    return {
      success: false,
      message: "Failed to retrieve invoices",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Get invoice statistics
export async function _getInvoiceStats(): Promise<InvoiceStatsResponse> {
  try {
    const session = await _requireAuthentication();

    // Get user's business
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        business: true,
      },
    });

    if (!user || !user.business) {
      return {
        success: false,
        message: "Business profile not found",
      };
    }

    const businessId = user.business.id;
    const now = new Date();

    // Get statistics
    const [
      totalInvoices,
      totalRevenue,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      draftInvoices,
    ] = await Promise.all([
      // Total invoices
      prisma.invoice.count({
        where: { businessId },
      }),
      // Total revenue (sum of paid invoices)
      prisma.invoice.aggregate({
        where: {
          businessId,
          status: InvoiceStatus.PAID,
        },
        _sum: {
          subtotal: true,
        },
      }),
      // Paid invoices count
      prisma.invoice.count({
        where: {
          businessId,
          status: InvoiceStatus.PAID,
        },
      }),
      // Pending invoices count (sent but not paid)
      prisma.invoice.count({
        where: {
          businessId,
          status: InvoiceStatus.SENT,
        },
      }),
      // Overdue invoices count
      prisma.invoice.count({
        where: {
          businessId,
          status: InvoiceStatus.OVERDUE,
          paymentDueDate: {
            lt: now,
          },
        },
      }),
      // Draft invoices count
      prisma.invoice.count({
        where: {
          businessId,
          status: InvoiceStatus.DRAFT,
        },
      }),
    ]);

    return {
      success: true,
      message: "Invoice statistics retrieved successfully",
      data: {
        totalInvoices,
        totalRevenue: totalRevenue._sum.subtotal || 0,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        draftInvoices,
      },
    };
  } catch (error) {
    console.error("Error getting invoice statistics:", error);
    return {
      success: false,
      message: "Failed to retrieve invoice statistics",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Delete an invoice
export async function _deleteInvoice(
  data: ZDeleteInvoiceInput
): Promise<InvoiceDeleteResponse> {
  try {
    const session = await _requireAuthentication();

    // Validate input data
    const validatedData = deleteInvoiceSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Get the existing invoice
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: validatedData.data.invoiceId,
        business: {
          userId: session.user.id,
        },
      },
    });

    if (!existingInvoice) {
      return {
        success: false,
        message: "Invoice not found or access denied",
      };
    }

    // Check if invoice is paid (cannot be deleted)
    if (existingInvoice.status === InvoiceStatus.PAID) {
      return {
        success: false,
        message: "Cannot delete a paid invoice",
      };
    }

    // Delete the invoice
    await prisma.invoice.delete({
      where: { id: validatedData.data.invoiceId },
    });

    return {
      success: true,
      message: "Invoice deleted successfully",
      data: {
        deletedId: validatedData.data.invoiceId,
      },
    };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return {
      success: false,
      message: "Failed to delete invoice",
    };
  } finally {
    await prisma.$disconnect();
  }
}
