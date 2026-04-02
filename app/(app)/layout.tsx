import { redirect } from "next/navigation";
import { QueryProvider } from "@/providers/query-provider";
import { AppSidebar } from "@/features/dashboard/components/AppSidebar";
import { AppHeader } from "@/features/dashboard/components/AppHeader";
import { createClient } from "@/shared/lib/supabase/server";
import { prisma } from "@/shared/lib/prisma";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { onboardingDone: true, businessName: true, email: true },
  });

  if (!profile?.onboardingDone) redirect("/onboarding");

  const displayName =
    profile?.businessName ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "User";
  const displayEmail = profile?.email ?? user.email ?? "";
  const displayInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <QueryProvider>
      {/* Page canvas — padded on md+, full bleed on mobile */}
      <div className="min-h-dvh bg-(--surface-page) md:p-3">
        {/* Floating app shell — sidebar + content as separate panels */}
        <div className="flex h-dvh md:h-[calc(100dvh-24px)] md:gap-5">
          <AppSidebar
            user={{
              name: displayName,
              email: displayEmail,
              initials: displayInitials,
            }}
          />

          {/* Main area */}
          <div className="flex flex-1 flex-col overflow-hidden md:rounded-lg bg-(--surface-page)">
            <AppHeader />
            <main className="flex flex-1 flex-col overflow-y-auto bg-(--surface-page)">
              {children}
            </main>
          </div>
        </div>
      </div>
    </QueryProvider>
  );
}
