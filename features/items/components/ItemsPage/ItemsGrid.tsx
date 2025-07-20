import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { Item } from "@prisma/client";
import { formatCurrency } from "../../utils";

interface ItemsGridProps {
  items: Item[];
  onRowClick: (item: Item) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ItemsGrid = ({
  items,
  onRowClick,
  onEdit,
  onDelete,
}: ItemsGridProps) => {
  return (
    <div className="md:hidden space-y-4">
      {items.map((item: Item) => (
        <div
          key={item.id}
          className="bg-white border border-blue-100 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/20 hover:to-cyan-50/20 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => onRowClick(item)}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-3 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-all duration-200"
                >
                  <FiMoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-40 p-2 border-blue-100">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item.id);
                    }}
                    className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 text-xs"
                  >
                    <FiEdit2 className="mr-2 h-3 w-3" />
                    Edit Item
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="w-full justify-start hover:bg-red-50 hover:text-red-600 text-xs"
                  >
                    <FiTrash2 className="mr-2 h-3 w-3" />
                    Delete Item
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-blue-100">
            <span className="text-xs text-gray-600 font-medium">
              Unit Price:
            </span>
            <span className="font-semibold text-blue-600 text-sm">
              {formatCurrency(item.unitPrice)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
