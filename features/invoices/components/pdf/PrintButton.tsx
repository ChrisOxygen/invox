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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-display)',
        fontSize: size === 'sm' ? '13px' : '14px',
        fontWeight: 600,
        color: 'var(--ink-900)',
        background: 'transparent',
        border: '1px solid var(--border-strong)',
        borderRadius: '4px',
        padding: size === 'sm' ? '6px 12px' : '8px 16px',
        cursor: 'pointer',
        transition: 'background 200ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--surface-overlay)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      <Printer style={{ width: '14px', height: '14px' }} />
      Print
    </button>
  )
}
