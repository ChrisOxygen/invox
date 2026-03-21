'use client'

import { useMutation } from '@tanstack/react-query'
import type { ZUpdatePassword } from '@/features/settings/schemas'

interface PasswordApiError extends Error {
  code?: string
}

export function useUpdatePassword(options?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: async (data: ZUpdatePassword) => {
      const res = await fetch('/api/v1/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const error: PasswordApiError = new Error(
          json?.error?.message ?? 'Failed to update password'
        )
        error.code = json?.error?.code
        throw error
      }
      return res.json() as Promise<{ ok: true }>
    },
    onSuccess: () => {
      options?.onSuccess?.()
    },
  })
}
