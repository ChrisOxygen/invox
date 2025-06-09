"use server";

import { PaymentAccount, PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import {
  createPaymentAccountSchema,
  updatePaymentAccountSchema,
  type CreatePaymentAccountInput,
  type UpdatePaymentAccountInput,
  type NigerianBankAccount,
  type PaypalAccount,
  type WiseAccount,
  type AchAccount,
} from "@/dataSchemas/payments";

const prisma = new PrismaClient();

// Types
interface PaymentAccountResult {
  success: boolean;
  message: string;
  paymentAccount?: PaymentAccount;
}

interface PaymentAccountsListResult {
  success: boolean;
  message: string;
  paymentAccounts?: PaymentAccount[];
}

interface BasicResponse {
  success: boolean;
  message: string;
}

type GatewayAccountData =
  | NigerianBankAccount
  | PaypalAccount
  | WiseAccount
  | AchAccount;

export async function _createPaymentAccount(
  data: CreatePaymentAccountInput
): Promise<PaymentAccountResult> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Validate the input data using the discriminated union schema
    const validatedData = createPaymentAccountSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // If this is set as default, unset other defaults for this gateway type
    if (validatedData.data.isDefault) {
      await prisma.paymentAccount.updateMany({
        where: {
          userId: session.user.id,
          gatewayType: validatedData.data.gatewayType,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create payment account
    const newPaymentAccount = await prisma.paymentAccount.create({
      data: {
        userId: session.user.id,
        gatewayType: validatedData.data.gatewayType,
        accountName: validatedData.data.accountName,
        accountData: validatedData.data.accountData,
        isActive: validatedData.data.isActive ?? true,
        isDefault: validatedData.data.isDefault ?? false,
      },
    });

    return {
      success: true,
      message: "Payment account created successfully",
      paymentAccount: newPaymentAccount,
    };
  } catch (error) {
    console.error("Error creating payment account:", error);
    return {
      success: false,
      message: "Failed to create payment account",
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function _updatePaymentAccount(
  paymentAccountId: string,
  data: UpdatePaymentAccountInput
): Promise<PaymentAccountResult> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    if (!paymentAccountId) {
      return {
        success: false,
        message: "Payment account ID is required",
      };
    }

    // Validate the update data
    const validatedData = updatePaymentAccountSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Verify payment account exists and belongs to current user
    const existingAccount = await prisma.paymentAccount.findFirst({
      where: {
        id: paymentAccountId,
        userId: session.user.id,
      },
    });

    if (!existingAccount) {
      return {
        success: false,
        message: "Payment account not found or access denied",
      };
    }

    // If this is being set as default, unset other defaults for this gateway type
    if (validatedData.data.isDefault) {
      await prisma.paymentAccount.updateMany({
        where: {
          userId: session.user.id,
          gatewayType: existingAccount.gatewayType,
          isDefault: true,
          id: {
            not: paymentAccountId,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Update payment account
    const updatedPaymentAccount = await prisma.paymentAccount.update({
      where: { id: paymentAccountId },
      data: {
        ...validatedData.data,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Payment account updated successfully",
      paymentAccount: updatedPaymentAccount,
    };
  } catch (error) {
    console.error("Error updating payment account:", error);
    return {
      success: false,
      message: "Failed to update payment account",
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function _getUserPaymentAccounts(): Promise<PaymentAccountsListResult> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const paymentAccounts = await prisma.paymentAccount.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: "desc" },
        { isActive: "desc" },
        { createdAt: "desc" },
      ],
    });

    return {
      success: true,
      message: "Payment accounts retrieved successfully",
      paymentAccounts,
    };
  } catch (error) {
    console.error("Error getting user payment accounts:", error);
    return {
      success: false,
      message: "Failed to retrieve payment accounts",
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function _getPaymentAccountById(
  paymentAccountId: string
): Promise<PaymentAccountResult> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    if (!paymentAccountId) {
      return {
        success: false,
        message: "Payment account ID is required",
      };
    }

    const paymentAccount = await prisma.paymentAccount.findFirst({
      where: {
        id: paymentAccountId,
        userId: session.user.id,
      },
    });

    if (!paymentAccount) {
      return {
        success: false,
        message: "Payment account not found or access denied",
      };
    }

    return {
      success: true,
      message: "Payment account retrieved successfully",
      paymentAccount,
    };
  } catch (error) {
    console.error("Error getting payment account by ID:", error);
    return {
      success: false,
      message: "Failed to retrieve payment account",
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function _deletePaymentAccount(
  paymentAccountId: string
): Promise<BasicResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    if (!paymentAccountId) {
      return {
        success: false,
        message: "Payment account ID is required",
      };
    }

    // Verify payment account exists and belongs to current user
    const existingAccount = await prisma.paymentAccount.findFirst({
      where: {
        id: paymentAccountId,
        userId: session.user.id,
      },
    });

    if (!existingAccount) {
      return {
        success: false,
        message: "Payment account not found or access denied",
      };
    }

    // Delete payment account
    await prisma.paymentAccount.delete({
      where: { id: paymentAccountId },
    });

    return {
      success: true,
      message: "Payment account deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting payment account:", error);
    return {
      success: false,
      message: "Failed to delete payment account",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Export types
export type {
  PaymentAccountResult,
  PaymentAccountsListResult,
  BasicResponse,
  GatewayAccountData,
};
