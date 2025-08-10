import { Invoice, Client, Business } from "@prisma/client";

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
