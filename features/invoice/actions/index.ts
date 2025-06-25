"use server";

import { PrismaClient, InvoiceStatus } from "@prisma/client";
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
} from "@/dataSchemas/invoice";

const prisma = new PrismaClient();

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

// Generate unique invoice number
async function generateInvoiceNumber(businessId: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `INV-${currentYear}`;

  // Get the last invoice number for this business this year
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      businessId,
      invoiceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let nextNumber = 1;
  if (lastInvoice && lastInvoice.invoiceNumber) {
    const lastNumberPart = lastInvoice.invoiceNumber.split("-").pop();
    if (lastNumberPart && !isNaN(parseInt(lastNumberPart))) {
      nextNumber = parseInt(lastNumberPart) + 1;
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(4, "0")}`;
}

// Create a new invoice
export async function _createInvoice(
  data: CreateInvoiceInput
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
    const validatedData = createInvoiceSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
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
        message:
          "Business profile not found. Please complete your business setup.",
      };
    }

    // Verify client belongs to user
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

    // Generate invoice number if not provided
    const invoiceNumber =
      validatedData.data.invoiceNumber ||
      (await generateInvoiceNumber(user.business.id));

    // Check if invoice number is unique
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
    });

    if (existingInvoice) {
      return {
        success: false,
        message: "Invoice number already exists",
      };
    }

    // Create the invoice
    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        invoiceDate: validatedData.data.invoiceDate,
        paymentDueDate: validatedData.data.paymentDueDate,
        subtotal: validatedData.data.subtotal,
        taxes: validatedData.data.taxes,
        acceptedPaymentMethods: validatedData.data.acceptedPaymentMethods,
        status: InvoiceStatus.DRAFT,
        businessId: user.business.id,
        clientId: validatedData.data.clientId,
      },
      include: {
        client: true,
        business: true,
      },
    });

    return {
      success: true,
      message: "Invoice created successfully",
      data: newInvoice as InvoiceWithRelations,
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return {
      success: false,
      message: "Failed to create invoice",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Update an existing invoice
export async function _updateInvoice(
  data: UpdateInvoiceInput
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
        ...(validatedData.data.subtotal !== undefined && {
          subtotal: validatedData.data.subtotal,
        }),
        ...(validatedData.data.taxes !== undefined && {
          taxes: validatedData.data.taxes,
        }),
        ...(validatedData.data.acceptedPaymentMethods && {
          acceptedPaymentMethods: validatedData.data.acceptedPaymentMethods,
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
      data: updatedInvoice,
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
      data: updatedInvoice,
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
      data: invoice,
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
        invoices,
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
