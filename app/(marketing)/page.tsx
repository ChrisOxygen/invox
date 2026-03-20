import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <style>{`
        .hero-root {
          position: relative;
          min-height: 100svh;
          background-color: var(--ink-950);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
        }

        /* Grain noise overlay */
        .hero-root::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.02;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px 128px;
        }

        /* Blue radial glow */
        .hero-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -52%);
          width: 640px;
          height: 480px;
          background: radial-gradient(ellipse at center, rgba(23, 64, 245, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--s8);
        }

        /* Icon mark */
        .hero-mark {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 32px;
          opacity: 0.9;
        }

        .hero-mark-bar {
          width: 7px;
          border-radius: 2px 2px 0 0;
          background-color: var(--cyan-400);
        }

        /* Wordmark */
        .hero-wordmark {
          font-family: var(--font-display);
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #ffffff;
          user-select: none;
        }

        .hero-wordmark-dot {
          color: var(--blue-600);
        }

        /* Button row */
        .hero-buttons {
          display: flex;
          align-items: center;
          gap: var(--s3);
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          padding: 10px 28px;
          border-radius: var(--r-md);
          cursor: pointer;
          text-decoration: none;
          transition: background-color var(--motion-base), border-color var(--motion-base), color var(--motion-base);
          white-space: nowrap;
        }

        .hero-btn-outline {
          background-color: transparent;
          border: 1px solid var(--border-strong);
          color: #ffffff;
        }

        .hero-btn-outline:hover {
          background-color: rgba(240, 240, 248, 0.08);
          border-color: var(--ink-200);
        }

        .hero-btn-filled {
          background-color: var(--blue-600);
          border: 1px solid transparent;
          color: #ffffff;
        }

        .hero-btn-filled:hover {
          background-color: var(--blue-700);
        }
      `}</style>

      <main className="hero-root">
        <div className="hero-glow" aria-hidden="true" />

        <div className="hero-content">
          {/* Bar-chart icon mark */}
          <div className="hero-mark" aria-hidden="true">
            <div className="hero-mark-bar" style={{ height: '14px' }} />
            <div className="hero-mark-bar" style={{ height: '22px' }} />
            <div className="hero-mark-bar" style={{ height: '32px' }} />
          </div>

          {/* Wordmark */}
          <h1 className="hero-wordmark">
            Invox<span className="hero-wordmark-dot">.</span>
          </h1>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <Link href="/login" className="hero-btn hero-btn-outline">
              Log in
            </Link>
            <Link href="/register" className="hero-btn hero-btn-filled">
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
