import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar'
import { QueryProvider } from '@/providers/query-provider'
import { AppSidebar } from '@/features/dashboard/components/AppSidebar'
import { AppHeader } from '@/features/dashboard/components/AppHeader'
import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  if (pathname !== '/onboarding') {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { onboardingDone: true },
    })

    if (!profile?.onboardingDone) redirect('/onboarding')
  }

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
