import { useState } from "react";

export function useAccountModals() {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isEditBusinessModalOpen, setIsEditBusinessModalOpen] = useState(false);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);

  const openLogoModal = () => setIsLogoModalOpen(true);
  const closeLogoModal = () => setIsLogoModalOpen(false);

  const openSignatureModal = () => setIsSignatureModalOpen(true);
  const closeSignatureModal = () => setIsSignatureModalOpen(false);

  const openEditBusinessModal = () => setIsEditBusinessModalOpen(true);
  const closeEditBusinessModal = () => setIsEditBusinessModalOpen(false);

  const openEditPaymentModal = () => setIsEditPaymentModalOpen(true);
  const closeEditPaymentModal = () => setIsEditPaymentModalOpen(false);

  return {
    // Logo modal
    isLogoModalOpen,
    openLogoModal,
    closeLogoModal,

    // Signature modal
    isSignatureModalOpen,
    openSignatureModal,
    closeSignatureModal,

    // Business edit modal
    isEditBusinessModalOpen,
    openEditBusinessModal,
    closeEditBusinessModal,

    // Payment edit modal
    isEditPaymentModalOpen,
    openEditPaymentModal,
    closeEditPaymentModal,
  };
}
