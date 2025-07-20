import { Button } from "@/components/ui/button";
import { FiPlus, FiPackage } from "react-icons/fi";

interface ItemsEmptyStateProps {
  hasSearchTerm: boolean;
  searchTerm: string;
  onAddItem: () => void;
}

export const ItemsEmptyState = ({
  hasSearchTerm,
  searchTerm,
  onAddItem,
}: ItemsEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-full flex items-center justify-center">
        <FiPackage className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {hasSearchTerm ? "No items found" : "No items yet"}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {hasSearchTerm
          ? `No items match "${searchTerm}". Try adjusting your search terms.`
          : "Get started by adding your first inventory item to track products and services."}
      </p>
      {!hasSearchTerm && (
        <Button
          onClick={onAddItem}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white font-semibold px-6 py-3 h-auto transition-all duration-300 group rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105"
        >
          <FiPlus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
          Add Your First Item
        </Button>
      )}
    </div>
  );
};
