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
            "w-full justify-between h-9 px-3 text-left font-normal",
            !value && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {" "}
          <span className="truncate">
            {selectedClient ? selectedClient.BusinessName : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 opacity-50 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>

        {/* Dropdown */}
        {isOpen && (
          <Card className="absolute z-50 w-full mt-1 border shadow-lg">
            <CardContent className="p-0">
              {/* Search Input */}
              {clients && clients.length > 1 && (
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-8 h-8"
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
                          "w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors",
                          value?.id === client.id && "bg-gray-100"
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
                            <div className="text-xs text-muted-foreground truncate">
                              {client.email}
                            </div>{" "}
                          </div>{" "}
                          {value?.id === client.id && (
                            <Check className="h-4 w-4 text-black ml-2 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    {debouncedSearchTerm ? (
                      <>
                        No clients found for &quot;{debouncedSearchTerm}&quot;
                        <br />
                        <span className="text-xs">
                          Try adjusting your search terms
                        </span>
                      </>
                    ) : clients.length === 0 ? (
                      <>
                        No clients available
                        <br />
                        <span className="text-xs">
                          Add your first client to get started
                        </span>
                      </>
                    ) : (
                      "No clients found"
                    )}
                  </div>
                )}
                {clients.length === 0 && (
                  <div className=" flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        handleAddClient();
                      }}
                      className=" h-8 text-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Client
                    </Button>
                  </div>
                )}
              </div>
              {/* Add New Client Button */}
              {clients.length > 0 && (
                <div className="border-t p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      handleAddClient();
                    }}
                    className="w-full justify-start h-8 text-sm"
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
