"use server";

import { PrismaClient } from "@prisma/client";
import { _requireAuthentication } from "@/features/auth/actions";
import { BusinessFormValues } from "@/types/business";
import { AuthResponse } from "@/types/api/auth";
import {
  CurrencyType,
  PaymentMethodDetails,
} from "@/types/business/onboarding";
import { BaseResponse } from "@/types/api";
import { UpdateUserInput } from "@/types/schemas/user";
import { updateUserSchema } from "@/shared/validators/user";

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
      // 1. Update user with currency and completion status (remove country)
      await tx.user.update({
        where: { id: userId },
        data: {
          currency: data.currency,
          onboardingCompleted: true,
          updatedAt: new Date(),
        },
      });

      // 2. Create business profile
      await tx.business.create({
        data: {
          userId: userId,
          businessName: data.businessInfo.businessName,
          businessType: data.businessInfo.businessType,
          email: data.businessInfo.email,
          addressLine1: data.businessInfo.addressLine1,
          addressLine2: data.businessInfo.addressLine2,
          city: data.businessInfo.city,
          state: data.businessInfo.state,
          zipCode: data.businessInfo.zipCode,
          phone: data.businessInfo.phone,
        },
      });

      // 3. Create payment accounts (unchanged)
      for (const method of data.paymentMethods) {
        let accountData = {};
        let accountName = "";

        // Map payment method details to account data
        switch (method) {
          case "nigerian-bank":
            if (data.paymentMethodDetails.nigerianBank) {
              accountData = data.paymentMethodDetails.nigerianBank;
              accountName = `${data.paymentMethodDetails.nigerianBank.bankName} - ${data.paymentMethodDetails.nigerianBank.accountName}`;
            }
            break;
          case "paypal":
            if (data.paymentMethodDetails.paypal) {
              accountData = data.paymentMethodDetails.paypal;
              accountName = `PayPal - ${data.paymentMethodDetails.paypal.email}`;
            }
            break;
          case "wise":
            if (data.paymentMethodDetails.wise) {
              accountData = data.paymentMethodDetails.wise;
              accountName = `Wise - ${data.paymentMethodDetails.wise.email}`;
            }
            break;
          case "bank-transfer":
            if (data.paymentMethodDetails.bankTransfer) {
              accountData = data.paymentMethodDetails.bankTransfer;
              accountName = `${data.paymentMethodDetails.bankTransfer.bankName} - ${data.paymentMethodDetails.bankTransfer.accountHolderName}`;
            }
            break;
        }

        // Create payment account (set as default since it's from onboarding)
        await tx.paymentAccount.create({
          data: {
            userId: userId,
            gatewayType: method,
            accountName: accountName,
            accountData: accountData,
            isActive: true,
            isDefault: true, // Set as default since it's from onboarding
          },
        });
      }
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
  } finally {
    await prisma.$disconnect();
  }
}
