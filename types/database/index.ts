import { Prisma } from "@prisma/client";

// Utility types for Prisma model extensions
export type UserWithBusiness = Prisma.UserGetPayload<{
  include: { business: true };
}>;

export type UserWithPaymentAccounts = Prisma.UserGetPayload<{
  include: { paymentAccounts: true };
}>;

export type InvoiceWithItems = Prisma.InvoiceGetPayload<{
  include: { items: true; client: true };
}>;

// Database model utilities
export interface ModelTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDelete {
  deletedAt?: Date | null;
}

export interface BaseModel extends ModelTimestamps {
  id: string;
}

export interface AuditableModel extends BaseModel {
  createdBy?: string;
  updatedBy?: string;
}
