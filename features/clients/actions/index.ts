"use server";

import { Client, PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

import { ApiResponse, BaseResponse } from "@/types/api";
import { CreateClientRequest, UpdateClientRequest } from "@/types/api/client";
import {
  createClientSchema,
  updateClientSchema,
  clientIdSchema,
} from "@/dataSchemas/client";

const prisma = new PrismaClient();

// CREATE - Add new client
export async function _createClient(
  data: CreateClientRequest
): Promise<ApiResponse<Client>> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Validate data using Zod schema
    const validationResult = createClientSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.errors.map((e) => e.message).join(", "),
      };
    }

    // Check if client with same email already exists for this user
    const existingClient = await prisma.client.findFirst({
      where: {
        email: data.email,
        userId: session.user.id,
      },
    });

    if (existingClient) {
      return {
        success: false,
        message: "A client with this email already exists",
      };
    }

    // Create new client
    const client = await prisma.client.create({
      data: {
        BusinessName: data.BusinessName,
        contactPersonName: data.contactPersonName,
        address: data.address,
        email: data.email,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      message: "Client created successfully",
      data: client,
    };
  } catch (error) {
    console.error("Error creating client:", error);
    return {
      success: false,
      message: "Failed to create client",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// READ - Get all clients for current user
export async function _getClients(): Promise<ApiResponse<Client[]>> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const clients = await prisma.client.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        BusinessName: "asc",
      },
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Clients retrieved successfully",
      data: clients,
    };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return {
      success: false,
      message: "Failed to fetch clients",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// READ - Get single client by ID
export async function _getClientById(
  clientId: string
): Promise<ApiResponse<Client>> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Validate clientId using Zod schema
    const validationResult = clientIdSchema.safeParse(clientId);
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.errors.map((e) => e.message).join(", "),
      };
    }

    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: session.user.id,
      },
    });

    if (!client) {
      return {
        success: false,
        message: "Client not found",
      };
    }

    return {
      success: true,
      message: "Client retrieved successfully",
      data: client,
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    return {
      success: false,
      message: "Failed to fetch client",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// UPDATE - Update existing client
export async function _updateClient(
  data: UpdateClientRequest
): Promise<ApiResponse<Client>> {
  const { clientId, ...clientData } = data;
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Validate clientId using Zod schema
    const clientIdValidation = clientIdSchema.safeParse(clientId);
    if (!clientIdValidation.success) {
      return {
        success: false,
        message: clientIdValidation.error.errors
          .map((e) => e.message)
          .join(", "),
      };
    }

    // Validate update data using Zod schema
    const updateDataValidation = updateClientSchema.safeParse(clientData);
    if (!updateDataValidation.success) {
      return {
        success: false,
        message: updateDataValidation.error.errors
          .map((e) => e.message)
          .join(", "),
      };
    }

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: session.user.id,
      },
    });

    if (!existingClient) {
      return {
        success: false,
        message: "Client not found",
      };
    }

    // If email is being updated, check for duplicates
    if (clientData.email && clientData.email !== existingClient.email) {
      const duplicateClient = await prisma.client.findFirst({
        where: {
          email: clientData.email,
          userId: session.user.id,
          id: {
            not: clientId,
          },
        },
      });

      if (duplicateClient) {
        return {
          success: false,
          message: "A client with this email already exists",
        };
      }
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: {
        id: clientId,
      },
      data: {
        ...clientData,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    };
  } catch (error) {
    console.error("Error updating client:", error);
    return {
      success: false,
      message: "Failed to update client",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete client
export async function _deleteClient(clientId: string): Promise<BaseResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Validate clientId using Zod schema
    const clientIdValidation = clientIdSchema.safeParse(clientId);
    if (!clientIdValidation.success) {
      return {
        success: false,
        message: clientIdValidation.error.errors
          .map((e) => e.message)
          .join(", "),
      };
    }

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });

    if (!existingClient) {
      return {
        success: false,
        message: "Client not found",
      };
    }

    // Check if client has associated invoices
    if (existingClient._count.invoices > 0) {
      return {
        success: false,
        message: `Cannot delete client. This client has ${existingClient._count.invoices} associated invoice(s). Please delete or reassign the invoices first.`,
      };
    }

    // Delete client
    await prisma.client.delete({
      where: {
        id: clientId,
      },
    });

    return {
      success: true,
      message: "Client deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting client:", error);
    return {
      success: false,
      message: "Failed to delete client",
    };
  } finally {
    await prisma.$disconnect();
  }
}
