import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";

interface ItemsSearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  isLoading?: boolean;
  debouncedSearchTerm?: string;
}

export const ItemsSearch = ({
  searchTerm,
  onSearch,
  isLoading = false,
  debouncedSearchTerm,
}: ItemsSearchProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50/30 to-cyan-50/30 border border-blue-100 rounded-xl p-4 sm:p-6">
      <div className="relative max-w-md mx-auto w-full">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
        <Input
          placeholder="Search items by name or description..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200 bg-white/70 placeholder:text-gray-500 h-11 sm:h-12 text-sm sm:text-base"
        />
        {isLoading && debouncedSearchTerm && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};
