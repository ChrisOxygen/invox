"use server";

import { Business, PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import {
  createBusinessSchema,
  updateBusinessSchema,
  type CreateBusinessInput,
  type UpdateBusinessInput,
} from "@/dataSchemas/business";

const prisma = new PrismaClient();

// Types
interface BusinessResult {
  success: boolean;
  message: string;
  business?: Business;
}

// Create business for current user
export async function _createBusiness(
  data: CreateBusinessInput
): Promise<BusinessResult> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Validate the input data
    const validatedData = createBusinessSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Check if user already has a business
    const existingBusiness = await prisma.business.findFirst({
      where: { userId: session.user.id },
    });

    if (existingBusiness) {
      return {
        success: false,
        message: "User already has a business",
      };
    }

    // Create business
    const newBusiness = await prisma.business.create({
      data: {
        userId: session.user.id,
        ...validatedData.data,
      },
    });

    return {
      success: true,
      message: "Business created successfully",
      business: newBusiness,
    };
  } catch (error) {
    console.error("Error creating business:", error);
    return {
      success: false,
      message: "Failed to create business",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Update business for current user
export async function _updateBusiness(
  businessId: string,
  data: UpdateBusinessInput
): Promise<BusinessResult> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    if (!businessId) {
      return {
        success: false,
        message: "Business ID is required",
      };
    }

    // Validate the update data
    const validatedData = updateBusinessSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Verify business exists and belongs to current user
    const existingBusiness = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: session.user.id,
      },
    });

    if (!existingBusiness) {
      return {
        success: false,
        message: "Business not found or access denied",
      };
    }

    // Update business
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        ...validatedData.data,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Business updated successfully",
      business: updatedBusiness,
    };
  } catch (error) {
    console.error("Error updating business:", error);
    return {
      success: false,
      message: "Failed to update business",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Get current user's business
export async function _getUserBusiness(): Promise<BusinessResult> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    });

    if (!business) {
      return {
        success: false,
        message: "Business not found",
      };
    }

    return {
      success: true,
      message: "Business retrieved successfully",
      business,
    };
  } catch (error) {
    console.error("Error getting user business:", error);
    return {
      success: false,
      message: "Failed to retrieve business",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Delete current user's business
export async function _deleteBusiness(
  businessId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    if (!businessId) {
      return {
        success: false,
        message: "Business ID is required",
      };
    }

    // Verify business exists and belongs to current user
    const existingBusiness = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: session.user.id,
      },
    });

    if (!existingBusiness) {
      return {
        success: false,
        message: "Business not found or access denied",
      };
    }

    // Delete business
    await prisma.business.delete({
      where: { id: businessId },
    });

    return {
      success: true,
      message: "Business deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting business:", error);
    return {
      success: false,
      message: "Failed to delete business",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Export types
export type { BusinessResult, CreateBusinessInput, UpdateBusinessInput };
