"use server";

import { PrismaClient, Business } from "@prisma/client";
import { _requireAuthentication } from "@/features/auth/actions";
import {
  createBusinessApiSchema,
  updateBusinessApiSchema,
} from "@/shared/validators/business";
import { CreateBusinessRequest } from "@/types/api/business";
import { ApiResponse, BaseResponse } from "@/types/api";
import { UpdateBusinessApiInput } from "@/types";

const prisma = new PrismaClient();

// Create business for current user
export async function _createBusiness(
  data: CreateBusinessRequest
): Promise<ApiResponse<Business>> {
  try {
    const session = await _requireAuthentication();

    // Validate the input data
    const validatedData = createBusinessApiSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
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
      data: newBusiness,
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
  data: UpdateBusinessApiInput
): Promise<ApiResponse<Business>> {
  try {
    const session = await _requireAuthentication();

    if (!businessId) {
      return {
        success: false,
        message: "Business ID is required",
      };
    }

    // Validate the update data
    const validatedData = updateBusinessApiSchema.safeParse(data);
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
      data: updatedBusiness,
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
export async function _getUserBusiness(): Promise<ApiResponse<Business>> {
  try {
    const session = await _requireAuthentication();

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
      data: business,
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
): Promise<BaseResponse> {
  try {
    const session = await _requireAuthentication();

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
