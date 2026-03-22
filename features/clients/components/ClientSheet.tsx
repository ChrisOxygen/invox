'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/shared/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'

import { ZCreateClientSchema } from '../schemas'
import type { ZCreateClient } from '../schemas'
import type { ClientWithStats, ClientWithInvoices } from '../types'

type AnyClient = ClientWithStats | ClientWithInvoices
import { useCreateClient } from '../hooks/use-create-client'
import { useUpdateClient } from '../hooks/use-update-client'

export type ClientSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: AnyClient | null
  onSuccess?: () => void
}

export function ClientSheet({ open, onOpenChange, client = null, onSuccess }: ClientSheetProps) {
  const isEditing = Boolean(client)
  const [showAddress, setShowAddress] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState(false)

  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<ZCreateClient>({
    resolver: zodResolver(ZCreateClientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      country: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        ...(isEditing && client ? { id: client.id } : {}),
        name: client?.name ?? '',
        email: client?.email ?? '',
        phone: client?.phone ?? '',
        company: client?.company ?? '',
        address: client?.address ?? '',
        city: client?.city ?? '',
        state: client?.state ?? '',
        country: client?.country ?? '',
      })
      setDuplicateWarning(false)
      setShowAddress(Boolean(client?.address || client?.city || client?.state))
    }
  }, [open, client]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (values: ZCreateClient) => {
    setDuplicateWarning(false)
    try {
      if (isEditing && client) {
        const result = await updateMutation.mutateAsync({ ...values, id: client.id })
        if (result.warning === 'duplicate_email') setDuplicateWarning(true)
        toast.success('Client updated')
      } else {
        const result = await createMutation.mutateAsync(values)
        if (result.warning === 'duplicate_email') setDuplicateWarning(true)
        toast.success('Client added')
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto p-0 sm:max-w-[480px] bg-(--surface-base)"
      >
        <SheetHeader
          className="border-b px-6 py-5 border-(--border-default)"
        >
          <SheetTitle className="[font-family:var(--font-display)] text-(--ink-900) tracking-[-0.02em]">
            {isEditing ? 'Edit Client' : 'Add Client'}
          </SheetTitle>
          <SheetDescription className="[font-family:var(--font-body)] text-(--ink-400)">
            {isEditing ? 'Update the client information below.' : 'Fill in the details to create a new client.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
            <div className="flex-1 space-y-6 px-6 py-6">

              {/* Duplicate email warning */}
              {duplicateWarning && (
                <div className="flex items-start gap-3 rounded px-4 py-3 bg-[#FFF7EA] border-l-[3px] border-l-(--warning)">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-(--warning)" />
                  <p className="text-xs leading-relaxed text-[#B57200] [font-family:var(--font-body)]">
                    A client with this email already exists. You can still save.
                  </p>
                </div>
              )}

              {/* Section 1: Contact Details */}
              <div className="space-y-4">
                <p className="text-sm font-semibold [font-family:var(--font-display)] text-(--ink-900)">
                  Contact Details
                </p>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold uppercase [font-family:var(--font-display)] text-(--ink-400) tracking-[0.08em]">
                        Name *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Acme Technologies Ltd." disabled={isPending} className="[font-family:var(--font-body)]" />
                      </FormControl>
                      <FormMessage className="text-xs text-(--error)" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold uppercase [font-family:var(--font-display)] text-(--ink-400) tracking-[0.08em]">
                        Company
                      </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} placeholder="Company or organization (optional)" disabled={isPending} className="[font-family:var(--font-body)]" />
                      </FormControl>
                      <FormMessage className="text-xs text-(--error)" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold uppercase [font-family:var(--font-display)] text-(--ink-400) tracking-[0.08em]">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            type="email"
                            placeholder="billing@client.com"
                            disabled={isPending}
                            className="[font-family:var(--font-body)]"
                            onChange={(e) => { field.onChange(e); if (duplicateWarning) setDuplicateWarning(false) }}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-(--error)" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold uppercase [font-family:var(--font-display)] text-(--ink-400) tracking-[0.08em]">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} placeholder="+234 800 000 0000" disabled={isPending} className="[font-family:var(--font-body)]" />
                        </FormControl>
                        <FormMessage className="text-xs text-(--error)" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="bg-(--border-default)" />

              {/* Section 2: Address (collapsible) */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowAddress((v) => !v)}
                  className="flex w-full items-center justify-between"
                  aria-expanded={showAddress}
                >
                  <p className="text-sm font-semibold [font-family:var(--font-display)] text-(--ink-900)">
                    Address Details
                  </p>
                  <span className="text-(--ink-400)">
                    {showAddress ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                {showAddress && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-semibold uppercase [font-family:var(--font-display)] text-(--ink-400) tracking-[0.08em]">
                            Street Address
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} value={field.value ?? ''} placeholder="14 Broad Street, Victoria Island..." rows={2} className="resize-none [font-family:var(--font-body)]" disabled={isPending} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold uppercase [font-family:var(--font-display)] text-(--ink-400) tracking-[0.08em]">
                              City
                            </FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value ?? ''} placeholder="Lagos" disabled={isPending} className="[font-family:var(--font-body)]" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold uppercase [font-family:var(--font-display)] text-(--ink-400) tracking-[0.08em]">
                              State
                            </FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value ?? ''} placeholder="Lagos State" disabled={isPending} className="[font-family:var(--font-body)]" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-semibold uppercase [font-family:var(--font-display)] text-(--ink-400) tracking-[0.08em]">
                            Country
                          </FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ''} placeholder="Nigeria" disabled={isPending} className="[font-family:var(--font-body)]" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            <SheetFooter className="flex-row gap-3 border-t px-6 py-4 border-(--border-default)">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="flex-1 [font-family:var(--font-display)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 [font-family:var(--font-display)] bg-(--blue-600)"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  'Save Changes'
                ) : (
                  'Add Client'
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
