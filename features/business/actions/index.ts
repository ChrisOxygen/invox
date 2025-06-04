"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface GetBusinessResult {
  success: boolean;
  hasBusiness: boolean;
  message: string;
  business?: {
    id: string;
    businessName: string;
    address: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

interface CreateBusinessResult {
  success: boolean;
  message: string;
  business?: {
    id: string;
    businessName: string;
    address: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export async function getUserBusiness(
  userId: string
): Promise<GetBusinessResult> {
  try {
    if (!userId) {
      return {
        success: false,
        hasBusiness: false,
        message: "User ID is required",
        business: null,
      };
    }

    const business = await prisma.business.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        businessName: true,
        address: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (business) {
      return {
        success: true,
        hasBusiness: true,
        message: "User has a business",
        business,
      };
    }

    return {
      success: true,
      hasBusiness: false,
      message: "User does not have a business",
      business: null,
    };
  } catch (error) {
    console.error("Error checking user business:", error);
    return {
      success: false,
      hasBusiness: false,
      message: "Failed to check user business",
      business: null,
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function createBusiness(
  userId: string,
  businessName: string,
  address: string,
  email: string
): Promise<CreateBusinessResult> {
  try {
    if (!userId || !businessName || !address || !email) {
      return {
        success: false,
        message: "All fields are required",
        business: null,
      };
    }

    // Check if user already has a business
    const existingBusiness = await prisma.business.findFirst({
      where: { userId },
    });

    if (existingBusiness) {
      return {
        success: false,
        message: "User already has a business",
        business: null,
      };
    }

    const newBusiness = await prisma.business.create({
      data: {
        userId,
        businessName,
        address,
        email,
      },
      select: {
        id: true,
        businessName: true,
        address: true,
        email: true,
        createdAt: true,
        updatedAt: true,
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
      business: null,
    };
  } finally {
    await prisma.$disconnect();
  }
}
