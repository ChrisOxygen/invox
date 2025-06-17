"use client";

import InBoxLoader from "@/components/InBoxLoader";
import { OnboardingProvider } from "@/features/onboarding/context/OnboardingProvider";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const hasBeenOnboarded = useRef<boolean | null>(null);
  const router = useRouter();

  const { user, isPending: gettingUser } = useUser();
  useEffect(() => {
    if (hasBeenOnboarded.current !== null) return;
    if (user && !gettingUser && user.onboardingCompleted) {
      router.push("/app/dashboard");
      return;
    }
    if (user && !gettingUser && !user.onboardingCompleted) {
      hasBeenOnboarded.current = false;
    }
  }, [user, gettingUser, router]);

  if (gettingUser) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  if (user && user.onboardingCompleted) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  return <OnboardingProvider>{children}</OnboardingProvider>;
}

export default OnboardingLayout;
