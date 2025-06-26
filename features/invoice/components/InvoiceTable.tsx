"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  FiEdit2,
  FiEye,
  FiTrash2,
  FiMoreVertical,
  FiSearch,
} from "react-icons/fi";
import { useGetInvoices } from "@/features/invoice/hooks";
import { useDeleteInvoice } from "@/features/invoice/hooks";
import { formatCurrency } from "@/utils";
import { InvoiceStatus } from "@prisma/client";

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
  const router = useRouter();

  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("created_desc");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice({ invoiceId });
    }
  };

  // Handle edit invoice
  const handleEditInvoice = (invoiceId: string) => {
    router.push(`/app/invoices/edit/${invoiceId}`);
  };

  // Handle view invoice
  const handleViewInvoice = (invoiceId: string) => {
    router.push(`/app/invoices/view/${invoiceId}`);
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
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
                      onClick={() => handleViewInvoice(invoice.id)}
                    >
                      {invoice.invoiceNumber || `INV-${invoice.id.slice(0, 8)}`}
                    </Button>
                  </TableCell>
                  <TableCell>{invoice.client?.BusinessName || "N/A"}</TableCell>
                  <TableCell>{formatCurrency(invoice.subtotal || 0)}</TableCell>
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
                    {/* Desktop Actions */}
                    <div className="hidden md:flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewInvoice(invoice.id)}
                        className="h-8 w-8 text-gray-500 hover:text-gray-900 cursor-pointer"
                      >
                        <FiEye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditInvoice(invoice.id)}
                        className="h-8 w-8 text-gray-500 hover:text-gray-900 cursor-pointer"
                      >
                        <FiEdit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="h-8 w-8 text-gray-500 hover:text-gray-900 cursor-pointer"
                        disabled={isDeleting}
                      >
                        <FiTrash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>

                    {/* Mobile Actions */}
                    <div className="md:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <FiMoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewInvoice(invoice.id)}
                          >
                            <FiEye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditInvoice(invoice.id)}
                          >
                            <FiEdit2 className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            disabled={isDeleting}
                            className="text-red-600"
                          >
                            <FiTrash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
    </div>
  );
}
