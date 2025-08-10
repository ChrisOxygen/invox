"use server";

import { PrismaClient } from "@prisma/client";
import { _requireAuthentication } from "@/features/auth/actions";
import { _createPaymentAccountInTransaction } from "@/features/payments/actions";
import { BusinessFormValues } from "@/types/business";
import { AuthResponse } from "@/types/api/auth";
import {
  CurrencyType,
  PaymentMethodDetails,
} from "@/types/business/onboarding";
import { BaseResponse } from "@/types/api";
import { UpdateUserInput } from "@/types/schemas/user";
import { updateUserSchema } from "@/shared/validators/user";
import {
  mapPaymentMethodStringToEnum,
  generateAccountName,
} from "@/shared/utils/paymentGatewayUtils";

const prisma = new PrismaClient();

// Update current user (helper function for onboarding)
async function _updateCurrentUser(
  data: UpdateUserInput
): Promise<AuthResponse> {
  try {
    const session = await _requireAuthentication();

    // Validate the update data
    const validatedData = updateUserSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...validatedData.data,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error updating current user:", error);
    return {
      success: false,
      message: "Failed to update user",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Complete onboarding for current user
export async function _completeOnboarding(): Promise<AuthResponse> {
  try {
    await _requireAuthentication();

    // Update onboarding status
    return await _updateCurrentUser({ onboardingCompleted: true });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return {
      success: false,
      message: "Failed to complete onboarding",
    };
  }
}

// Helper function to update user for onboarding
async function _updateUserForOnboarding(
  userId: string,
  currency: CurrencyType,
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) {
  return await tx.user.update({
    where: { id: userId },
    data: {
      currency,
      onboardingCompleted: true,
      updatedAt: new Date(),
    },
  });
}

// Helper function to create business profile
async function _createBusinessProfile(
  userId: string,
  businessInfo: BusinessFormValues,
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) {
  return await tx.business.create({
    data: {
      userId,
      businessName: businessInfo.businessName,
      businessType: businessInfo.businessType,
      email: businessInfo.email,
      addressLine1: businessInfo.addressLine1,
      addressLine2: businessInfo.addressLine2,
      city: businessInfo.city,
      state: businessInfo.state,
      zipCode: businessInfo.zipCode,
      phone: businessInfo.phone,
    },
  });
}

// Helper function to create payment accounts for onboarding
async function _createPaymentAccountsForOnboarding(
  userId: string,
  paymentMethods: string[],
  paymentMethodDetails: PaymentMethodDetails,
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) {
  const accounts = [];

  for (const method of paymentMethods) {
    const gatewayType = mapPaymentMethodStringToEnum(method);
    if (!gatewayType) {
      console.warn(`Unknown payment method: ${method}`);
      continue;
    }

    let accountData = {};

    // Map payment method details to account data
    switch (method) {
      case "nigerian-bank":
        if (paymentMethodDetails.nigerianBank) {
          accountData = paymentMethodDetails.nigerianBank;
        }
        break;
      case "paypal":
        if (paymentMethodDetails.paypal) {
          accountData = paymentMethodDetails.paypal;
        }
        break;
      case "wise":
        if (paymentMethodDetails.wise) {
          accountData = paymentMethodDetails.wise;
        }
        break;
      case "bank-transfer":
        if (paymentMethodDetails.bankTransfer) {
          accountData = paymentMethodDetails.bankTransfer;
        }
        break;
    }

    if (Object.keys(accountData).length === 0) {
      console.warn(`No data provided for payment method: ${method}`);
      continue;
    }

    const accountName = generateAccountName(gatewayType, accountData);

    // Create payment account using the reusable function
    const account = await _createPaymentAccountInTransaction(
      userId,
      gatewayType,
      accountName,
      accountData,
      true, // isActive
      true, // isDefault (set as default since it's from onboarding)
      tx
    );

    accounts.push(account);
  }

  return accounts;
}

// Complete onboarding with all data
export async function _completeOnboardingWithData(data: {
  currency: CurrencyType;
  businessInfo: BusinessFormValues;
  paymentMethods: string[];
  paymentMethodDetails: PaymentMethodDetails;
}): Promise<BaseResponse> {
  try {
    const session = await _requireAuthentication();
    const userId = session.user.id;

    // Use transaction to ensure all operations succeed or all fail
    await prisma.$transaction(async (tx) => {
      // 1. Update user with currency and completion status
      await _updateUserForOnboarding(userId, data.currency, tx);

      // 2. Create business profile
      await _createBusinessProfile(userId, data.businessInfo, tx);

      // 3. Create payment accounts using reusable logic
      await _createPaymentAccountsForOnboarding(
        userId,
        data.paymentMethods,
        data.paymentMethodDetails,
        tx
      );
    });

    return {
      success: true,
      message: "Onboarding completed successfully",
    };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return {
      success: false,
      message: "Failed to complete onboarding. Please try again.",
    };
  }
}
