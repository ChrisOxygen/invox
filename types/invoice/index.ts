import { Invoice, InvoiceStatus, Client, Business } from "@prisma/client";

// Raw invoice item type (from JSON storage)
export interface RawInvoiceItem {
  description?: string;
  quantity?: number;
  unitPrice?: number;
  total?: number;
}

// Invoice with related data (extends Prisma's Invoice but overrides invoiceItems type)
export interface InvoiceWithRelations extends Omit<Invoice, "invoiceItems"> {
  client: Client;
  business: Business;
  invoiceItems?: RawInvoiceItem[]; // Override the JsonValue type
  discount: number; // Ensure discount is included
}

// Invoice item type (for form handling)
export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Create invoice input
export interface CreateInvoiceInput {
  clientId: string;
  invoiceNumber?: string; // Optional, can be auto-generated
  invoiceDate: Date;
  paymentDueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxes: number;
  discount?: number;
  total: number;
  acceptedPaymentMethods: string;
  isFavorite?: boolean;
  customNote?: string;
  lateFeeText?: string;
}

// Update invoice input
export interface UpdateInvoiceInput {
  invoiceId: string;
  clientId?: string;
  invoiceDate?: Date;
  paymentDueDate?: Date;
  items?: InvoiceItem[];
  subtotal?: number;
  taxes?: number;
  discount?: number;
  total?: number;
  acceptedPaymentMethods?: string;
  isFavorite?: boolean;
  customNote?: string;
  lateFeeText?: string;
}

// Invoice status update input
export interface UpdateInvoiceStatusInput {
  invoiceId: string;
  status: InvoiceStatus;
}

// Invoice filters for listing
export interface InvoiceFilters {
  status?: InvoiceStatus;
  clientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  searchQuery?: string; // For searching client name or invoice number
}

// Pagination
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: "invoiceDate" | "paymentDueDate" | "subtotal" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Invoice list response
export interface InvoiceListResponse {
  invoices: InvoiceWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Invoice statistics
export interface InvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
}
