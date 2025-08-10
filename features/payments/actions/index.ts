"use server";

import {
  PaymentAccount,
  PrismaClient,
  PaymentGatewayType,
  Prisma,
} from "@prisma/client";
import { _requireAuthentication } from "@/features/auth/actions";
import {
  createPaymentAccountSchema,
  updatePaymentAccountSchema,
  ZCreatePaymentAccountInput,
  ZUpdatePaymentAccountInput,
} from "@/shared/validators/payment";
import { ApiResponse, BaseResponse } from "@/types/api";

const prisma = new PrismaClient();

// Helper function to verify account ownership
async function _verifyAccountOwnership(
  accountId: string,
  userId: string
): Promise<PaymentAccount | null> {
  return await prisma.paymentAccount.findFirst({
    where: {
      id: accountId,
      userId: userId,
    },
  });
}

// Helper function to unset other default accounts
async function _unsetOtherDefaults(
  userId: string,
  excludeAccountId?: string,
  tx?: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) {
  const client = tx || prisma;
  return await client.paymentAccount.updateMany({
    where: {
      userId: userId,
      isDefault: true,
      ...(excludeAccountId && { id: { not: excludeAccountId } }),
    },
    data: {
      isDefault: false,
    },
  });
}

// Helper function to check for duplicate account names
async function _checkDuplicateAccountName(
  accountName: string,
  userId: string,
  excludeAccountId?: string
): Promise<boolean> {
  const existingAccount = await prisma.paymentAccount.findFirst({
    where: {
      accountName: accountName,
      userId: userId,
      ...(excludeAccountId && { id: { not: excludeAccountId } }),
    },
  });
  return !!existingAccount;
}

// Helper function to create standardized error responses
function _createErrorResponse(message: string): BaseResponse {
  return {
    success: false,
    message,
  };
}

function _createValidationErrorResponse(
  errors: { message: string }[]
): BaseResponse {
  return {
    success: false,
    message: `Validation error: ${errors.map((e) => e.message).join(", ")}`,
  };
}

// Helper function to create payment account within existing transaction
export async function _createPaymentAccountInTransaction(
  userId: string,
  gatewayType: PaymentGatewayType,
  accountName: string,
  accountData: Record<string, unknown>,
  isActive = true,
  isDefault = false,
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) {
  // If this is set as default, unset other defaults for this user
  if (isDefault) {
    await _unsetOtherDefaults(userId, undefined, tx);
  }

  // Create payment account
  return await tx.paymentAccount.create({
    data: {
      userId,
      gatewayType,
      accountName,
      accountData: accountData as object, // Prisma JsonValue accepts object
      isActive,
      isDefault,
    },
  });
}

export async function _createPaymentAccount(
  data: ZCreatePaymentAccountInput
): Promise<ApiResponse<PaymentAccount>> {
  try {
    const session = await _requireAuthentication();

    // Validate the input data using the discriminated union schema
    const validatedData = createPaymentAccountSchema.safeParse(data);
    if (!validatedData.success) {
      return _createValidationErrorResponse(validatedData.error.errors);
    }

    // Check for duplicate account name
    const isDuplicate = await _checkDuplicateAccountName(
      validatedData.data.accountName,
      session.user.id
    );
    if (isDuplicate) {
      return _createErrorResponse("An account with this name already exists");
    }

    // Use transaction for atomic operations
    const newPaymentAccount = await prisma.$transaction(async (tx) => {
      // If this is set as default, unset other defaults for this user
      if (validatedData.data.isDefault) {
        await _unsetOtherDefaults(session.user.id, undefined, tx);
      }

      // Create payment account
      return await tx.paymentAccount.create({
        data: {
          userId: session.user.id,
          gatewayType: validatedData.data.gatewayType,
          accountName: validatedData.data.accountName,
          accountData: validatedData.data.accountData,
          isActive: validatedData.data.isActive ?? true,
          isDefault: validatedData.data.isDefault ?? false,
        },
      });
    });

    return {
      success: true,
      message: "Payment account created successfully",
      data: newPaymentAccount,
    };
  } catch (error) {
    console.error("Error creating payment account:", error);
    return _createErrorResponse("Failed to create payment account");
  }
}

export async function _updatePaymentAccount(
  paymentAccountId: string,
  data: ZUpdatePaymentAccountInput
): Promise<ApiResponse<PaymentAccount>> {
  try {
    const session = await _requireAuthentication();

    if (!paymentAccountId) {
      return _createErrorResponse("Payment account ID is required");
    }

    // Validate the update data
    const validatedData = updatePaymentAccountSchema.safeParse(data);
    if (!validatedData.success) {
      return _createValidationErrorResponse(validatedData.error.errors);
    }

    // Verify payment account exists and belongs to current user
    const existingAccount = await _verifyAccountOwnership(
      paymentAccountId,
      session.user.id
    );
    if (!existingAccount) {
      return _createErrorResponse("Payment account not found or access denied");
    }

    // Check for duplicate account name if name is being updated
    if (
      validatedData.data.accountName &&
      validatedData.data.accountName !== existingAccount.accountName
    ) {
      const isDuplicate = await _checkDuplicateAccountName(
        validatedData.data.accountName,
        session.user.id,
        paymentAccountId
      );
      if (isDuplicate) {
        return _createErrorResponse("An account with this name already exists");
      }
    }

    // Use transaction for atomic operations
    const updatedPaymentAccount = await prisma.$transaction(async (tx) => {
      // If this is being set as default, unset other defaults for this user
      if (validatedData.data.isDefault) {
        await _unsetOtherDefaults(session.user.id, paymentAccountId, tx);
      }

      // Update payment account
      return await tx.paymentAccount.update({
        where: { id: paymentAccountId },
        data: {
          ...validatedData.data,
          updatedAt: new Date(),
        },
      });
    });

    return {
      success: true,
      message: "Payment account updated successfully",
      data: updatedPaymentAccount,
    };
  } catch (error) {
    console.error("Error updating payment account:", error);
    return _createErrorResponse("Failed to update payment account");
  }
}

export async function _getUserPaymentAccounts(): Promise<
  ApiResponse<PaymentAccount[]>
> {
  try {
    const session = await _requireAuthentication();

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
      data: paymentAccounts,
    };
  } catch (error) {
    console.error("Error getting user payment accounts:", error);
    return _createErrorResponse("Failed to retrieve payment accounts");
  }
}

export async function _getPaymentAccountById(
  paymentAccountId: string
): Promise<ApiResponse<PaymentAccount>> {
  try {
    const session = await _requireAuthentication();

    if (!paymentAccountId) {
      return _createErrorResponse("Payment account ID is required");
    }

    const paymentAccount = await _verifyAccountOwnership(
      paymentAccountId,
      session.user.id
    );
    if (!paymentAccount) {
      return _createErrorResponse("Payment account not found or access denied");
    }

    return {
      success: true,
      message: "Payment account retrieved successfully",
      data: paymentAccount,
    };
  } catch (error) {
    console.error("Error getting payment account by ID:", error);
    return _createErrorResponse("Failed to retrieve payment account");
  }
}

export async function _deletePaymentAccount(
  paymentAccountId: string
): Promise<BaseResponse> {
  try {
    const session = await _requireAuthentication();

    if (!paymentAccountId) {
      return _createErrorResponse("Payment account ID is required");
    }

    // Verify payment account exists and belongs to current user
    const existingAccount = await _verifyAccountOwnership(
      paymentAccountId,
      session.user.id
    );
    if (!existingAccount) {
      return _createErrorResponse("Payment account not found or access denied");
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
    return _createErrorResponse("Failed to delete payment account");
  }
}

export async function _setPaymentAccountAsDefault(
  paymentAccountId: string
): Promise<ApiResponse<PaymentAccount>> {
  try {
    const session = await _requireAuthentication();

    if (!paymentAccountId) {
      return _createErrorResponse("Payment account ID is required");
    }

    // Verify payment account exists and belongs to current user
    const existingAccount = await _verifyAccountOwnership(
      paymentAccountId,
      session.user.id
    );
    if (!existingAccount) {
      return _createErrorResponse("Payment account not found or access denied");
    }

    // If account is already default, no need to do anything
    if (existingAccount.isDefault) {
      return {
        success: true,
        message: "Account is already set as default",
        data: existingAccount,
      };
    }

    // Use transaction for atomic operation
    const updatedAccount = await prisma.$transaction(async (tx) => {
      // First, unset all other accounts as default for this user
      await _unsetOtherDefaults(session.user.id, paymentAccountId, tx);

      // Then set the target account as default
      return await tx.paymentAccount.update({
        where: { id: paymentAccountId },
        data: {
          isDefault: true,
          updatedAt: new Date(),
        },
      });
    });

    return {
      success: true,
      message: "Payment account set as default successfully",
      data: updatedAccount,
    };
  } catch (error) {
    console.error("Error setting payment account as default:", error);
    return _createErrorResponse("Failed to set payment account as default");
  }
}
