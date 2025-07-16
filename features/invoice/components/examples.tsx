// Example usage of the modular invoice components

import React, { useState } from "react";
import {
  InvoiceDataTable,
  InvoiceSearch,
  InvoiceFilters,
  InvoicePagination,
} from "./index";

// Example 1: Just the table without any controls
export function SimpleInvoiceTable({ invoices, isLoading, isError, error }) {
  return (
    <InvoiceDataTable
      invoices={invoices}
      isLoading={isLoading}
      isError={isError}
      error={error}
      showActions={false}
      showFavorites={false}
    />
  );
}

// Example 2: Table with only search
export function SearchableInvoiceTable({
  invoices,
  isLoading,
  isError,
  error,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <InvoiceSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search invoices..."
      />
      <InvoiceDataTable
        invoices={invoices}
        isLoading={isLoading}
        isError={isError}
        error={error}
        showActions={true}
        showFavorites={true}
      />
    </div>
  );
}

// Example 3: Custom layout with all components
export function CustomInvoiceTable({
  invoices,
  isLoading,
  isError,
  error,
  totalCount,
  totalPages,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("created_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  return (
    <div className="space-y-6">
      {/* Custom header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Invoice Management</h2>

        {/* Search in the header */}
        <InvoiceSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          className="w-64"
        />
      </div>

      {/* Filters in a separate row */}
      <InvoiceFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {/* Table */}
      <InvoiceDataTable
        invoices={invoices}
        isLoading={isLoading}
        isError={isError}
        error={error}
        showActions={true}
        showFavorites={true}
      />

      {/* Pagination */}
      <InvoicePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
