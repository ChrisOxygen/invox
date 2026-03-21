'use client'

import { useQuery } from '@tanstack/react-query'
import type { DashboardStats } from '../server/_get-dashboard-stats'

export type { DashboardStats }

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await fetch('/api/v1/dashboard/stats')
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error?.message ?? 'Failed to fetch dashboard stats')
      }
      return res.json()
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
