import { QueryProvider } from '@/providers/query-provider'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen" style={{ backgroundColor: 'var(--surface-page)' }}>
        {/* Sidebar will go here */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </QueryProvider>
  )
}
