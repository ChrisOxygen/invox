import { useState } from "react";
import { DialogStateType, FormMode } from "../types";
import { Item } from "@prisma/client";

export const useItemsDialog = () => {
  const [dialogState, setDialogState] = useState<DialogStateType>(null);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const openDialog = (type: DialogStateType, item?: Item, mode?: FormMode) => {
    setDialogState(type);
    setSelectedItem(item || null);
    if (mode) setFormMode(mode);
  };

  const closeDialog = () => {
    setDialogState(null);
    setSelectedItem(null);
  };

  const openPreview = (item: Item) => {
    openDialog("preview", item);
  };

  const openForm = (mode: FormMode, item?: Item) => {
    openDialog("form", item, mode);
  };

  const openDelete = (item: Item) => {
    openDialog("delete", item);
  };

  return {
    dialogState,
    formMode,
    selectedItem,
    openDialog,
    closeDialog,
    openPreview,
    openForm,
    openDelete,
    setFormMode,
  };
};
