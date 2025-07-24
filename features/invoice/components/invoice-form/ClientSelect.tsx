"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Client } from "@prisma/client";
import { useGetClients } from "@/features/clients/hooks";
import { ClientForm } from "@/features/clients/components/ClientForm";

interface ClientSelectProps {
  value?: Client | null; // Full client object
  onChange: (client: Client | null) => void;
  placeholder?: string;
}

export function ClientSelect({
  value, // Full client object
  onChange,
  placeholder = "Select a client...",
}: ClientSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { clients, isLoading: isGettingClients, refetch } = useGetClients();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const disabled = isGettingClients;

  // The selected client is now the value itself
  const selectedClient = value;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.BusinessName.toLowerCase().includes(
        debouncedSearchTerm.toLowerCase()
      ) ||
      client.contactPersonName
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    }
  };
  const handleClientSelect = (client: Client) => {
    onChange(client);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };
  const handleAddClient = () => {
    setIsFormOpen(true);
    setIsOpen(false);
  };
  const handleFormSuccess = (newClient: Client) => {
    onChange(newClient);
    refetch(); // Refresh the clients list
  };

  return (
    <>
      <div className="relative w-full" ref={dropdownRef}>
        {/* Trigger Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleToggleDropdown}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-11 px-4 text-left font-normal border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200",
            !value && "text-gray-500",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {" "}
          <span className="truncate">
            {selectedClient ? selectedClient.BusinessName : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-blue-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </Button>

        {/* Dropdown */}
        {isOpen && (
          <Card className="absolute z-50 w-full mt-2 border-2 border-blue-200 shadow-xl rounded-lg">
            <CardContent className="p-0">
              {/* Search Input */}
              {clients && clients.length > 1 && (
                <div className="p-4 border-b border-blue-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-10 h-10 border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              )}
              {/* Client List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredClients.length > 0 ? (
                  <div className="py-1">
                    {filteredClients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => handleClientSelect(client)}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-all duration-200",
                          value?.id === client.id &&
                            "bg-blue-50 border-l-4 border-blue-500"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {client.BusinessName}
                            </div>
                            {client.contactPersonName && (
                              <div className="text-xs text-muted-foreground truncate">
                                {client.contactPersonName}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 truncate">
                              {client.email}
                            </div>{" "}
                          </div>{" "}
                          {value?.id === client.id && (
                            <Check className="h-4 w-4 text-blue-600 ml-2 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-gray-500">
                    {debouncedSearchTerm ? (
                      <>
                        No clients found for &quot;{debouncedSearchTerm}&quot;
                        <br />
                        <span className="text-xs text-gray-400">
                          Try adjusting your search terms
                        </span>
                      </>
                    ) : clients.length === 0 ? (
                      <>
                        No clients available
                        <br />
                        <span className="text-xs text-gray-400">
                          Add your first client to get started
                        </span>
                      </>
                    ) : (
                      "No clients found"
                    )}
                  </div>
                )}
                {clients.length === 0 && (
                  <div className="flex justify-center pb-4">
                    <Button
                      type="button"
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 h-9 text-sm"
                      onClick={() => {
                        handleAddClient();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Client
                    </Button>
                  </div>
                )}
              </div>
              {/* Add New Client Button */}
              {clients.length > 0 && (
                <div className="border-t border-blue-100 p-3">
                  <Button
                    type="button"
                    className="w-full justify-start h-9 text-sm bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                    onClick={() => {
                      handleAddClient();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Client
                  </Button>
                </div>
              )}{" "}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Client Form Dialog */}
      <ClientForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
        mode="create"
      />
    </>
  );
}
