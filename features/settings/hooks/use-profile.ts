'use client'

import { useQuery } from '@tanstack/react-query'

export type ProfileData = {
  id: string
  businessName: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string | null
  phone: string | null
  email: string | null
  website: string | null
  logoUrl: string | null
  brandColor: string | null
  currency: string
  invoicePrefix: string
  taxNumber: string | null
  rcNumber: string | null
}

export function useProfile() {
  return useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/v1/profile')
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error?.message ?? 'Failed to fetch profile')
      }
      return res.json() as Promise<ProfileData>
    },
    staleTime: 1000 * 60, // 1 minute
  })
}
