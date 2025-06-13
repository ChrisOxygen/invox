// Invoice item related types
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  invoiceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItemsFormData {
  items: InvoiceItemFormData[];
}

export interface InvoiceItemFormData {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface InvoiceItemSelectProps {
  value?: string;
  onChange: (description: string) => void;
  placeholder?: string;
}

export interface InvoiceItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (description: string) => void;
  mode: "create";
  initialData?: {
    description: string;
  };
}

export interface InvoiceItemsFormProps {
  value: InvoiceItemFormData[];
  onChange: (items: InvoiceItemFormData[]) => void;
  disabled?: boolean;
  className?: string;
  currency?: string;
}
