import { Item } from "@prisma/client";

// Re-export Prisma types
export type { Item } from "@prisma/client";

// Dialog state types
export type DialogStateType = "preview" | "form" | "delete" | null;
export type FormMode = "create" | "edit";

// Component prop types
export interface ItemActionsProps {
  item: Item;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRowClick: (item: Item) => void;
}

export interface ItemsPageProps {
  items: Item[];
  loading?: boolean;
  error?: string | null;
}

// Dialog related types
export interface DialogState {
  dialogState: DialogStateType;
  formMode: FormMode;
  selectedItem: Item | null;
}

// Pagination types
export interface PaginationInfo {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Search and filter types
export interface ItemsFilters {
  searchTerm: string;
  currentPage: number;
}

// API response types
export interface ItemsResponse {
  items: Item[];
  pagination: PaginationInfo;
}
