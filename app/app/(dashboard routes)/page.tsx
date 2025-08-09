"use client";

import { useUser } from "@/hooks/useUser";
import { DashboardLayout } from "@/features/dashboard/components";

function Dashboard() {
  const { user, isPending: gettingUser } = useUser();

  return (
    <DashboardLayout
      userName={user?.name || undefined}
      isLoading={gettingUser}
    />
  );
}

export default Dashboard;
