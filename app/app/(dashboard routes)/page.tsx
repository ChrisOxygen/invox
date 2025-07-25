"use client";

import { useUser } from "@/hooks/useUser";
import { DashboardLayout } from "@/features/dashboard/components";

function Dashboard() {
  const { user, isPending: gettingUser } = useUser();

  return (
    <DashboardLayout
      userName={user?.name || undefined}
      isLoading={gettingUser}
      // TODO: Add real metrics data when available
      // metrics={dashboardMetrics}
    />
  );
}

export default Dashboard;
