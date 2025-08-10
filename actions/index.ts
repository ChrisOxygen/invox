"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  changePasswordSchema,
  updateUserSchema,
} from "@/shared/validators/user";
import { _requireAuthentication } from "@/features/auth/actions";
import { AuthResponse, SignupRequest } from "@/types/api/auth";
import { UpdateUserInput } from "@/types/schemas/user";
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
    const session = await _requireAuthentication();

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

// Change password for current user
export async function _changePassword(
  currentPassword: string,
  newPassword: string
): Promise<BaseResponse> {
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

    const session = await _requireAuthentication();

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
