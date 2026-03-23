'use client'

function MovingTextSection() {
  return (
    <section className="py-6 overflow-hidden bg-(--surface-page)">
      <div className="relative">
        <div
          className="flex items-center whitespace-nowrap font-display font-extrabold text-6xl sm:text-8xl lg:text-[9rem] xl:text-[11rem] text-(--ink-100) uppercase tracking-tighter select-none"
          style={{ animation: 'scroll-text 30s linear infinite', minWidth: '300%' }}
        >
          {['CASH FLOW.', 'ANALYTICS.', 'REMINDERS.', 'SPEED.'].flatMap((text) =>
            Array.from({ length: 3 }, (_, i) => (
              <span key={`${text}-${i}`} className="mr-16">
                {text}
              </span>
            ))
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll-text {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  )
}

export default MovingTextSection
