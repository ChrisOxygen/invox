'use client'

import { Printer } from 'lucide-react'

export type PrintButtonProps = {
  size?: 'sm' | 'md'
}

export function PrintButton({ size = 'sm' }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex items-center gap-1.5 font-[family-name:var(--font-display)] font-semibold text-(--ink-900) bg-transparent border border-(--border-strong) rounded cursor-pointer transition-[background] duration-[200ms] ease-[ease] hover:bg-(--surface-overlay) ${size === 'sm' ? 'text-[13px] px-3 py-1.5' : 'text-[14px] px-4 py-2'}`}
    >
      <Printer className="w-[14px] h-[14px]" />
      Print
    </button>
  )
}
