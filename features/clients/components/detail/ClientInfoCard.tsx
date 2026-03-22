'use client'

import { Mail, Phone, MapPin, Building2, Calendar, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { ClientWithInvoices } from '../../types'

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start gap-[var(--s3)]">
      <div className="mt-0.5 shrink-0 text-(--ink-300)">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase mb-0.5 text-(--ink-300) [font-family:var(--font-display)] tracking-[0.08em]">
          {label}
        </p>
        {value ? (
          <p className="text-sm break-words text-(--ink-900) [font-family:var(--font-body)]">{value}</p>
        ) : (
          <p className="text-sm italic text-(--ink-300) [font-family:var(--font-body)]">Not provided</p>
        )}
      </div>
    </div>
  )
}

export function ClientInfoCard({ client, onEdit, onDelete }: {
  client: ClientWithInvoices; onEdit: () => void; onDelete: () => void
}) {
  const address = [client.address, client.city, client.state, client.country].filter(Boolean).join(', ')

  return (
    <div className="rounded border overflow-hidden bg-(--surface-base) border-(--border-default)">
      <div className="p-[var(--s5)] border-b border-(--border-default) flex items-start justify-between gap-[var(--s3)]">
        <div className="flex items-center gap-[var(--s4)]">
          <div className="w-12 h-12 rounded flex items-center justify-center shrink-0 text-sm font-bold bg-(--blue-50) text-(--blue-600) [font-family:var(--font-display)] tracking-[-0.02em]">
            {getInitials(client.name)}
          </div>
          <div>
            <h3 className="font-bold leading-tight text-(--ink-900) [font-family:var(--font-display)] text-[17px] tracking-[-0.02em]">
              {client.name}
            </h3>
            {client.company && (
              <p className="text-sm mt-0.5 text-(--ink-400) [font-family:var(--font-body)]">{client.company}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-[var(--s2)] shrink-0">
          <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0 text-(--ink-400)">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit client</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 text-(--error)">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete client</span>
          </Button>
        </div>
      </div>

      <div className="p-[var(--s5)] space-y-[var(--s4)]">
        <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={client.email} />
        <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={client.phone} />
        <InfoRow icon={<Building2 className="h-4 w-4" />} label="Company" value={client.company} />
        <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={address || null} />
        <div className="border-t pt-[var(--s4)] border-(--border-default)">
          <InfoRow icon={<Calendar className="h-4 w-4" />} label="Client Since" value={formatDate(client.createdAt)} />
        </div>
      </div>
    </div>
  )
}
