// Export all item-related hooks
export { useGetItems, useGetItem } from "./useGetItems";
export { useCreateItem } from "./useCreateItem";
export { useUpdateItem } from "./useUpdateItem";
export { useDeleteItem } from "./useDeleteItem";
export { useOptimisticUpdateItem } from "./useOptimisticUpdateItem";

// Export query keys for advanced usage
export { ITEMS_QUERY_KEYS } from "./queryKeys";

// Re-export types for convenience
export type {
  Item,
  CreateItemInput,
  UpdateItemInput,
  ItemFormData,
  ItemsResponse,
  ItemResponse,
} from "@/types/schemas/item";
