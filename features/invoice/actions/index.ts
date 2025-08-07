"use server";

import {
  PrismaClient,
  InvoiceStatus,
  Client,
  Business,
  TaxType,
  DiscountType,
} from "@prisma/client";
import { auth } from "@/auth";
import { ApiResponse } from "@/types/api";
import { UserWithBusiness } from "@/types/database";
import { InvoiceWithRelations } from "@/types/invoice";
import {
  InvoiceResponse,
  InvoiceListApiResponse,
  InvoiceStatsResponse,
  InvoiceDeleteResponse,
} from "@/types/api/invoice";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  updateInvoiceStatusSchema,
  invoiceFiltersSchema,
  paginationSchema,
  deleteInvoiceSchema,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  UpdateInvoiceStatusInput,
  InvoiceFiltersInput,
  PaginationInput,
  DeleteInvoiceInput,
  ZCreateInvoiceInput,
} from "@/dataSchemas/invoice";
import { calculateInvoiceTotals } from "@/utils/invoice-calculations";
import {
  validateUserBusinessAndClient,
  generateUniqueInvoiceNumber,
} from "@/utils/invoice-validation";
import { createInvoiceRecord } from "@/utils/invoice-persistence";
import {
  handleInvoiceError,
  createSuccessResponse,
  AuthenticationError,
  ValidationError,
} from "@/utils/invoice-errors";

const prisma = new PrismaClient();

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
    invoiceNumber: invoice.invoiceNumber || "DRAFT", // Provide default for drafts
    invoiceDate: invoice.invoiceDate || new Date(), // Provide default
    paymentDueDate: invoice.paymentDueDate || new Date(), // Provide default
    subtotal: invoice.subtotal || 0, // Default to 0 if not present
    tax: invoice.tax || 0, // Default to 0 if not present
    total: invoice.total || 0, // Default to 0 if not present
    discount: invoice.discount || 0, // Default to 0 if not present
    paymentAccountId: invoice.paymentAccountId || null, // Ensure null instead of undefined
    customNote: invoice.customNote || null, // Ensure null instead of undefined
    lateFeeTerms: invoice.lateFeeTerms || null, // Ensure null instead of undefined
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
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

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
    const session = await auth();
    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

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
    let invoiceNumber = validatedData.data.invoiceNumber;
    let invoiceDate = validatedData.data.invoiceDate;
    let paymentDueDate = validatedData.data.paymentDueDate;
    let calculations = null;

    // Handle status-specific logic
    if (invoiceStatus === InvoiceStatus.DRAFT) {
      // DRAFT: Very flexible, allow minimal data
      if (validatedData.data.items && validatedData.data.items.length > 0) {
        calculations = calculateInvoiceTotals({
          items: validatedData.data.items,
          tax: validatedData.data.tax || 0,
          taxType: validatedData.data.taxType || TaxType.PERCENTAGE,
          discount: validatedData.data.discount || 0,
          discountType:
            validatedData.data.discountType || DiscountType.PERCENTAGE,
        });
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
    } else if (
      invoiceStatus === InvoiceStatus.SENT ||
      invoiceStatus === InvoiceStatus.PAID
    ) {
      // SENT/PAID: Require complete data
      if (!invoiceNumber) {
        invoiceNumber = await generateUniqueInvoiceNumber(user.business!.id);
      }

      if (!invoiceDate) {
        invoiceDate = new Date();
      }

      if (!paymentDueDate) {
        // Default to 30 days from invoice date
        paymentDueDate = new Date(invoiceDate);
        paymentDueDate.setDate(paymentDueDate.getDate() + 30);
      }

      // Calculate totals (required for SENT/PAID)
      calculations = calculateInvoiceTotals({
        items: validatedData.data.items || [],
        tax: validatedData.data.tax || 0,
        taxType: validatedData.data.taxType || TaxType.PERCENTAGE,
        discount: validatedData.data.discount || 0,
        discountType:
          validatedData.data.discountType || DiscountType.PERCENTAGE,
      });
    }

    // For DRAFT status, we need to create the invoice directly since some fields are optional
    if (invoiceStatus === InvoiceStatus.DRAFT) {
      const draftInvoice = await prisma.invoice.create({
        data: {
          businessId: user.business!.id,
          clientId: validatedData.data.clientId,
          invoiceNumber: invoiceNumber || null,
          invoiceDate: invoiceDate || null,
          paymentDueDate: paymentDueDate || null,
          invoiceItems: JSON.parse(
            JSON.stringify(validatedData.data.items || [])
          ),
          tax: validatedData.data.tax || null,
          taxType: validatedData.data.taxType || TaxType.PERCENTAGE,
          discount: validatedData.data.discount || 0,
          discountType:
            validatedData.data.discountType || DiscountType.PERCENTAGE,
          subtotal: calculations?.subtotal || null,
          total: calculations?.total || null,
          status: invoiceStatus,
          isFavorite: validatedData.data.isFavorite || false,
          paymentAccountId: validatedData.data.paymentAccountId || null,
          customNote: validatedData.data.customNote || null,
          lateFeeTerms: validatedData.data.lateFeeTerms || null,
        },
      });

      return createSuccessResponse(
        draftInvoice.id,
        "Draft invoice created successfully"
      );
    } else {
      // For SENT/PAID status, use the persistence function with required fields
      const invoiceData = {
        invoiceNumber: invoiceNumber!,
        invoiceDate: invoiceDate!,
        paymentDueDate: paymentDueDate!,
        subtotal: calculations!.subtotal,
        tax: validatedData.data.tax || 0,
        taxType: validatedData.data.taxType || TaxType.PERCENTAGE,
        discount: validatedData.data.discount || 0,
        discountType:
          validatedData.data.discountType || DiscountType.PERCENTAGE,
        total: calculations!.total,
        invoiceItems: calculations!.sanitizedItems,
        status: invoiceStatus,
        isFavorite: validatedData.data.isFavorite || false,
        businessId: user.business!.id,
        clientId: validatedData.data.clientId,
        paymentAccountId: validatedData.data.paymentAccountId,
        customNote: validatedData.data.customNote,
        lateFeeTerms: validatedData.data.lateFeeTerms,
      };

      // Create invoice with required fields
      const newInvoice = await createInvoiceRecord(invoiceData);

      // Update timestamps based on status
      if (
        invoiceStatus === InvoiceStatus.SENT ||
        invoiceStatus === InvoiceStatus.PAID
      ) {
        await prisma.invoice.update({
          where: { id: newInvoice.id },
          data: {
            ...(invoiceStatus === InvoiceStatus.SENT && { sentAt: new Date() }),
            ...(invoiceStatus === InvoiceStatus.PAID && {
              sentAt: new Date(),
              paidAt: new Date(),
            }),
          },
        });
      }

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
  data: UpdateInvoiceInput
): Promise<InvoiceResponse> {
  console.log("Updating invoice with data:", data);
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Validate input data
    const validatedData = updateInvoiceSchema.safeParse(data);
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
      include: {
        client: true,
        business: true,
      },
    });

    if (!existingInvoice) {
      return {
        success: false,
        message: "Invoice not found or access denied",
      };
    }

    // Check if invoice is paid (cannot be updated)
    if (existingInvoice.status === InvoiceStatus.PAID) {
      return {
        success: false,
        message: "Cannot update a paid invoice",
      };
    }

    // If client is being changed, verify it belongs to user
    if (validatedData.data.clientId) {
      const client = await prisma.client.findFirst({
        where: {
          id: validatedData.data.clientId,
          userId: session.user.id,
        },
      });

      if (!client) {
        return {
          success: false,
          message: "Client not found or access denied",
        };
      }
    }

    // Validate and sanitize invoice items if provided
    let sanitizedItems = undefined;
    if (validatedData.data.items) {
      const invoiceItems = validatedData.data.items;

      if (invoiceItems.length === 0) {
        return {
          success: false,
          message: "At least one invoice item is required",
        };
      }

      sanitizedItems = invoiceItems.map((item, index) => {
        const sanitizedItem = {
          description: item.description?.trim() || `Item ${index + 1}`,
          quantity: Math.max(1, Math.round(item.quantity || 1)),
          unitPrice: Math.max(0.01, Number((item.unitPrice || 0).toFixed(2))),
        };

        // Calculate total for this item
        const itemTotal = sanitizedItem.quantity * sanitizedItem.unitPrice;

        return {
          ...sanitizedItem,
          total: Number(itemTotal.toFixed(2)),
        };
      });
    }

    // Update the invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: validatedData.data.invoiceId },
      data: {
        ...(validatedData.data.clientId && {
          clientId: validatedData.data.clientId,
        }),
        ...(validatedData.data.invoiceDate && {
          invoiceDate: validatedData.data.invoiceDate,
        }),
        ...(validatedData.data.paymentDueDate && {
          paymentDueDate: validatedData.data.paymentDueDate,
        }),
        ...(validatedData.data.tax !== undefined && {
          tax: validatedData.data.tax,
        }),
        ...(validatedData.data.taxType && {
          taxType: validatedData.data.taxType,
        }),
        ...(validatedData.data.discount !== undefined && {
          discount: validatedData.data.discount,
        }),
        ...(validatedData.data.discountType && {
          discountType: validatedData.data.discountType,
        }),
        ...(sanitizedItems && {
          invoiceItems: sanitizedItems,
        }),
        ...(validatedData.data.isFavorite !== undefined && {
          isFavorite: validatedData.data.isFavorite,
        }),
        ...(validatedData.data.status && {
          status: validatedData.data.status,
        }),
        updatedAt: new Date(),
      },
      include: {
        client: true,
        business: true,
      },
    });

    return {
      success: true,
      message: "Invoice updated successfully",
      data: transformInvoiceToWithRelations(updatedInvoice),
    };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return {
      success: false,
      message: "Failed to update invoice",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Update invoice status
export async function _updateInvoiceStatus(
  data: UpdateInvoiceStatusInput
): Promise<InvoiceResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Validate input data
    const validatedData = updateInvoiceStatusSchema.safeParse(data);
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
      include: {
        client: true,
        business: true,
      },
    });

    if (!existingInvoice) {
      return {
        success: false,
        message: "Invoice not found or access denied",
      };
    }

    // Validate status transitions
    if (
      existingInvoice.status === InvoiceStatus.PAID &&
      validatedData.data.status !== InvoiceStatus.PAID
    ) {
      return {
        success: false,
        message: "Cannot change status of a paid invoice",
      };
    }

    // Update the invoice status
    const updatedInvoice = await prisma.invoice.update({
      where: { id: validatedData.data.invoiceId },
      data: {
        status: validatedData.data.status,
        updatedAt: new Date(),
      },
      include: {
        client: true,
        business: true,
      },
    });

    return {
      success: true,
      message: "Invoice status updated successfully",
      data: transformInvoiceToWithRelations(updatedInvoice),
    };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return {
      success: false,
      message: "Failed to update invoice status",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Get single invoice
export async function _getInvoice(invoiceId: string): Promise<InvoiceResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

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
  filters?: InvoiceFiltersInput,
  pagination?: PaginationInput
): Promise<InvoiceListApiResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

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
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
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
  data: DeleteInvoiceInput
): Promise<InvoiceDeleteResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

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
