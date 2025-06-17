"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { changePasswordSchema, updateUserSchema } from "@/dataSchemas";
import { auth } from "@/auth";
import { BusinessFormValues } from "@/types/business";
import { AuthResponse, SignupRequest } from "@/types/api/auth";
import { UpdateUserInput } from "@/types/schemas/user";
import {
  CurrencyType,
  PaymentMethodDetails,
} from "@/types/business/onboarding";
import { BaseResponse } from "@/types/api";

const prisma = new PrismaClient();

// Create user with credentials (registration)
export async function _createUserWithCredentials(
  values: SignupRequest
): Promise<BaseResponse> {
  try {
    // Validate the input data using SignupRequest structure
    if (!values.email || !values.password || !values.name) {
      return {
        success: false,
        message: "Invalid form data. Please check your inputs.",
      };
    }

    const { name, email, password } = values;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        onboardingCompleted: false,
      },
    });

    return {
      success: true,
      message: "Account created successfully!",
    };
  } catch (error) {
    console.error("Error creating user with credentials:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Get user from session
export async function _getUser(): Promise<AuthResponse> {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated.",
      };
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    return {
      success: true,
      message: "User retrieved successfully!",
      user,
    };
  } catch (error) {
    console.error("Error retrieving user:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Update current user
export async function _updateCurrentUser(
  data: UpdateUserInput
): Promise<AuthResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

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
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

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

// Change password for current user
export async function _changePassword(
  currentPassword: string,
  newPassword: string
): Promise<BasicResponse> {
  try {
    // Validate passwords
    const validatedData = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword: newPassword,
    });

    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        hashedPassword: true,
      },
    });

    if (!user || !user.hashedPassword) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect",
      };
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        hashedPassword: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      message: "Failed to change password",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Complete onboarding with all data
export async function _completeOnboardingWithData(data: {
  currency: CurrencyType;
  businessInfo: BusinessFormValues;
  paymentMethods: string[];
  paymentMethodDetails: PaymentMethodDetails;
}): Promise<BasicResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

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
