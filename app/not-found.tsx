'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-(--ink-950) font-sans flex flex-col items-center justify-center p-[var(--s6)] relative overflow-hidden">
      {/* Background grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(var(--ink-900) 1px, transparent 1px), linear-gradient(90deg, var(--ink-900) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--blue-600) 12%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-[1] flex flex-col items-center text-center gap-[var(--s6)] max-w-[480px]">
        {/* Logo mark */}
        <Link
          href="/"
          className="inline-flex items-center gap-[var(--s2)] no-underline mb-[var(--s4)]"
        >
          <span className="font-display font-bold text-[18px] text-(--ink-100) tracking-h3">
            invox
          </span>
        </Link>

        {/* 404 number */}
        <div
          className="font-mono font-medium leading-none tracking-display select-none"
          style={{
            fontSize: 'clamp(96px, 18vw, 160px)',
            color: 'transparent',
            backgroundImage:
              'linear-gradient(135deg, var(--blue-400) 0%, var(--blue-600) 50%, var(--ink-500) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          404
        </div>

        {/* Divider */}
        <div className="w-10 h-0.5 bg-(--blue-600) rounded-full" />

        {/* Heading */}
        <h1 className="font-display font-bold text-(--ink-50) tracking-h2 m-0" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>
          Page not found
        </h1>

        {/* Body */}
        <p className="font-sans text-[15px] leading-[1.6] text-(--ink-400) m-0">
          This page doesn&apos;t exist or may have been moved.
          <br />
          Head back to your dashboard to keep things moving.
        </p>

        {/* Actions */}
        <div className="flex gap-[var(--s3)] flex-wrap justify-center mt-[var(--s2)]">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-[var(--s2)] px-[var(--s5)] py-[10px] rounded-(--r-md) bg-(--blue-600) text-white font-display font-semibold text-[14px] no-underline transition-[background-color] duration-fast hover:bg-(--blue-700)"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="inline-flex items-center px-[var(--s5)] py-[10px] rounded-(--r-md) border border-(--ink-700) bg-transparent text-(--ink-300) font-display font-medium text-[14px] no-underline transition-[border-color,color] duration-fast hover:border-(--ink-500) hover:text-(--ink-100)"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer note */}
        <p className="font-mono text-[11px] text-(--ink-500) tracking-mono uppercase mt-[var(--s4)]">
          Error 404 · Page not found
        </p>
      </div>
    </div>
  )
}
