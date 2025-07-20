import { Item } from "@prisma/client";
import { FormMode } from "../types";

interface UseItemsActionsProps {
  items: Item[];
  openForm: (mode: FormMode, item?: Item) => void;
  openDelete: (item: Item) => void;
  openPreview: (item: Item) => void;
  closeDialog: () => void;
}

export const useItemsActions = ({
  items,
  openForm,
  openDelete,
  openPreview,
  closeDialog,
}: UseItemsActionsProps) => {
  const handleAddItem = () => {
    openForm("create");
  };

  const handleEditItem = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      openForm("edit", item);
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      openDelete(item);
    }
  };

  const handleRowClick = (item: Item) => {
    openPreview(item);
  };

  const handleSaveItem = (item: Item) => {
    console.log("Item saved:", item);
    closeDialog();
  };

  const handleDeleteConfirm = () => {
    closeDialog();
  };

  const handleEditFromPreview = (item: Item) => {
    openForm("edit", item);
  };

  return {
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleRowClick,
    handleSaveItem,
    handleDeleteConfirm,
    handleEditFromPreview,
  };
};
