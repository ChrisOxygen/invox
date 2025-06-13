"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { ApiResponse } from "@/types/api";
import { UserWithBusiness } from "@/types/database";

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
    } // Get user with business
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
