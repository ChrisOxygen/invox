// Types for the many-to-many invoice item relationship

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
  sentCount: number;
  paidCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceLineItem {
  id: string;
  quantity: number;
  unitPrice: number; // Price at time of invoice creation
  totalAmount: number;
  invoiceId: string;
  invoiceItemId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItemWithStats extends InvoiceItem {
  stats: {
    totalInvoices: number;
    sentInvoices: number;
    paidInvoices: number;
    draftInvoices: number;
    overdueInvoices: number;
    totalRevenue: number;
    clients: string[];
  };
  lineItems?: InvoiceLineItemWithInvoice[];
}

export interface InvoiceLineItemWithInvoice extends InvoiceLineItem {
  invoice: {
    id: string;
    invoiceNumber: string;
    status: string;
    invoiceDate: Date;
    client: {
      BusinessName: string;
    };
  };
}

export interface InvoiceWithLineItems {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  paymentDueDate: Date;
  subtotal: number;
  taxes: number;
  finalTotal: number;
  status: string;
  lineItems: (InvoiceLineItem & {
    invoiceItem: InvoiceItem;
  })[];
  client: {
    id: string;
    BusinessName: string;
    email: string;
  };
  business: {
    id: string;
    businessName: string;
    email: string;
  };
}

export interface CreateInvoiceItemInput {
  name: string;
  description?: string;
  unitPrice: number;
}

export interface AddItemToInvoiceInput {
  invoiceId: string;
  invoiceItemId: string;
  quantity: number;
  unitPrice?: number; // Optional price override
}

export interface UpdateLineItemQuantityInput {
  invoiceId: string;
  invoiceItemId: string;
  quantity: number;
}

// Enum for invoice status
export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

// Form data for invoice items
export interface InvoiceItemFormData {
  id?: string;
  name: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
}

// Data for creating an invoice with line items
export interface CreateInvoiceWithItemsInput {
  invoiceNumber: string;
  invoiceDate: Date;
  paymentDueDate: Date;
  clientId: string;
  businessId: string;
  userId: string;
  paymentTerms: string;
  acceptedPaymentMethods: string;
  lineItems: {
    invoiceItemId: string;
    quantity: number;
    unitPrice?: number; // Optional price override
  }[];
}
