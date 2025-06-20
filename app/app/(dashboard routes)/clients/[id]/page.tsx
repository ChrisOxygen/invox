"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiInbox,
  FiEdit3,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AppDialog from "@/components/AppDialog";
import { useGetClientById } from "@/features/clients/hooks/useGetClientById";
import { useDeleteClient } from "@/features/clients/hooks/useDeleteClient";
import { ClientForm } from "@/features/clients/components/ClientForm";

type DialogState = "edit" | "delete" | null;

function ClientPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [dialogState, setDialogState] = useState<DialogState>(null);

  const { client, isLoading, error } = useGetClientById(clientId, true);
  const { deleteClient, isLoading: isDeleting } = useDeleteClient();
  const handleViewInvoices = (clientId: string) => {
    // Navigate to invoices page filtered by client
    router.push(`/app/invoices?client=${clientId}`);
  };

  const handleEditClient = () => {
    setDialogState("edit");
  };

  const handleDeleteClient = () => {
    setDialogState("delete");
  };

  const handleDeleteConfirm = () => {
    if (client) {
      deleteClient(client.id, {
        onSuccess: () => {
          router.push("/app/clients");
        },
      });
    }
  };

  const closeDialog = () => {
    setDialogState(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-6xl text-gray-300">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">Client Not Found</h2>
          <p className="text-gray-600">
            The client you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push("/app/clients")} variant="outline">
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header Section */}{" "}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {client.BusinessName}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Client ID: {client.id.slice(0, 8)}...
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Button
            onClick={() => handleViewInvoices(client.id)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FiInbox className="h-4 w-4" />
            View Invoices
          </Button>
          <Button
            onClick={handleEditClient}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FiEdit3 className="h-4 w-4" />
            Edit Client
          </Button>
          <Button
            onClick={handleDeleteClient}
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <FiTrash2 className="h-4 w-4" />
            Delete Client
          </Button>
        </div>
      </div>
      <Separator className="mb-8" />
      {/* Client Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiMail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {" "}
            <div className="flex items-start gap-3">
              <FiMail className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{client.email}</p>
              </div>
            </div>
            {client.contactPersonName && (
              <div className="flex items-start gap-3">
                <FiPhone className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Contact Person
                  </p>
                  <p className="text-sm text-gray-600">
                    {client.contactPersonName}
                  </p>
                </div>
              </div>
            )}
            {client.address && (
              <div className="flex items-start gap-3">
                <FiMapPin className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {client.address}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {" "}
            <div>
              <p className="text-sm font-medium text-gray-900">Business Name</p>
              <p className="text-sm text-gray-600">{client.BusinessName}</p>
            </div>
            <div className="flex items-start gap-3">
              <FiCalendar className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Client Since
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(client.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Last Updated</p>
              <p className="text-sm text-gray-600">
                {new Date(client.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>{" "}
      {/* Edit Client Dialog */}
      <ClientForm
        client={client}
        open={dialogState === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            setDialogState(null);
          }
        }}
        onSuccess={() => {
          setDialogState(null);
        }}
        mode="edit"
      />
      {/* Delete Confirmation Dialog */}
      <AppDialog
        open={dialogState === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
        title={`Delete ${client.BusinessName}?`}
      >
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="h-6 w-6 text-red-600" />
            </div>{" "}
            <p className="text-sm text-gray-600">
              This action cannot be undone. This will permanently delete the
              client and remove all associated data from our servers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={closeDialog}
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

export default ClientPage;
