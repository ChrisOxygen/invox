import { useState } from "react";
import { Client } from "@prisma/client";
import { DialogStateType, FormMode } from "../types";

export const useClientsDialog = () => {
  const [dialogState, setDialogState] = useState<DialogStateType>(null);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const closeDialog = () => {
    setDialogState(null);
    setSelectedClient(null);
  };

  const openForm = (mode: FormMode, client?: Client) => {
    setFormMode(mode);
    setSelectedClient(client || null);
    setDialogState("form");
  };

  const openDelete = (client: Client) => {
    setSelectedClient(client);
    setDialogState("delete");
  };

  return {
    dialogState,
    formMode,
    selectedClient,
    closeDialog,
    openForm,
    openDelete,
  };
};
