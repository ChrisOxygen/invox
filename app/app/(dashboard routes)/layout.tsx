"use client";

import InBoxLoader from "@/components/InBoxLoader";
import DashboardLayoutWI from "@/features/dashboard/components/DashboardLayoutWI";
import InvoiceLayout from "@/features/invoice/components/InvoiceLayout";
import { useUser } from "@/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isPending: gettingUser, isError } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isInvoiceFormRoute =
    pathname.includes("/app/invoices/create") || pathname.includes("/edit");

  // Handle redirect in useEffect to avoid render-time navigation
  useEffect(() => {
    if (!user?.onboardingCompleted && !gettingUser) {
      router.push("/app/welcome");
    }
  }, [user?.onboardingCompleted, gettingUser, router]);

  if (gettingUser) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Error loading user data</p>
      </div>
    );
  }

  // Return null while redirecting to prevent flash of content
  if (!user?.onboardingCompleted) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  if (isInvoiceFormRoute) {
    return <InvoiceLayout>{children}</InvoiceLayout>;
  }

  // If it's not the create invoice route, we render the main dashboard layout
  return <DashboardLayoutWI>{children}</DashboardLayoutWI>;
}

export default DashboardLayout;
