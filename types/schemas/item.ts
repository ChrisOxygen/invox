// Item types based on the simplified Item model
export interface Item {
  id: string;
  name: string;
  description: string | null;
  unitPrice: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Input types for creating and updating items
export interface CreateItemInput {
  name: string;
  description?: string | null;
  unitPrice?: number | null;
}

export interface UpdateItemInput {
  name?: string;
  description?: string | null;
  unitPrice?: number | null;
}

// Form data types for React Hook Form
export interface ItemFormData {
  name: string;
  description: string;
  unitPrice: string; // String for form input, converted to number in validation
}

// API response types
export interface ItemsResponse {
  success: boolean;
  message: string;
  items?: Item[];
}

export interface ItemResponse {
  success: boolean;
  message: string;
  item?: Item;
}
