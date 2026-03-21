'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ZUpdateProfile } from '@/features/settings/schemas'

interface ProfileApiError extends Error {
  code?: string
}

export function useUpdateProfile(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<ZUpdateProfile>) => {
      const res = await fetch('/api/v1/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const error: ProfileApiError = new Error(
          json?.error?.message ?? 'Failed to update profile'
        )
        error.code = json?.error?.code
        throw error
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      options?.onSuccess?.()
    },
  })
}
