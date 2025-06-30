"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import AppDialog from "@/components/AppDialog";
import { cn } from "@/lib/utils";
import {
  FiEdit2,
  FiEye,
  FiTrash2,
  FiMoreHorizontal,
  FiSearch,
} from "react-icons/fi";
import { useGetInvoices } from "@/features/invoice/hooks";
import { useDeleteInvoice } from "@/features/invoice/hooks";
import { formatCurrency } from "@/utils";
import { InvoiceStatus } from "@prisma/client";
import { InvoiceWithRelations } from "@/types/invoice";

// Status badge color map
const statusColorMap = {
  DRAFT: "bg-gray-200 text-gray-800",
  SENT: "bg-gray-800 text-white",
  PAID: "bg-gray-500 text-white",
  OVERDUE: "bg-gray-900 text-white",
  CANCELLED: "bg-white text-gray-800 border border-gray-800",
};

const sortOptions = [
  { label: "Newest First", value: "created_desc" },
  { label: "Oldest First", value: "created_asc" },
  { label: "Amount: High to Low", value: "amount_desc" },
  { label: "Amount: Low to High", value: "amount_asc" },
  { label: "Due Date: Nearest", value: "due_date_asc" },
  { label: "Client Name: A-Z", value: "client_asc" },
];

const itemsPerPageOptions = [10, 25, 50, 100];

export function InvoiceTable() {
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("created_desc");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceWithRelations | null>(null);

  // Debounce the search input to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Map sort options to API parameters
  const getSortParams = (sortOption: string) => {
    const [field, direction] = sortOption.split("_");
    let sortBy: "invoiceDate" | "paymentDueDate" | "subtotal" | "createdAt" =
      "createdAt";

    switch (field) {
      case "created":
        sortBy = "createdAt";
        break;
      case "due_date":
        sortBy = "paymentDueDate";
        break;
      case "amount":
        sortBy = "subtotal";
        break;
      default:
        sortBy = "createdAt";
    }

    return {
      sortBy,
      sortOrder: direction as "asc" | "desc",
    };
  };

  // Prepare filters for the API
  const filters = {
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    searchQuery: debouncedSearchQuery || undefined, // Search for client name
  };

  // Prepare pagination for the API
  const sortParams = getSortParams(sortOrder);
  const pagination = {
    page: currentPage,
    limit: itemsPerPage,
    sortBy: sortParams.sortBy,
    sortOrder: sortParams.sortOrder,
  };

  // Fetch invoices with filters and pagination
  const { invoices, totalCount, totalPages, isLoading, isError, error } =
    useGetInvoices({ filters, pagination });

  // Delete invoice mutation
  const { mutate: deleteInvoice, isPending: isDeleting } = useDeleteInvoice({
    onSuccess: () => {
      // Show success notification (you can add this later)
    },
    onError: (error) => {
      console.error("Failed to delete invoice:", error);
      // Show error notification (you can add this later)
    },
  });

  // Handle invoice deletion
  const handleDeleteInvoice = (invoice: InvoiceWithRelations) => {
    setSelectedInvoice(invoice);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInvoice) {
      deleteInvoice({ invoiceId: selectedInvoice.id });
      setDeleteModalOpen(false);
      setSelectedInvoice(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedInvoice(null);
  };

  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value: InvoiceStatus | "ALL") =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full md:w-52">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-md border border-gray-200">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Invoice #</TableHead>
                <TableHead className="w-[200px]">Client</TableHead>
                <TableHead className="w-[120px]">Amount</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[120px]">Due Date</TableHead>
                <TableHead className="w-[120px]">Created</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-red-500"
                  >
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No invoices found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <Link
                        href={`/app/invoices/${invoice.id}`}
                        className="font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
                      >
                        {invoice.invoiceNumber ||
                          `INV-${invoice.id.slice(0, 8)}`}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {invoice.client?.BusinessName || "N/A"}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(invoice.subtotal || 0)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          statusColorMap[invoice.status] || statusColorMap.DRAFT
                        )}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.paymentDueDate
                        ? new Date(invoice.paymentDueDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {invoice.createdAt
                        ? new Date(invoice.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-gray-300 hover:border-black hover:bg-gray-50"
                        >
                          <Link href={`/app/invoices/${invoice.id}`}>
                            <FiEye className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-gray-300 hover:border-black hover:bg-gray-50"
                        >
                          <Link href={`/app/invoices/edit/${invoice.id}`}>
                            <FiEdit2 className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInvoice(invoice);
                          }}
                          className="border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-red-500 p-4">
              Error: {error}
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-10 p-4">
              No invoices found. Try adjusting your filters.
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <Link
                        href={`/app/invoices/${invoice.id}`}
                        className="font-medium text-black hover:text-gray-700"
                      >
                        {invoice.invoiceNumber ||
                          `INV-${invoice.id.slice(0, 8)}`}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        {invoice.client?.BusinessName || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={cn(
                            statusColorMap[invoice.status] ||
                              statusColorMap.DRAFT,
                            "text-xs"
                          )}
                        >
                          {invoice.status}
                        </Badge>
                        <span className="text-sm font-medium text-black">
                          {formatCurrency(invoice.subtotal || 0)}
                        </span>
                      </div>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
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
                            asChild
                            className="w-full justify-start hover:bg-gray-100"
                          >
                            <Link href={`/app/invoices/${invoice.id}`}>
                              <FiEye className="mr-2 h-3 w-3" />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="w-full justify-start hover:bg-gray-100"
                          >
                            <Link href={`/app/invoices/edit/${invoice.id}`}>
                              <FiEdit2 className="mr-2 h-3 w-3" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvoice(invoice)}
                            className="w-full justify-start hover:bg-red-50 hover:text-red-600"
                          >
                            <FiTrash2 className="mr-2 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <span>
                      Due:{" "}
                      {invoice.paymentDueDate
                        ? new Date(invoice.paymentDueDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span>
                      Created:{" "}
                      {invoice.createdAt
                        ? new Date(invoice.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination Section */}
      {!isLoading && !isError && invoices.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-gray-500">
            Showing {startItem} to {endItem} of {totalCount} invoices
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
            >
              <SelectTrigger className="w-[100px] h-9">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={cn(
                      currentPage === 1 && "pointer-events-none opacity-50",
                      "cursor-pointer"
                    )}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber, index) => (
                  <PaginationItem key={index}>
                    {pageNumber === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => setCurrentPage(pageNumber as number)}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={cn(
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50",
                      "cursor-pointer"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AppDialog
        open={deleteModalOpen}
        onOpenChange={(open) => !open && handleDeleteCancel()}
        title={`Delete Invoice ${
          selectedInvoice?.invoiceNumber || selectedInvoice?.id.slice(0, 8)
        }?`}
      >
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-600">
              This action cannot be undone. This will permanently delete the
              invoice and remove all associated data from our servers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="h-4 w-4" />
                  Delete Invoice
                </>
              )}
            </Button>
          </div>
        </div>
      </AppDialog>
    </div>
  );
}
