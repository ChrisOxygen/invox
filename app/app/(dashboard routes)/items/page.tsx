"use client";

import React, { useState } from "react";
import { ItemsList, ItemForm } from "@/features/items/components";
import { Item } from "@prisma/client";

function ItemsPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateItem = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {isFormOpen ? (
        <div className="flex justify-center">
          <ItemForm
            item={selectedItem}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <ItemsList
          onCreateItem={handleCreateItem}
          onEditItem={handleEditItem}
        />
      )}
    </div>
  );
}

export default ItemsPage;
