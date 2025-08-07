import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface UserBusinessData {
  id: string;
  business: {
    id: string;
    businessName: string;
  } | null;
}

export interface ClientData {
  id: string;
  userId: string;
}

export interface ValidationResult {
  user: UserBusinessData;
  client: ClientData;
}

/**
 * Validates user has business and client access in a single query
 */
export async function validateUserBusinessAndClient(
  userId: string,
  clientId: string
): Promise<ValidationResult> {
  // Single query to get user with business and verify client ownership
  const [user, client] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
    }),
    prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
      },
    }),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.business) {
    throw new Error(
      "Business profile not found. Please complete your business setup."
    );
  }

  if (!client) {
    throw new Error("Client not found or access denied");
  }

  return { user, client };
}

/**
 * Generates unique invoice number with atomic operation
 */
export async function generateUniqueInvoiceNumber(
  businessId: string,
  providedNumber?: string
): Promise<string> {
  if (providedNumber) {
    // Check if provided number is unique
    const existing = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: providedNumber,
        businessId,
      },
      select: { id: true },
    });

    if (existing) {
      throw new Error("Invoice number already exists");
    }

    return providedNumber;
  }

  // Generate new number
  const currentYear = new Date().getFullYear();
  const prefix = `INV-${currentYear}`;

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
    select: {
      invoiceNumber: true,
    },
  });

  let nextNumber = 1;
  if (lastInvoice?.invoiceNumber) {
    const lastNumberPart = lastInvoice.invoiceNumber.split("-").pop();
    if (lastNumberPart && !isNaN(parseInt(lastNumberPart))) {
      nextNumber = parseInt(lastNumberPart) + 1;
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(4, "0")}`;
}
