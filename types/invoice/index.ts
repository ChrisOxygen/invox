import { Invoice, InvoiceStatus, Client, Business } from "@prisma/client";

// Invoice with related data
export interface InvoiceWithRelations extends Invoice {
  client: Client;
  business: Business;
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
