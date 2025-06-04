import DashboardLayout from "@/features/dashboard/components/DashboardLayout";

function layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default layout;
