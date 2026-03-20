'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ZCreateClient } from '../schemas'

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ZCreateClient) => {
      const res = await fetch('/api/v1/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        const err = new Error(json.error?.message ?? 'Failed to create client') as Error & { code?: string }
        err.code = json.error?.code
        throw err
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
