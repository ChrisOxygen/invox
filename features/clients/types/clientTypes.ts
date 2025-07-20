import { Client } from "@prisma/client";

// Re-export Prisma types
export type { Client } from "@prisma/client";

// Dialog state types
export type DialogStateType = "form" | "delete" | null;
export type FormMode = "create" | "edit";

// Component prop types
export interface ClientActionsProps {
  client: Client;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export interface ClientsPageProps {
  clients: Client[];
  loading?: boolean;
  error?: string | null;
}

// Dialog related types
export interface DialogState {
  dialogState: DialogStateType;
  formMode: FormMode;
  selectedClient: Client | null;
}

// Pagination types
export interface PaginationInfo {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Search and filter types
export interface ClientsFilters {
  searchTerm: string;
  currentPage: number;
}

// API response types
export interface ClientsResponse {
  clients: Client[];
  pagination: PaginationInfo;
}
