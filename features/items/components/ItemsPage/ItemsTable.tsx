import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Item } from "@prisma/client";
import { formatCurrency } from "../../utils";

interface ItemsTableProps {
  items: Item[];
  onRowClick: (item: Item) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ItemsTable = ({
  items,
  onRowClick,
  onEdit,
  onDelete,
}: ItemsTableProps) => {
  return (
    <div className="hidden md:block bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-blue-100 bg-gradient-to-r from-blue-50/30 to-cyan-50/30">
            <TableHead className="font-semibold text-gray-800 text-sm">
              Item Details
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-sm w-32 pr-[30px]">
              Unit Price
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-sm w-24">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: Item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gradient-to-r hover:from-blue-50/20 hover:to-cyan-50/20 cursor-pointer transition-all duration-200 border-b border-blue-50 last:border-b-0"
              onClick={() => onRowClick(item)}
            >
              <TableCell className="py-4">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {item.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4 w-32 pr-[30px]">
                <span className="font-semibold text-blue-600 text-sm">
                  {formatCurrency(item.unitPrice)}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item.id);
                    }}
                    className="border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-all duration-200"
                  >
                    <FiEdit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="border-red-200 hover:border-red-400 hover:bg-red-50 text-red-500 hover:text-red-600 transition-all duration-200"
                  >
                    <FiTrash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
