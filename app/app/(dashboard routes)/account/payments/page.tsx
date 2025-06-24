"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FiPlus,
  FiEdit3,
  FiSave,
  FiX,
  FiTrash2,
  FiStar,
  FiCreditCard,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { SiPaypal, SiWise } from "react-icons/si";
import { BsBank, BsShieldCheck } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetPaymentAccounts,
  useCreatePaymentAccount,
  useUpdatePaymentAccount,
  useDeletePaymentAccount,
  useSetPaymentAccountAsDefault,
} from "@/hooks/payments";
import { createPaymentAccountSchema } from "@/dataSchemas/payments";
import { CreatePaymentAccountInput } from "@/types/schemas/payments";
import InBoxLoader from "@/components/InBoxLoader";

// Gateway type icons mapping
const getGatewayIcon = (gatewayType: string) => {
  switch (gatewayType) {
    case "paypal":
      return <SiPaypal className="h-5 w-5 text-blue-600" />;
    case "wise":
      return <SiWise className="h-5 w-5 text-green-600" />;
    case "nigerian-bank":
      return <BsBank className="h-5 w-5 text-gray-600" />;
    case "bank-transfer":
      return <BsBank className="h-5 w-5 text-gray-600" />;
    default:
      return <FiCreditCard className="h-5 w-5 text-gray-600" />;
  }
};

// Schema for updating account data
const editAccountDataSchema = z.object({
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  accountData: z.record(z.string()),
});

type EditAccountDataForm = z.infer<typeof editAccountDataSchema>;

function PaymentAccountsPage() {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedGatewayType, setSelectedGatewayType] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  // Hooks
  const { paymentAccounts, isLoading, error } = useGetPaymentAccounts();
  const { mutateAsync: createPaymentAccount, isPending: isCreating } =
    useCreatePaymentAccount();
  const { mutateAsync: updatePaymentAccount, isPending: isUpdating } =
    useUpdatePaymentAccount();
  const { mutateAsync: deletePaymentAccount, isPending: isDeleting } =
    useDeletePaymentAccount();
  const { mutateAsync: setAsDefault, isPending: isSettingDefault } =
    useSetPaymentAccountAsDefault();

  // Get selected account
  const selectedAccount = paymentAccounts.find(
    (account) => account.id === selectedAccountId
  );

  // Auto-select default account on load
  useEffect(() => {
    if (paymentAccounts.length > 0 && !selectedAccountId) {
      const defaultAccount = paymentAccounts.find(
        (account) => account.isDefault
      );
      if (defaultAccount) {
        setSelectedAccountId(defaultAccount.id);
      } else {
        setSelectedAccountId(paymentAccounts[0].id);
      }
    }
  }, [paymentAccounts, selectedAccountId]);

  // Create form
  const createForm = useForm<CreatePaymentAccountInput>({
    resolver: zodResolver(createPaymentAccountSchema),
    defaultValues: {
      accountName: "",
      gatewayType: "paypal",
      accountData: {},
      isActive: true,
      isDefault: false,
    },
  });

  // Edit form
  const editForm = useForm<EditAccountDataForm>({
    resolver: zodResolver(editAccountDataSchema),
    defaultValues: {
      accountName: "",
      accountData: {},
    },
  });
  // Reset edit form when selected account changes
  useEffect(() => {
    if (selectedAccount) {
      editForm.reset({
        accountName: selectedAccount.accountName,
        accountData:
          (selectedAccount.accountData as Record<string, string>) || {},
      });
    }
  }, [selectedAccount, editForm]); // Handle gateway type change
  const handleGatewayTypeChange = (gatewayType: string) => {
    setSelectedGatewayType(gatewayType);
    createForm.setValue(
      "gatewayType",
      gatewayType as "paypal" | "wise" | "nigerian-bank" | "bank-transfer"
    );
    // Reset accountData when gateway type changes
    createForm.resetField("accountData");
  };

  // Handle create payment account
  const handleCreateAccount = async (data: CreatePaymentAccountInput) => {
    try {
      const result = await createPaymentAccount(data);
      if (result.success && result.data) {
        setSelectedAccountId(result.data.id);
        setIsCreateDialogOpen(false);
        createForm.reset();
        setSelectedGatewayType("");
      }
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };
  // Handle set as default
  const handleSetAsDefault = async (accountId: string) => {
    try {
      await setAsDefault(accountId);
    } catch (error) {
      console.error("Error setting default:", error);
    }
  };

  // Handle edit details
  const handleEditDetails = () => {
    setIsEditingDetails(true);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditingDetails(false);
    if (selectedAccount) {
      editForm.reset({
        accountName: selectedAccount.accountName,
        accountData:
          (selectedAccount.accountData as Record<string, string>) || {},
      });
    }
  };

  // Handle save details
  const handleSaveDetails = async (data: EditAccountDataForm) => {
    if (!selectedAccount) return;

    try {
      const result = await updatePaymentAccount({
        paymentAccountId: selectedAccount.id,
        data: {
          accountName: data.accountName,
          accountData: data.accountData,
        },
      });

      if (result.success) {
        setIsEditingDetails(false);
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  }; // Handle delete account
  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;

    try {
      const result = await deletePaymentAccount(accountToDelete);
      if (result.success && selectedAccountId === accountToDelete) {
        setSelectedAccountId(null);
      }
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // Handle delete button click (open confirmation dialog)
  const handleDeleteClick = (accountId: string) => {
    setAccountToDelete(accountId);
    setDeleteDialogOpen(true);
  };

  // Helper functions for delete button state
  const isOnlyAccount = paymentAccounts.length === 1;
  const canDeleteAccount = (accountId: string) => {
    const account = paymentAccounts.find((acc) => acc.id === accountId);
    if (!account) return false;

    // Can't delete if it's the only account
    if (isOnlyAccount) return false;

    // Can delete if not default
    if (!account.isDefault) return true;

    // Can delete default only if there are other accounts that can become default
    const otherAccounts = paymentAccounts.filter((acc) => acc.id !== accountId);
    return otherAccounts.length > 0;
  };

  const getDeleteTooltip = (accountId: string) => {
    const account = paymentAccounts.find((acc) => acc.id === accountId);
    if (!account) return "";

    if (isOnlyAccount) {
      return "Cannot delete the only payment account";
    }

    if (
      account.isDefault &&
      paymentAccounts.filter((acc) => acc.id !== accountId).length === 0
    ) {
      return "Cannot delete default account when it's the only one";
    }

    return "Delete this payment account";
  };

  // Render dynamic form fields based on gateway type
  const renderGatewayFields = (gatewayType: string) => {
    switch (gatewayType) {
      case "paypal":
        return (
          <FormField
            control={createForm.control}
            name="accountData.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PayPal Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter PayPal email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "wise":
        return (
          <FormField
            control={createForm.control}
            name="accountData.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wise Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Wise email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "nigerian-bank":
        return (
          <>
            <FormField
              control={createForm.control}
              name="accountData.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="accountData.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 10-digit account number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="accountData.accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account holder name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "bank-transfer":
        return (
          <>
            <FormField
              control={createForm.control}
              name="accountData.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="accountData.routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 9-digit routing number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="accountData.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="accountData.accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-6xl text-gray-300">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Error Loading Payment Accounts
          </h2>
          <p className="text-gray-600">
            Unable to load your payment accounts. Please try again.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Payment Accounts
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your payment methods for receiving client payments
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
              <FiPlus className="h-4 w-4 mr-2" />
              <span className="sm:inline">Add New Payment Account</span>
              <span className="sm:hidden">Add Account</span>
            </Button>
          </DialogTrigger>{" "}
          <DialogContent className="sm:max-w-md max-w-[95vw] mx-4">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                Create Payment Account
              </DialogTitle>
              <DialogDescription className="text-sm">
                Add a new payment method to receive payments from your clients.
              </DialogDescription>
            </DialogHeader>

            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(handleCreateAccount)}
                className="space-y-4"
              >
                <FormField
                  control={createForm.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Main PayPal, Business Account"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="gatewayType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gateway Type</FormLabel>
                      <Select
                        onValueChange={handleGatewayTypeChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment gateway" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="wise">Wise</SelectItem>
                          <SelectItem value="nigerian-bank">
                            Nigerian Bank
                          </SelectItem>
                          <SelectItem value="bank-transfer">
                            Bank Transfer (ACH)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedGatewayType &&
                  renderGatewayFields(selectedGatewayType)}
                <FormField
                  control={createForm.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Set as Default Account</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />{" "}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>{" "}
      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Column 1: Payment Accounts List */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Your Payment Accounts
          </h2>

          {paymentAccounts.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FiCreditCard className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Payment Accounts
                </h3>
                <p className="text-gray-500 text-center mb-4">
                  Get started by adding your first payment account to receive
                  payments from clients.
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <FiPlus className="h-4 w-4 mr-2" />
                  Add Payment Account
                </Button>
              </CardContent>
            </Card>
          ) : (
            paymentAccounts.map((account) => (
              <Card
                key={account.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAccountId === account.id
                    ? "border-2 border-black shadow-lg"
                    : "border border-gray-200"
                }`}
                onClick={() => setSelectedAccountId(account.id)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                    <div className="flex items-center gap-3">
                      {getGatewayIcon(account.gatewayType)}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {account.accountName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 capitalize">
                          {account.gatewayType.replace("-", " ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Quick Set as Default button */}
                      {!account.isDefault && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetAsDefault(account.id);
                                }}
                                disabled={isSettingDefault}
                                className="h-8 w-8 p-0 hover:bg-yellow-50"
                              >
                                <FiStar className="h-4 w-4 text-gray-400 hover:text-yellow-600" />
                                <span className="sr-only">Set as default</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Set as default account</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {account.isDefault && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs sm:text-sm">
                          <FiStar className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <Badge
                      variant={account.isActive ? "default" : "secondary"}
                      className={`text-xs sm:text-sm self-start ${
                        account.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {account.isActive ? "Active" : "Inactive"}
                    </Badge>

                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {!account.isDefault && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetAsDefault(account.id);
                          }}
                          disabled={isSettingDefault}
                          className="text-xs sm:text-sm"
                        >
                          {isSettingDefault ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900 mr-1"></div>
                              Setting...
                            </>
                          ) : (
                            <>
                              <FiStar className="h-3 w-3 mr-1" />
                              Set Default
                            </>
                          )}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAccountId(account.id);
                          setIsEditingDetails(true);
                        }}
                        className="text-xs sm:text-sm"
                      >
                        <FiEdit3 className="h-3 w-3" />
                        <span className="sr-only">Edit</span>
                      </Button>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className={`text-xs sm:text-sm ${
                                canDeleteAccount(account.id)
                                  ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (canDeleteAccount(account.id)) {
                                  handleDeleteClick(account.id);
                                }
                              }}
                              disabled={
                                isDeleting || !canDeleteAccount(account.id)
                              }
                            >
                              <FiTrash2 className="h-3 w-3" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getDeleteTooltip(account.id)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {/* Column 2: Account Details Panel */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Account Details
          </h2>

          {!selectedAccount ? (
            <Card className="border border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BsShieldCheck className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select an Account
                </h3>
                <p className="text-gray-500 text-center">
                  Choose a payment account from the list to view and edit its
                  details.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200">
              {" "}
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center gap-3">
                    {getGatewayIcon(selectedAccount.gatewayType)}
                    <div>
                      <CardTitle className="text-lg sm:text-xl">
                        {selectedAccount.accountName}
                      </CardTitle>
                      <p className="text-sm text-gray-500 capitalize">
                        {selectedAccount.gatewayType.replace("-", " ")}
                      </p>
                    </div>
                  </div>

                  {!isEditingDetails && (
                    <Button
                      onClick={handleEditDetails}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <FiEdit3 className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Form {...editForm}>
                  <form
                    onSubmit={editForm.handleSubmit(handleSaveDetails)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Status
                        </Label>
                        <Badge
                          variant={
                            selectedAccount.isActive ? "default" : "secondary"
                          }
                          className={
                            selectedAccount.isActive
                              ? "bg-green-100 text-green-800 ml-2"
                              : "bg-gray-100 text-gray-800 ml-2"
                          }
                        >
                          {selectedAccount.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Default Account
                        </Label>
                        {selectedAccount.isDefault ? (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 ml-2">
                            <FiCheckCircle className="h-3 w-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="ml-2">
                            No
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <FormField
                      control={editForm.control}
                      name="accountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditingDetails}
                              className={
                                !isEditingDetails
                                  ? "bg-gray-50 text-gray-600"
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Account Information
                      </h3>
                      {Object.entries(
                        (selectedAccount.accountData as Record<
                          string,
                          string
                        >) || {}
                      ).map(([key]) => (
                        <FormField
                          key={key}
                          control={editForm.control}
                          name={`accountData.${key}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="capitalize">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  disabled={!isEditingDetails}
                                  className={
                                    !isEditingDetails
                                      ? "bg-gray-50 text-gray-600"
                                      : ""
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    {isEditingDetails && (
                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="w-full sm:w-auto"
                        >
                          <FiX className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isUpdating}
                          className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
                        >
                          {isUpdating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FiSave className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FiAlertTriangle className="h-5 w-5 text-red-600" />
              Delete Payment Account
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {accountToDelete &&
                (() => {
                  const account = paymentAccounts.find(
                    (acc) => acc.id === accountToDelete
                  );
                  if (!account) return "";

                  if (account.isDefault) {
                    return `Are you sure you want to delete "${account.accountName}"? This is your default payment account. You'll need to set another account as default before you can delete this one.`;
                  }

                  return `Are you sure you want to delete "${account.accountName}"? This action cannot be undone.`;
                })()}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setAccountToDelete(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PaymentAccountsPage;
