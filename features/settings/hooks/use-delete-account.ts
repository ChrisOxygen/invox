'use client'

import { useMutation } from '@tanstack/react-query'

interface DeleteApiError extends Error {
  code?: string
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/v1/profile', {
        method: 'DELETE',
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const error: DeleteApiError = new Error(
          json?.error?.message ?? 'Failed to delete account'
        )
        error.code = json?.error?.code
        throw error
      }
      return res.json() as Promise<{ ok: true }>
    },
    onSuccess: () => {
      window.location.href = '/login'
    },
  })
}
