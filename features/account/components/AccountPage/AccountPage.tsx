"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useUserWithBusiness } from "@/features/business/hooks";
import { useGetPaymentAccounts } from "@/hooks/payments";
import InBoxLoader from "@/components/InBoxLoader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ProfileSection,
  BusinessInformationCard,
  PaymentInformationCard,
  BusinessEditModal,
  PaymentEditModal,
  LogoUploadModal,
  SignatureUploadModal,
} from "./";
import { useAccountModals, useBusinessForm, usePaymentForm } from "../../hooks";
import {
  EditableBusinessData,
  EditablePaymentAccountData,
} from "../../validation";

function AccountPage() {
  // Modal states
  const {
    isLogoModalOpen,
    openLogoModal,
    closeLogoModal,
    isSignatureModalOpen,
    openSignatureModal,
    closeSignatureModal,
    isEditBusinessModalOpen,
    openEditBusinessModal,
    closeEditBusinessModal,
    isEditPaymentModalOpen,
    openEditPaymentModal,
    closeEditPaymentModal,
  } = useAccountModals();

  // Data fetching
  const {
    data: userWithBusiness,
    isLoading,
    error,
    refetch,
  } = useUserWithBusiness();

  const { paymentAccounts, isLoading: isLoadingPaymentAccounts } =
    useGetPaymentAccounts();

  // Business form
  const {
    form: businessForm,
    isUpdatingBusiness,
    resetToOriginalValues: resetBusinessForm,
    handleSaveBusiness,
  } = useBusinessForm();

  // Payment form
  const {
    form: paymentForm,
    defaultPaymentAccount,
    isUpdatingPaymentAccount,
    resetToOriginalValues: resetPaymentForm,
    handleSavePaymentAccount,
  } = usePaymentForm();

  // Business edit handlers
  const handleEditBusinessInfo = () => {
    openEditBusinessModal();
  };

  const handleBusinessModalClose = () => {
    closeEditBusinessModal();
    resetBusinessForm();
  };

  const handleBusinessSave = (data: EditableBusinessData) => {
    handleSaveBusiness(
      data,
      () => closeEditBusinessModal(), // onSuccess
      () => openEditBusinessModal() // onError - reopen modal
    );
  };

  // Payment edit handlers
  const handleEditPaymentInfo = () => {
    openEditPaymentModal();
  };

  const handlePaymentModalClose = () => {
    closeEditPaymentModal();
    resetPaymentForm();
  };

  const handlePaymentSave = (data: EditablePaymentAccountData) => {
    handleSavePaymentAccount(
      data,
      () => closeEditPaymentModal(), // onSuccess
      () => openEditPaymentModal() // onError - reopen modal
    );
  };

  // Logo upload handlers
  const handleEditLogo = () => {
    openLogoModal();
  };

  const handleLogoUploadSuccess = async () => {
    await refetch();
    closeLogoModal();
    toast.success("Business logo updated successfully!");
  };

  const handleLogoUploadError = (error: string) => {
    toast.error(error);
  };

  // Signature upload handlers
  const handleEditSignature = () => {
    openSignatureModal();
  };

  const handleSignatureUploadSuccess = async () => {
    await refetch();
    closeSignatureModal();
    toast.success("Signature updated successfully!");
  };

  const handleSignatureUploadError = (error: string) => {
    toast.error(error);
  };

  const handleDeleteAccount = () => {
    console.log("Delete account clicked");
  };

  const handleConnectGateway = () => {
    console.log("Connect another gateway clicked");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  // Error state
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

  // Extract data from API response
  const user = userWithBusiness;
  const business = userWithBusiness.business;

  return (
    <TooltipProvider>
      <div className="container mx-auto py-6 px-4 lg:px-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <ProfileSection
            user={user}
            onEditSignature={handleEditSignature}
            onDeleteAccount={handleDeleteAccount}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Business Information */}
            <BusinessInformationCard
              business={business}
              isUpdatingBusiness={isUpdatingBusiness}
              onEditBusinessInfo={handleEditBusinessInfo}
              onEditLogo={handleEditLogo}
            />

            {/* Payment Information */}
            <PaymentInformationCard
              paymentAccounts={
                paymentAccounts as Array<{
                  id: string;
                  gatewayType: string;
                  accountName: string;
                  isActive: boolean;
                  accountData?: Record<string, unknown> | null;
                }>
              }
              defaultPaymentAccount={
                defaultPaymentAccount as
                  | {
                      id: string;
                      gatewayType: string;
                      accountName: string;
                      isActive: boolean;
                      accountData?: Record<string, unknown> | null;
                    }
                  | undefined
              }
              isLoadingPaymentAccounts={isLoadingPaymentAccounts}
              isUpdatingPaymentAccount={isUpdatingPaymentAccount}
              onEditPaymentInfo={handleEditPaymentInfo}
              onConnectGateway={handleConnectGateway}
            />
          </div>
        </div>

        {/* Modals */}
        <LogoUploadModal
          isOpen={isLogoModalOpen}
          onClose={closeLogoModal}
          business={business}
          onUploadSuccess={handleLogoUploadSuccess}
          onUploadError={handleLogoUploadError}
        />

        <SignatureUploadModal
          isOpen={isSignatureModalOpen}
          onClose={closeSignatureModal}
          user={user}
          onUploadSuccess={handleSignatureUploadSuccess}
          onUploadError={handleSignatureUploadError}
        />

        <BusinessEditModal
          isOpen={isEditBusinessModalOpen}
          onClose={handleBusinessModalClose}
          form={businessForm}
          isUpdating={isUpdatingBusiness}
          onSave={handleBusinessSave}
        />

        <PaymentEditModal
          isOpen={isEditPaymentModalOpen}
          onClose={handlePaymentModalClose}
          form={paymentForm}
          isUpdating={isUpdatingPaymentAccount}
          onSave={handlePaymentSave}
          defaultPaymentAccount={
            defaultPaymentAccount as
              | {
                  id: string;
                  gatewayType: string;
                  accountName: string;
                  isActive: boolean;
                  accountData?: Record<string, unknown> | null;
                }
              | undefined
          }
        />
      </div>
    </TooltipProvider>
  );
}

export default AccountPage;
