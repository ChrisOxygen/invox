"use client";

import InBoxLoader from "@/components/InBoxLoader";
import { OnboardingProvider } from "@/features/onboarding/context/OnboardingProvider";
import { useUser } from "@/hooks/useUser";
import React from "react";

function ProtectedRouteLayout({ children }: { children: React.ReactNode }) {
  const { isPending: gettingUser } = useUser();

  if (gettingUser) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  return (
    <>
      <OnboardingProvider>{children}</OnboardingProvider>
    </>
  );
}

export default ProtectedRouteLayout;
