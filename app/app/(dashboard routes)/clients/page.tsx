"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@prisma/client";
import { useGetClients } from "@/features/clients/hooks";
import { useDeleteClient } from "@/features/clients/hooks/useDeleteClient";
import { ClientForm } from "@/features/clients/components/ClientForm";
import {
  ClientsHeader,
  ClientsSearchAndFilters,
  ClientsTable,
  ClientsGrid,
  ClientsPagination,
  ClientsLoadingState,
  ClientsErrorState,
  ClientsEmptyState,
  DeleteConfirmationDialog,
} from "@/features/clients";
import {
  useClientsSearch,
  useClientsDialog,
  useClientsPagination,
} from "@/features/clients";

const CLIENTS_PER_PAGE = 10;

function ClientsPage() {
  const router = useRouter();
  const [viewMode] = useState<"table" | "grid">("table");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateFilter, setDateFilter] = useState("all");

  // Custom hooks
  const { searchTerm, debouncedSearchTerm, handleSearch } = useClientsSearch();
  const {
    dialogState,
    formMode,
    selectedClient,
    closeDialog,
    openForm,
    openDelete,
  } = useClientsDialog();
  const { currentPage, createPaginationInfo, goToPage, resetToFirstPage } =
    useClientsPagination();

  // Reset pagination when search changes
  useEffect(() => {
    resetToFirstPage();
  }, [debouncedSearchTerm, resetToFirstPage]);

  // Fetch clients with our current filters
  const {
    clients,
    pagination,
    isPending: gettingClients,
    isError,
    error,
    refetch,
  } = useGetClients({
    page: currentPage,
    limit: CLIENTS_PER_PAGE,
    search: debouncedSearchTerm,
  });

  // Delete client hook
  const { deleteClient, isLoading: isDeleting } = useDeleteClient();

  // Create pagination info from our hook
  const paginationInfo = createPaginationInfo(pagination?.totalItems || 0);

  // Handlers
  const handleCreateClient = () => {
    openForm("create");
  };

  const handleEditClient = (client: Client) => {
    openForm("edit", client);
  };

  const handleDeleteClient = (client: Client) => {
    openDelete(client);
  };

  const handleViewClient = (client: Client) => {
    router.push(`/app/clients/${client.id}`);
  };

  const handleDeleteConfirm = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id, {
        onSuccess: () => {
          closeDialog();
        },
      });
    }
  };

  const handleFormSuccess = () => {
    closeDialog();
  };

  const handleRetry = () => {
    refetch();
  };

  // Handle sort toggle
  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Handle date filter change
  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
  };

  // Determine what to render based on loading and data states
  const renderContent = () => {
    if (isError) {
      return (
        <ClientsErrorState
          error={error || "Failed to load clients"}
          onRetry={handleRetry}
        />
      );
    }

    if (gettingClients) {
      return <ClientsLoadingState view={viewMode} />;
    }

    if (!clients || clients.length === 0) {
      return <ClientsEmptyState onCreateClient={handleCreateClient} />;
    }

    return (
      <>
        {viewMode === "table" ? (
          <ClientsTable
            clients={clients}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            onView={handleViewClient}
          />
        ) : (
          <ClientsGrid
            clients={clients}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            onView={handleViewClient}
          />
        )}

        <ClientsPagination
          paginationInfo={paginationInfo}
          onPageChange={goToPage}
        />
      </>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4 lg:px-6">
      <div className="space-y-6">
        {/* Row 1 - Header Section */}
        <div className="w-full">
          <ClientsHeader onCreateClient={handleCreateClient} />
        </div>

        {/* Row 2 - Search and Filter Bar */}
        <div className="w-full">
          <ClientsSearchAndFilters
            searchTerm={searchTerm}
            onSearch={handleSearch}
            sortOrder={sortOrder}
            onSortToggle={handleSortToggle}
            dateFilter={dateFilter}
            onDateFilterChange={handleDateFilterChange}
            isLoading={gettingClients}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        </div>

        {/* Row 3 - Data Table Container */}
        <div className="w-full">{renderContent()}</div>
      </div>

      {/* Dialogs */}
      <ClientForm
        open={dialogState === "form"}
        onOpenChange={closeDialog}
        client={selectedClient}
        mode={formMode}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmationDialog
        open={dialogState === "delete"}
        onClose={closeDialog}
        onConfirm={handleDeleteConfirm}
        client={selectedClient}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default ClientsPage;
