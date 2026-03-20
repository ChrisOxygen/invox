import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar'
import { QueryProvider } from '@/providers/query-provider'
import { AppSidebar } from '@/features/dashboard/components/AppSidebar'
import { AppHeader } from '@/features/dashboard/components/AppHeader'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main
            className="flex flex-1 flex-col gap-0 p-6"
            style={{ backgroundColor: 'var(--surface-page)' }}
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  )
}
