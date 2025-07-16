"use client";

import React, { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import AppDialog from "@/components/AppDialog";
import { Button } from "@/components/ui/button";
import { FiTrash2 } from "react-icons/fi";
import { useGetInvoices } from "@/features/invoice/hooks";
import { useDeleteInvoice } from "@/features/invoice/hooks";
import { InvoiceStatus } from "@prisma/client";
import { InvoiceWithRelations } from "@/types/invoice";

// Import the new separated components
import { InvoiceSearch } from "./InvoiceSearch";
import { InvoiceFilters } from "./InvoiceFilters";
import { InvoiceDataTable } from "./InvoiceDataTable";
import { InvoicePagination } from "./InvoicePagination";

interface InvoiceTableProps {
  showSearch?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  showActions?: boolean;
  showFavorites?: boolean;
  initialItemsPerPage?: number;
  className?: string;
}

export function InvoiceTable({
  showSearch = true,
  showFilters = true,
  showPagination = true,
  showActions = true,
  showFavorites = true,
  initialItemsPerPage = 10,
  className = "space-y-4",
}: InvoiceTableProps) {
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("created_desc");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

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

  return (
    <div className={className}>
      {/* Search and Filters Section */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {showSearch && (
            <InvoiceSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search invoices..."
            />
          )}

          {showFilters && (
            <InvoiceFilters
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
          )}
        </div>
      )}

      {/* Data Table */}
      <InvoiceDataTable
        invoices={invoices}
        isLoading={isLoading}
        isError={isError}
        error={error || undefined}
        onDeleteInvoice={showActions ? handleDeleteInvoice : undefined}
        showActions={showActions}
        showFavorites={showFavorites}
      />

      {/* Pagination Section */}
      {showPagination && !isLoading && !isError && invoices.length > 0 && (
        <InvoicePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showActions && (
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
      )}
    </div>
  );
}
