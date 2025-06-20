"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMoreHorizontal,
} from "react-icons/fi";
import { useGetItems } from "@/features/items/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { Item } from "@prisma/client";
import {
  ItemForm,
  ItemPreviewDialog,
  DeleteConfirmationDialog,
} from "@/features/items/components";

const ITEMS_PER_PAGE = 10;

type DialogState = "preview" | "form" | "delete" | null;
type FormMode = "create" | "edit";

function ItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);
  // Fetch items using the updated hook with pagination
  const {
    items,
    pagination,
    isPending: gettingItems,
    isError,
    error,
  } = useGetItems({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchTerm,
  });
  // Handle search input changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // The useDebounce hook and useEffect will handle the rest
  };
  // Dialog handlers
  const handleAddItem = () => {
    setSelectedItem(null);
    setFormMode("create");
    setDialogState("form");
  };

  const handleEditItem = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      setSelectedItem(item);
      setFormMode("edit");
      setDialogState("form");
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      setSelectedItem(item);
      setDialogState("delete");
    }
  };

  const handleRowClick = (item: Item) => {
    setSelectedItem(item);
    setDialogState("preview");
  };

  const handleSaveItem = (item: Item) => {
    console.log("Item saved:", item);
    // The hooks handle the actual saving and updating the cache
    setDialogState(null);
    setSelectedItem(null);
  };

  const handleDeleteConfirm = () => {
    // The DeleteConfirmationDialog handles the actual deletion
    setDialogState(null);
    setSelectedItem(null);
  };

  const handleDialogClose = () => {
    setDialogState(null);
    setSelectedItem(null);
  };

  const handleEditFromPreview = (item: Item) => {
    setSelectedItem(item);
    setFormMode("edit");
    setDialogState("form");
  };

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = pagination.totalPages;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSide = Math.max(1, currentPage - 2);
      const rightSide = Math.min(totalPages, currentPage + 2);

      if (leftSide > 1) {
        pages.push(1);
        if (leftSide > 2) pages.push("ellipsis-left");
      }

      for (let i = leftSide; i <= rightSide; i++) {
        pages.push(i);
      }

      if (rightSide < totalPages) {
        if (rightSide < totalPages - 1) pages.push("ellipsis-right");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full h-full rounded p-6 bg-white flex flex-col space-y-6">
      {" "}
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">All Items</h1>
        <Button
          onClick={handleAddItem}
          className="bg-black text-white hover:bg-gray-800 transition-colors duration-200"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>{" "}
      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search items by name or description..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 border-gray-300 focus:border-black focus:ring-black"
        />
        {gettingItems && debouncedSearchTerm && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex-1 flex flex-col">
        {isError ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading items</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          </div>
        ) : gettingItems ? (
          <div className="space-y-4">
            <div className="border rounded-lg">
              <div className="border-b p-4">
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border-b last:border-b-0">
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiSearch className="h-8 w-8 text-gray-400" />
              </div>{" "}
              <h3 className="text-lg font-medium text-black mb-2">
                {debouncedSearchTerm ? "No items found" : "No items yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {debouncedSearchTerm
                  ? `No items match "${debouncedSearchTerm}"`
                  : "Get started by adding your first item"}
              </p>
              {!debouncedSearchTerm && (
                <Button
                  onClick={handleAddItem}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Your First Item
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-black">
                      Item Name
                    </TableHead>
                    <TableHead className="font-semibold text-black">
                      Unit Price
                    </TableHead>
                    <TableHead className="font-semibold text-black w-20">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>{" "}
                <TableBody>
                  {items.map((item: Item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(item)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-black">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditItem(item.id);
                            }}
                            className="border-gray-300 hover:border-black hover:bg-gray-50"
                          >
                            <FiEdit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id);
                            }}
                            className="border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <FiTrash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>{" "}
            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {items.map((item: Item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleRowClick(item)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-black">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">
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
                          className="border-gray-300 hover:border-black"
                        >
                          <FiMoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-40 p-2">
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditItem(item.id);
                            }}
                            className="w-full justify-start hover:bg-gray-100"
                          >
                            <FiEdit2 className="mr-2 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id);
                            }}
                            className="w-full justify-start hover:bg-red-50 hover:text-red-600"
                          >
                            <FiTrash2 className="mr-2 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Unit Price:</span>
                    <span className="font-medium text-black">
                      {formatCurrency(item.unitPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>{" "}
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-gray-100"
                        }
                      />
                    </PaginationItem>

                    {generatePaginationNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {typeof page === "number" ? (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                            className={
                              currentPage === page
                                ? "bg-black text-white hover:bg-gray-800"
                                : "hover:bg-gray-100"
                            }
                          >
                            {page}
                          </PaginationLink>
                        ) : (
                          <PaginationEllipsis />
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < pagination.totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
                        className={
                          currentPage === pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-gray-100"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}{" "}
          </>
        )}
      </div>
      {/* Dialogs */}
      <ItemPreviewDialog
        open={dialogState === "preview"}
        onOpenChange={handleDialogClose}
        item={selectedItem}
        onEdit={handleEditFromPreview}
      />
      <ItemForm
        open={dialogState === "form"}
        onOpenChange={handleDialogClose}
        item={selectedItem}
        mode={formMode}
        onSuccess={handleSaveItem}
      />
      <DeleteConfirmationDialog
        open={dialogState === "delete"}
        onOpenChange={handleDialogClose}
        item={selectedItem}
        onSuccess={handleDeleteConfirm}
      />
    </div>
  );
}

export default ItemsPage;
