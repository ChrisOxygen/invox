import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClientsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const ClientsSearch = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search clients...",
}: ClientsSearchProps) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
      />
    </div>
  );
};
