"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  FiUser,
  FiMail,
  FiEye,
} from "react-icons/fi";
import { useGetClients } from "@/features/clients/hooks";
import { useDeleteClient } from "@/features/clients/hooks/useDeleteClient";
import { useDebounce } from "@/hooks/useDebounce";
import { Client } from "@prisma/client";
import { ClientForm } from "@/features/clients/components/ClientForm";
import AppDialog from "@/components/AppDialog";

const CLIENTS_PER_PAGE = 10;

type DialogState = "form" | "delete" | null;
type FormMode = "create" | "edit";

function ClientsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Fetch clients using the updated hook with pagination
  const {
    clients,
    pagination,
    isPending: gettingClients,
    isError,
    error,
  } = useGetClients({
    page: currentPage,
    limit: CLIENTS_PER_PAGE,
    search: debouncedSearchTerm,
  });

  // Delete client hook
  const { deleteClient, isLoading: isDeleting } = useDeleteClient();

  // Handle search input changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Dialog handlers
  const handleAddClient = () => {
    setSelectedClient(null);
    setFormMode("create");
    setDialogState("form");
  };
  const handleEditClient = (id: string) => {
    const client = clients.find((c: Client) => c.id === id);
    if (client) {
      setSelectedClient(client);
      setFormMode("edit");
      setDialogState("form");
    }
  };

  const handleDeleteClient = (id: string) => {
    const client = clients.find((c: Client) => c.id === id);
    if (client) {
      setSelectedClient(client);
      setDialogState("delete");
    }
  };

  const handleViewClient = (id: string) => {
    router.push(`/app/clients/${id}`);
  };

  const handleDeleteConfirm = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id, {
        onSuccess: () => {
          setDialogState(null);
          setSelectedClient(null);
        },
      });
    }
  };

  const handleDialogClose = () => {
    setDialogState(null);
    setSelectedClient(null);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">All Clients</h1>
        <Button
          onClick={handleAddClient}
          className="bg-black text-white hover:bg-gray-800 transition-colors duration-200"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 border-gray-300 focus:border-black focus:ring-black"
        />
        {gettingClients && debouncedSearchTerm && (
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
              <p className="text-red-600 mb-2">Error loading clients</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          </div>
        ) : gettingClients ? (
          <div className="space-y-4">
            <div className="border rounded-lg">
              <div className="border-b p-4">
                <div className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border-b last:border-b-0">
                  <div className="grid grid-cols-4 gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : clients.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiUser className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">
                {debouncedSearchTerm ? "No clients found" : "No clients yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {debouncedSearchTerm
                  ? `No clients match "${debouncedSearchTerm}"`
                  : "Get started by adding your first client"}
              </p>
              {!debouncedSearchTerm && (
                <Button
                  onClick={handleAddClient}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Your First Client
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
                      Business Name
                    </TableHead>
                    <TableHead className="font-semibold text-black">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-black">
                      Contact Person
                    </TableHead>
                    <TableHead className="font-semibold text-black w-20">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {clients.map((client: Client) => (
                    <TableRow
                      key={client.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewClient(client.id)}
                    >
                      <TableCell>
                        <div className="font-medium text-black">
                          {client.BusinessName}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {client.email}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {client.contactPersonName || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewClient(client.id);
                            }}
                            className="border-gray-300 hover:border-black hover:bg-gray-50"
                          >
                            <FiEye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClient(client.id);
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
                              handleDeleteClient(client.id);
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
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {clients.map((client: Client) => (
                <div
                  key={client.id}
                  className="border rounded-lg p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleViewClient(client.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-black">
                        {client.BusinessName}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <FiMail className="h-3 w-3 mr-1" />
                        {client.email}
                      </div>
                      {client.contactPersonName && (
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <FiUser className="h-3 w-3 mr-1" />
                          {client.contactPersonName}
                        </div>
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
                              handleViewClient(client.id);
                            }}
                            className="w-full justify-start hover:bg-gray-100"
                          >
                            <FiEye className="mr-2 h-3 w-3" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClient(client.id);
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
                              handleDeleteClient(client.id);
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
                    <span className="text-sm text-gray-500">Client since:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

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
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      <ClientForm
        open={dialogState === "form"}
        onOpenChange={handleDialogClose}
        client={selectedClient}
        mode={formMode}
        onSuccess={() => {
          setDialogState(null);
          setSelectedClient(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AppDialog
        open={dialogState === "delete"}
        onOpenChange={(open) => !open && handleDialogClose()}
        title={`Delete ${selectedClient?.BusinessName}?`}
      >
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-600">
              This action cannot be undone. This will permanently delete the
              client and remove all associated data from our servers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleDialogClose}
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
                  Delete Client
                </>
              )}
            </Button>
          </div>
        </div>
      </AppDialog>
    </div>
  );
}

export default ClientsPage;
