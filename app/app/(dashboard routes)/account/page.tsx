"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VscCreditCard } from "react-icons/vsc";
import {
  FiUser,
  FiEdit3,
  FiSave,
  FiX,
  FiLock,
  FiUpload,
  FiImage,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUserWithBusiness } from "@/features/business/hooks";
import { useUpdateBusiness } from "@/features/business/hooks";
import {
  useGetPaymentAccounts,
  useUpdatePaymentAccount,
} from "@/hooks/payments";
import InBoxLoader from "@/components/InBoxLoader";

// Schema for editable business fields
const editableBusinessSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
});

// Schema for editable payment account fields
const editablePaymentAccountSchema = z.object({
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  accountData: z.record(z.string()),
});

type EditableBusinessData = z.infer<typeof editableBusinessSchema>;
type EditablePaymentAccountData = z.infer<typeof editablePaymentAccountSchema>;

function AccountPage() {
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingPaymentAccount, setIsEditingPaymentAccount] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Fetch user and business data
  const {
    data: userWithBusiness,
    isLoading,
    error,
    refetch,
  } = useUserWithBusiness();
  // Update business mutation
  const {
    updateBusiness,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateBusiness();

  // Fetch payment accounts
  const { paymentAccounts, isLoading: isLoadingPaymentAccounts } =
    useGetPaymentAccounts();

  // Update payment account mutation
  const {
    mutateAsync: updatePaymentAccount,
    isPending: isUpdatingPaymentAccount,
  } = useUpdatePaymentAccount();
  // Form for editable business fields
  const form = useForm<EditableBusinessData>({
    resolver: zodResolver(editableBusinessSchema),
    defaultValues: {
      addressLine1: userWithBusiness?.business?.addressLine1 || "",
      addressLine2: userWithBusiness?.business?.addressLine2 || "",
      city: userWithBusiness?.business?.city || "",
      state: userWithBusiness?.business?.state || "",
      zipCode: userWithBusiness?.business?.zipCode || "",
      phone: userWithBusiness?.business?.phone || "",
    },
  });

  // Get default payment account for form initialization
  const defaultPaymentAccount = paymentAccounts.find(
    (account) => account.isDefault
  );

  // Form for editable payment account fields
  const paymentAccountForm = useForm<EditablePaymentAccountData>({
    resolver: zodResolver(editablePaymentAccountSchema),
    defaultValues: {
      accountName: defaultPaymentAccount?.accountName || "",
      accountData:
        (defaultPaymentAccount?.accountData as Record<string, string>) || {},
    },
  });
  // Reset form when data loads
  useEffect(() => {
    if (userWithBusiness?.business) {
      form.reset({
        addressLine1: userWithBusiness.business.addressLine1 || "",
        addressLine2: userWithBusiness.business.addressLine2 || "",
        city: userWithBusiness.business.city || "",
        state: userWithBusiness.business.state || "",
        zipCode: userWithBusiness.business.zipCode || "",
        phone: userWithBusiness.business.phone || "",
      });
    }
  }, [userWithBusiness?.business, form]);

  // Reset payment account form when payment accounts load
  useEffect(() => {
    if (defaultPaymentAccount) {
      paymentAccountForm.reset({
        accountName: defaultPaymentAccount.accountName,
        accountData:
          (defaultPaymentAccount.accountData as Record<string, string>) || {},
      });
    }
  }, [defaultPaymentAccount, paymentAccountForm]);

  const handleEditBusiness = () => {
    setIsEditingBusiness(true);
  };

  const handleCancelEdit = () => {
    setIsEditingBusiness(false);
    // Reset form to original values
    if (userWithBusiness?.business) {
      form.reset({
        addressLine1: userWithBusiness.business.addressLine1 || "",
        addressLine2: userWithBusiness.business.addressLine2 || "",
        city: userWithBusiness.business.city || "",
        state: userWithBusiness.business.state || "",
        zipCode: userWithBusiness.business.zipCode || "",
        phone: userWithBusiness.business.phone || "",
      });
    }
  };
  const handleSaveBusiness = async (data: EditableBusinessData) => {
    if (!userWithBusiness?.business?.id) {
      toast.error("Business information not found");
      return;
    }

    try {
      await updateBusiness({
        businessId: userWithBusiness.business.id,
        data: {
          ...data,
          // Keep existing required fields
          businessName: userWithBusiness.business.businessName,
          email: userWithBusiness.business.email,
        },
      });

      toast.success("Business details updated successfully");
      setIsEditingBusiness(false);
      refetch();
    } catch (error) {
      toast.error(updateError || "Failed to update business details");
    }
  };

  const handleEditPaymentAccount = () => {
    setIsEditingPaymentAccount(true);
  };

  const handleCancelPaymentAccountEdit = () => {
    setIsEditingPaymentAccount(false);
    // Reset form to original values
    if (defaultPaymentAccount) {
      paymentAccountForm.reset({
        accountName: defaultPaymentAccount.accountName,
        accountData:
          (defaultPaymentAccount.accountData as Record<string, string>) || {},
      });
    }
  };

  const handleSavePaymentAccount = async (data: EditablePaymentAccountData) => {
    if (!defaultPaymentAccount?.id) {
      toast.error("Payment account not found");
      return;
    }

    try {
      const result = await updatePaymentAccount({
        paymentAccountId: defaultPaymentAccount.id,
        data: {
          accountName: data.accountName,
          accountData: data.accountData,
        },
      });

      if (result.success) {
        setIsEditingPaymentAccount(false);
      }
    } catch (error) {
      console.error("Error updating payment account:", error);
    }
  };

  // Logo upload handlers
  const handleLogoClick = () => {
    setIsLogoModalOpen(true);
  };

  const handleLogoModalClose = () => {
    setIsLogoModalOpen(false);
  };

  const handleLogoUpload = async (logoUrl: string) => {
    // TODO: Implement logo upload functionality
    console.log("Logo upload:", logoUrl);
    setIsLogoModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  if (error || !userWithBusiness) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-6xl text-gray-300">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Error Loading Account
          </h2>
          <p className="text-gray-600">
            Unable to load your account information. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const user = userWithBusiness;
  const business = userWithBusiness.business;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600">
          Manage your personal and business information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Personal Information Section */}
        <Card className=" border-none shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUser className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <p className="text-sm text-gray-500">
              Your personal account details (read-only)
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiLock className="h-3 w-3 text-gray-400" />
                  Full Name
                </Label>
                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-600">{user.name || "Not provided"}</p>
                </div>
                <p className="text-xs text-gray-400">
                  Contact support to change your name
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiLock className="h-3 w-3 text-gray-400" />
                  Email Address
                </Label>
                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <p className="text-xs text-gray-400">
                  This is your login email and cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Account Status
                </Label>
                <div>
                  <Badge
                    variant={user.onboardingCompleted ? "default" : "secondary"}
                    className={
                      user.onboardingCompleted
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {user.onboardingCompleted ? "Active" : "Setup Required"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Currency
                </Label>
                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-600">
                    {user.currency?.toUpperCase() || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Separator className="my-6" />{" "}
        <Card className=" border-none shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <VscCreditCard />
                  Payment account
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Your payment account details
                </p>
              </div>
              {!isEditingPaymentAccount && defaultPaymentAccount && (
                <Button
                  onClick={handleEditPaymentAccount}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FiEdit3 className="h-4 w-4" />
                  Edit Account Details
                </Button>
              )}
            </div>
          </CardHeader>{" "}
          <CardContent className="space-y-6">
            {isLoadingPaymentAccounts ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">
                  Loading payment accounts...
                </p>
              </div>
            ) : paymentAccounts.length === 0 ? (
              <div className="text-center py-8">
                <VscCreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Payment Accounts
                </h3>
                <p className="text-gray-500 mb-4">
                  Set up a payment account to receive payments from clients.
                </p>
                <Link href="/app/account/payments">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Add New Payment Account
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Find default payment account */}
                {(() => {
                  if (!defaultPaymentAccount) {
                    return (
                      <div className="text-center py-4">
                        <p className="text-gray-500">
                          No default payment account set
                        </p>
                      </div>
                    );
                  }

                  // Process JSON accountData following Template1 pattern
                  const accountDataArray = Object.entries(
                    defaultPaymentAccount.accountData || {}
                  ).map(([key, value]) => ({ key, value }));

                  return (
                    <Form {...paymentAccountForm}>
                      <form
                        onSubmit={paymentAccountForm.handleSubmit(
                          handleSavePaymentAccount
                        )}
                        className="space-y-4"
                      >
                        {/* Account Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={paymentAccountForm.control}
                            name="accountName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter account name"
                                    {...field}
                                    disabled={!isEditingPaymentAccount}
                                    className={
                                      !isEditingPaymentAccount
                                        ? "bg-gray-50 text-gray-600"
                                        : ""
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Gateway Type
                            </Label>
                            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-gray-600 capitalize">
                                {defaultPaymentAccount.gatewayType.replace(
                                  "_",
                                  " "
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Status
                            </Label>
                            <div>
                              <Badge
                                variant={
                                  defaultPaymentAccount.isActive
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  defaultPaymentAccount.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {defaultPaymentAccount.isActive
                                  ? "Active"
                                  : "Inactive"}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Default Account
                            </Label>
                            <div>
                              <Badge
                                variant="default"
                                className="bg-blue-100 text-blue-800"
                              >
                                Default
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Account Details - Processing JSON field */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Account Details
                          </h3>

                          {accountDataArray.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                              No account details available
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {accountDataArray.map((item) => (
                                <FormField
                                  key={item.key}
                                  control={paymentAccountForm.control}
                                  name={`accountData.${item.key}`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="capitalize">
                                        {item.key
                                          .replace(/([A-Z])/g, " $1")
                                          .replace(/^./, (str) =>
                                            str.toUpperCase()
                                          )}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder={`Enter ${item.key}`}
                                          {...field}
                                          value={field.value || ""}
                                          disabled={!isEditingPaymentAccount}
                                          className={
                                            !isEditingPaymentAccount
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
                          )}
                        </div>

                        {/* Edit Actions */}
                        {isEditingPaymentAccount && (
                          <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancelPaymentAccountEdit}
                              disabled={isUpdatingPaymentAccount}
                            >
                              <FiX className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={isUpdatingPaymentAccount}
                              className="bg-black text-white hover:bg-gray-800"
                            >
                              {isUpdatingPaymentAccount ? (
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
                            </Button>{" "}
                          </div>
                        )}
                      </form>
                    </Form>
                  );
                })()}

                {/* Add/Change Account Details Button */}
                <div className="pt-4 border-t">
                  <Link href="/app/account/payments">
                    <Button
                      variant="outline"
                      className="w-full text-gray-600 hover:text-gray-900"
                    >
                      Change or Add New Account Details
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Separator className="my-6" />
        {/* Business Information Section */}
        <Card className=" border-none shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                {" "}
                <CardTitle className="flex items-center gap-2">
                  <HiOutlineOfficeBuilding className="h-5 w-5" />
                  Business Information
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Your business details and contact information
                </p>
              </div>
              {!isEditingBusiness && business && (
                <Button
                  onClick={handleEditBusiness}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FiEdit3 className="h-4 w-4" />
                  Edit Business Details
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!business ? (
              <div className="text-center py-8">
                <HiOutlineOfficeBuilding className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Business Information
                </h3>
                <p className="text-gray-500 mb-4">
                  Complete your onboarding to set up business information.
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSaveBusiness)}
                  className="space-y-6"
                >
                  {" "}
                  {/* Read-only Business Fields with Logo */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Logo Column */}
                    <div className="lg:col-span-1 space-y-4">
                      <Label className="text-sm font-medium text-gray-700">
                        Business Logo
                      </Label>

                      {/* Logo Display Area */}
                      <div className="aspect-video w-full max-w-32 mx-auto lg:mx-0">
                        {business.logo ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={business.logo}
                              alt={`${business.businessName} logo`}
                              fill
                              className="object-contain rounded-md border border-gray-200"
                              priority
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center">
                            <FiImage className="h-8 w-8 text-gray-300 mb-2" />
                            <p className="text-xs text-gray-400 text-center">
                              No logo uploaded
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Logo Action Button */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleLogoClick}
                        className="w-full max-w-32 mx-auto lg:mx-0 flex items-center gap-2"
                      >
                        <FiUpload className="h-3 w-3" />
                        {business.logo ? "Change Logo" : "Upload Logo"}
                      </Button>
                    </div>

                    {/* Business Info Columns */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <FiLock className="h-3 w-3 text-gray-400" />
                          Business Name
                        </Label>
                        <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                          <p className="text-gray-600">
                            {business.businessName}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400">
                          Contact support to change business name
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <FiLock className="h-3 w-3 text-gray-400" />
                          Business Email
                        </Label>
                        <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                          <p className="text-gray-600">{business.email}</p>
                        </div>
                        <p className="text-xs text-gray-400">
                          Primary business contact email
                        </p>
                      </div>

                      {business.businessType && (
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Business Type
                          </Label>
                          <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                            <p className="text-gray-600">
                              {business.businessType}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                  {/* Editable Business Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Business Address & Contact
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter address line 1"
                                {...field}
                                disabled={!isEditingBusiness}
                                className={
                                  !isEditingBusiness
                                    ? "bg-gray-50 text-gray-600"
                                    : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter address line 2 (optional)"
                                {...field}
                                disabled={!isEditingBusiness}
                                className={
                                  !isEditingBusiness
                                    ? "bg-gray-50 text-gray-600"
                                    : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter city"
                                {...field}
                                disabled={!isEditingBusiness}
                                className={
                                  !isEditingBusiness
                                    ? "bg-gray-50 text-gray-600"
                                    : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter state or province"
                                {...field}
                                disabled={!isEditingBusiness}
                                className={
                                  !isEditingBusiness
                                    ? "bg-gray-50 text-gray-600"
                                    : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP/Postal Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter ZIP or postal code"
                                {...field}
                                disabled={!isEditingBusiness}
                                className={
                                  !isEditingBusiness
                                    ? "bg-gray-50 text-gray-600"
                                    : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter phone number"
                                {...field}
                                disabled={!isEditingBusiness}
                                className={
                                  !isEditingBusiness
                                    ? "bg-gray-50 text-gray-600"
                                    : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {/* Edit Actions */}
                  {isEditingBusiness && (
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        <FiX className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-black text-white hover:bg-gray-800"
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
            )}
          </CardContent>{" "}
        </Card>
      </div>

      {/* Logo Upload Modal */}
      <Dialog open={isLogoModalOpen} onOpenChange={setIsLogoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FiImage className="h-5 w-5" />
              {business?.logo ? "Change Business Logo" : "Upload Business Logo"}
            </DialogTitle>
            <DialogDescription>
              {business?.logo
                ? "Update your business logo that appears on invoices and documents."
                : "Add your business logo that will appear on invoices and documents."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {/* Empty content area - ready for future file upload implementation */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <FiUpload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">File upload functionality</p>
              <p className="text-sm text-gray-400">
                This feature will be implemented in the next phase
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleLogoModalClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleLogoUpload("")}
              disabled
              className="w-full sm:w-auto bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              <FiUpload className="h-4 w-4 mr-2" />
              Upload Logo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AccountPage;
