'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ZUpdateClient } from '../schemas'

export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ZUpdateClient) => {
      const { id, ...rest } = data
      const res = await fetch(`/api/v1/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      })
      if (!res.ok) {
        const json = await res.json()
        const err = new Error(json.error?.message ?? 'Failed to update client') as Error & { code?: string }
        err.code = json.error?.code
        throw err
      }
      return res.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', variables.id] })
    },
  })
}
