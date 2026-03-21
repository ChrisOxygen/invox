import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — form */}
      <div
        className="relative flex flex-col w-full md:w-[45%] min-h-screen bg-[var(--surface-base)] px-8 py-10"
      >
        {/* Logo + back link */}
        <div className="flex items-center justify-between mb-auto">
          {/* Invox logo mark — 3 ascending cyan bars */}
          <svg
            width="28"
            height="24"
            viewBox="0 0 28 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="0" y="14" width="6" height="10" rx="2" fill="var(--blue-600)" />
            <rect x="11" y="7" width="6" height="17" rx="2" fill="var(--blue-600)" />
            <rect x="22" y="0" width="6" height="24" rx="2" fill="var(--cyan-400)" />
          </svg>
          <span
            className="text-[22px] font-[family-name:var(--font-display)] font-extrabold tracking-tight text-[var(--ink-900)]"
          >
            Invox<span className="text-[var(--blue-600)]">.</span>
          </span>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[12px] font-[family-name:var(--font-body)] text-[var(--ink-300)] hover:text-[var(--ink-500)] transition-colors duration-100"
          >
            <ArrowLeft className="w-3 h-3" />
            Home
          </Link>
        </div>

        {/* Form content */}
        <div className="flex flex-col justify-center flex-1 w-full max-w-[400px] mx-auto py-10">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6">
          <p
            className="text-[12px] font-[family-name:var(--font-body)] text-[var(--ink-300)] text-center"
          >
            &copy; {new Date().getFullYear()} Invox Technologies Ltd. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — brand showcase (hidden on mobile) */}
      <div
        className="hidden md:flex flex-col items-center justify-center flex-1 relative overflow-hidden bg-[var(--ink-950)]"
      >
        {/* Radial blue glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(23, 64, 245, 0.12) 0%, transparent 70%)',
          }}
        />

        {/* Floating invoice card */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-10">
          <div
            className="w-[340px] bg-[var(--surface-base)] rounded-lg p-6 shadow-2xl"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)' }}
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p
                  className="text-[11px] font-[family-name:var(--font-mono)] font-medium tracking-widest uppercase text-[var(--ink-300)] mb-1"
                >
                  Invoice
                </p>
                <p
                  className="text-[13px] font-[family-name:var(--font-mono)] font-medium text-[var(--blue-600)]"
                >
                  INV-2025-0042
                </p>
              </div>
              {/* SENT badge */}
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-[family-name:var(--font-body)] font-medium"
                style={{
                  background: 'rgba(0, 229, 245, 0.10)',
                  color: '#00B8C9',
                  border: '1px solid rgba(0, 229, 245, 0.18)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#00D4E8' }}
                />
                Sent
              </span>
            </div>

            {/* Client name */}
            <p
              className="text-[13px] font-[family-name:var(--font-body)] text-[var(--ink-400)] mb-1"
            >
              Billed to
            </p>
            <p
              className="text-[15px] font-[family-name:var(--font-display)] font-semibold text-[var(--ink-900)] mb-5"
            >
              Acme Corp
            </p>

            {/* Line items */}
            <div
              className="border-t border-[var(--border-default)] pt-4 mb-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[13px] font-[family-name:var(--font-body)] text-[var(--ink-500)]"
                >
                  Brand Identity Design
                </span>
                <span
                  className="text-[12px] font-[family-name:var(--font-mono)] font-medium text-[var(--ink-900)]"
                >
                  ₦250,000.00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-[13px] font-[family-name:var(--font-body)] text-[var(--ink-500)]"
                >
                  Website Development
                </span>
                <span
                  className="text-[12px] font-[family-name:var(--font-mono)] font-medium text-[var(--ink-900)]"
                >
                  ₦200,000.00
                </span>
              </div>
            </div>

            {/* Total amount */}
            <div
              className="border-t border-[var(--border-default)] pt-4 flex items-center justify-between"
            >
              <span
                className="text-[12px] font-[family-name:var(--font-display)] font-semibold uppercase tracking-widest text-[var(--ink-400)]"
              >
                Total
              </span>
              <span
                className="text-[26px] font-[family-name:var(--font-mono)] font-medium tracking-tight text-[var(--blue-600)]"
              >
                ₦450,000.00
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center">
            <p
              className="text-[20px] font-[family-name:var(--font-display)] font-semibold text-white leading-snug tracking-tight max-w-[280px]"
            >
              Professional invoices for Nigerian freelancers
            </p>
            <p
              className="mt-2 text-[13px] font-[family-name:var(--font-body)] text-[var(--ink-400)]"
            >
              Create, send, and track. Built for ₦.
            </p>
          </div>
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--ink-100) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
    </div>
  )
}
