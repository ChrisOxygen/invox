"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { commonItemDescriptions } from "@/dataSchemas/invoice";
import { ItemDescriptionForm } from "./ItemDescriptionForm";

interface ItemDescriptionSelectProps {
  value?: string;
  onChange: (description: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ItemDescriptionSelect({
  value,
  onChange,
  placeholder = "Select or type description...",
  disabled = false,
}: ItemDescriptionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter descriptions based on search term
  const filteredDescriptions = commonItemDescriptions.filter((description) =>
    description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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
    } else if (e.key === "Enter" && searchTerm.trim()) {
      // Allow direct input if user types something
      onChange(searchTerm.trim());
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleDescriptionSelect = (description: string) => {
    onChange(description);
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

  const handleAddCustomDescription = () => {
    setIsFormOpen(true);
    setIsOpen(false);
  };

  const handleFormSuccess = (newDescription: string) => {
    onChange(newDescription);
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
          <span className="truncate">{value || placeholder}</span>
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
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search or type description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-8 h-8"
                  />
                </div>
                {searchTerm.trim() && (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleDescriptionSelect(searchTerm.trim())}
                      className="w-full justify-start h-8 text-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Use &quot;{searchTerm.trim()}&quot;
                    </Button>
                  </div>
                )}
              </div>

              {/* Description List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredDescriptions.length > 0 ? (
                  <div className="py-1">
                    {filteredDescriptions.map((description) => (
                      <button
                        key={description}
                        type="button"
                        onClick={() => handleDescriptionSelect(description)}
                        className={cn(
                          "w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors",
                          value === description && "bg-gray-100"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm truncate">
                              {description}
                            </div>
                          </div>
                          {value === description && (
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
                        No descriptions found for &quot;{debouncedSearchTerm}
                        &quot;
                        <br />
                        <span className="text-xs">
                          Press Enter to use this description
                        </span>
                      </>
                    ) : (
                      "No descriptions available"
                    )}
                  </div>
                )}
              </div>

              {/* Add Custom Description Button */}
              <div className="border-t p-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleAddCustomDescription}
                  className="w-full justify-start h-8 text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Description
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Custom Description Form Dialog */}
      <ItemDescriptionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
        mode="create"
      />
    </>
  );
}
