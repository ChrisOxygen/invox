"use server";

import { Item, PrismaClient } from "@prisma/client";
import { _requireAuthentication } from "@/features/auth/actions";
import { ApiResponse, BaseResponse } from "@/types/api";
import {
  createItemSchema,
  updateItemSchema,
  ZCreateItemInput,
  ZUpdateItemInput,
} from "@/features/items/validation/itemSchemas";

const prisma = new PrismaClient();

// Get all items for the current user with pagination
export async function _getItems(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<
  ApiResponse<{
    items: Item[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>
> {
  try {
    const session = await _requireAuthentication();
    // Build where clause for search
    const whereClause: {
      userId: string;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
    } = {
      userId: session.user.id,
    };

    if (search && search.trim()) {
      whereClause.OR = [
        {
          name: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    // Get total count for pagination
    const total = await prisma.item.count({
      where: whereClause,
    });

    // Calculate pagination values
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Get items with pagination
    const items = await prisma.item.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return {
      success: true,
      message: "Items retrieved successfully",
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error retrieving items:", error);
    return {
      success: false,
      message: "Failed to retrieve items",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Create a new item
export async function _createItem(
  data: ZCreateItemInput
): Promise<ApiResponse<Item>> {
  try {
    const session = await _requireAuthentication();

    // Validate the input data
    const validatedData = createItemSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Check if item with same name already exists for this user
    const existingItem = await prisma.item.findFirst({
      where: {
        name: validatedData.data.name,
        userId: session.user.id,
      },
    });

    if (existingItem) {
      return {
        success: false,
        message: "An item with this name already exists",
      };
    } // Create the item
    const item = await prisma.item.create({
      data: {
        name: validatedData.data.name,
        description: validatedData.data.description ?? null,
        unitPrice: validatedData.data.unitPrice ?? null,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      message: "Item created successfully",
      data: item,
    };
  } catch (error) {
    console.error("Error creating item:", error);
    return {
      success: false,
      message: "Failed to create item",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Update an existing item
export async function _updateItem(
  itemId: string,
  data: ZUpdateItemInput
): Promise<ApiResponse<Item>> {
  try {
    const session = await _requireAuthentication();

    // Validate the input data
    const validatedData = updateItemSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: `Validation error: ${validatedData.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Check if item exists and belongs to the user
    const existingItem = await prisma.item.findFirst({
      where: {
        id: itemId,
        userId: session.user.id,
      },
    });

    if (!existingItem) {
      return {
        success: false,
        message: "Item not found or you don't have permission to update it",
      };
    }

    // If name is being updated, check for duplicates
    if (
      validatedData.data.name &&
      validatedData.data.name !== existingItem.name
    ) {
      const duplicateItem = await prisma.item.findFirst({
        where: {
          name: validatedData.data.name,
          userId: session.user.id,
          id: { not: itemId }, // Exclude current item
        },
      });

      if (duplicateItem) {
        return {
          success: false,
          message: "An item with this name already exists",
        };
      }
    } // Update the item
    const updateData: {
      updatedAt: Date;
      name?: string;
      description?: string | null;
      unitPrice?: number | null;
    } = {
      updatedAt: new Date(),
    };

    if (validatedData.data.name !== undefined) {
      updateData.name = validatedData.data.name;
    }
    if (validatedData.data.description !== undefined) {
      updateData.description = validatedData.data.description;
    }
    if (validatedData.data.unitPrice !== undefined) {
      updateData.unitPrice = validatedData.data.unitPrice;
    }

    const item = await prisma.item.update({
      where: { id: itemId },
      data: updateData,
    });

    return {
      success: true,
      message: "Item updated successfully",
      data: item,
    };
  } catch (error) {
    console.error("Error updating item:", error);
    return {
      success: false,
      message: "Failed to update item",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Delete an item
export async function _deleteItem(itemId: string): Promise<BaseResponse> {
  try {
    const session = await _requireAuthentication();

    // Check if item exists and belongs to the user
    const existingItem = await prisma.item.findFirst({
      where: {
        id: itemId,
        userId: session.user.id,
      },
    });

    if (!existingItem) {
      return {
        success: false,
        message: "Item not found or you don't have permission to delete it",
      };
    }

    // Delete the item
    await prisma.item.delete({
      where: { id: itemId },
    });

    return {
      success: true,
      message: "Item deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting item:", error);
    return {
      success: false,
      message: "Failed to delete item",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Get a single item by ID
export async function _getItem(itemId: string): Promise<ApiResponse<Item>> {
  try {
    const session = await _requireAuthentication();

    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        userId: session.user.id,
      },
    });

    if (!item) {
      return {
        success: false,
        message: "Item not found",
      };
    }

    return {
      success: true,
      message: "Item retrieved successfully",
      data: item,
    };
  } catch (error) {
    console.error("Error retrieving item:", error);
    return {
      success: false,
      message: "Failed to retrieve item",
    };
  } finally {
    await prisma.$disconnect();
  }
}
