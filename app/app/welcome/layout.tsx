"use client";

import InBoxLoader from "@/components/InBoxLoader";
import { OnboardingProvider } from "@/features/onboarding/context/OnboardingProvider";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const hasRedirected = useRef(false);
  const router = useRouter();
  const { user, isPending: gettingUser } = useUser();

  useEffect(() => {
    if (hasRedirected.current || gettingUser) return;

    if (user?.onboardingCompleted) {
      hasRedirected.current = true;
      // Add a small delay to prevent redirect loops
      setTimeout(() => {
        router.push("/app");
      }, 100);
    }
  }, [user?.onboardingCompleted, gettingUser, router]);
  if (gettingUser) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  // Show loader while redirecting completed users
  if (user?.onboardingCompleted) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  // User exists and needs onboarding
  return <OnboardingProvider>{children}</OnboardingProvider>;
}

export default OnboardingLayout;
