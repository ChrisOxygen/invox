"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  User,
  MapPin,
  Calendar,
  FileText,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClientById } from "@/features/clients/hooks/useGetClientById";
import { useDeleteClient } from "@/features/clients/hooks/useDeleteClient";
import { ClientForm } from "@/features/clients/components/ClientForm";
import { DeleteConfirmationDialog } from "@/features/clients";

type DialogState = "edit" | "delete" | null;

function ClientPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [dialogState, setDialogState] = useState<DialogState>(null);

  const { client, isLoading, error } = useGetClientById(clientId, true);
  const { deleteClient, isLoading: isDeleting } = useDeleteClient();

  const handleViewInvoices = (clientId: string) => {
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

  const handleBackToClients = () => {
    router.push("/app/clients");
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 lg:px-6">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-4 w-4 mt-1" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !client) {
    return (
      <div className="container mx-auto py-6 px-4 lg:px-6">
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Client Not Found
              </h2>
              <p className="text-gray-600 max-w-md">
                The client you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
            </div>
            <Button
              onClick={handleBackToClients}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 lg:px-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToClients}
                className="p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                {client.BusinessName}
              </h1>
            </div>
            <div className="flex items-center gap-2 ml-11">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-200 hover:to-cyan-200"
              >
                ID: {client.id.slice(0, 8)}...
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200"
              >
                Active Client
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => handleViewInvoices(client.id)}
              variant="outline"
              className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800"
            >
              <FileText className="mr-2 h-4 w-4" />
              View Invoices
            </Button>
            <Button
              onClick={handleEditClient}
              variant="outline"
              className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Client
            </Button>
            <Button
              onClick={handleDeleteClient}
              variant="outline"
              className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Client Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information Card */}
          <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Email Address
                  </p>
                  <p className="text-sm text-gray-600 break-all">
                    {client.email}
                  </p>
                </div>
              </div>

              {client.contactPersonName && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Contact Person
                    </p>
                    <p className="text-sm text-gray-600">
                      {client.contactPersonName}
                    </p>
                  </div>
                </div>
              )}

              {client.address ? (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Address
                    </p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {client.address}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Address
                    </p>
                    <p className="text-sm text-gray-400">No address provided</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Information Card */}
          <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Building className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Business Name
                  </p>
                  <p className="text-sm text-gray-600">{client.BusinessName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
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

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(client.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
      <DeleteConfirmationDialog
        open={dialogState === "delete"}
        onClose={closeDialog}
        onConfirm={handleDeleteConfirm}
        client={client}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default ClientPage;
