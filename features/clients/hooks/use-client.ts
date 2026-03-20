'use client'

import { useQuery } from '@tanstack/react-query'

export function useClient(id: string) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/clients/${id}`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error?.message ?? 'Failed to fetch client')
      }
      return res.json()
    },
    staleTime: 1000 * 60 * 2,
    enabled: Boolean(id),
  })
}
