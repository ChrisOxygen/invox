import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface UseItemsSearchOptions {
  debounceMs?: number;
}

export const useItemsSearch = (options: UseItemsSearchOptions = {}) => {
  const { debounceMs = 300 } = options;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    currentPage,
    setCurrentPage,
    handleSearch,
  };
};
