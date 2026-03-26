'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--ink-950)',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--s6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--ink-900) 1px, transparent 1px), linear-gradient(90deg, var(--ink-900) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.5,
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--blue-600) 12%, transparent) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--s6)',
          maxWidth: '480px',
        }}
      >
        {/* Logo mark */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--s2)',
            textDecoration: 'none',
            marginBottom: 'var(--s4)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '18px',
              color: 'var(--ink-100)',
              letterSpacing: '-0.02em',
            }}
          >
            invox
          </span>
        </Link>

        {/* 404 number */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(96px, 18vw, 160px)',
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: 'transparent',
            backgroundImage:
              'linear-gradient(135deg, var(--blue-400) 0%, var(--blue-600) 50%, var(--ink-500) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            userSelect: 'none',
          }}
        >
          404
        </div>

        {/* Divider */}
        <div
          style={{
            width: '40px',
            height: '2px',
            backgroundColor: 'var(--blue-600)',
            borderRadius: '999px',
          }}
        />

        {/* Heading */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(20px, 4vw, 28px)',
            letterSpacing: '-0.025em',
            color: 'var(--ink-50)',
            margin: 0,
          }}
        >
          Page not found
        </h1>

        {/* Body */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: '15px',
            lineHeight: 1.6,
            color: 'var(--ink-400)',
            margin: 0,
          }}
        >
          This page doesn&apos;t exist or may have been moved.
          <br />
          Head back to your dashboard to keep things moving.
        </p>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--s3)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 'var(--s2)',
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--s2)',
              padding: '10px var(--s5)',
              borderRadius: 'var(--r-md)',
              backgroundColor: 'var(--blue-600)',
              color: '#ffffff',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'background-color var(--motion-fast)',
            }}
            onMouseOver={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                'var(--blue-700)')
            }
            onMouseOut={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                'var(--blue-600)')
            }
          >
            Go to Dashboard
          </Link>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px var(--s5)',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--ink-700)',
              backgroundColor: 'transparent',
              color: 'var(--ink-300)',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'border-color var(--motion-fast), color var(--motion-fast)',
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--ink-500)'
              el.style.color = 'var(--ink-100)'
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--ink-700)'
              el.style.color = 'var(--ink-300)'
            }}
          >
            Back to Home
          </Link>
        </div>

        {/* Footer note */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--ink-500)',
            letterSpacing: '0.08em',
            marginTop: 'var(--s4)',
            textTransform: 'uppercase',
          }}
        >
          Error 404 · Page not found
        </p>
      </div>
    </div>
  )
}
