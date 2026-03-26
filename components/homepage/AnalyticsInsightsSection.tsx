import {
  TrendingUp,
  ArrowUpRight,
  Eye,
  Zap,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import { RevealOnScroll } from "../RevealOnScroll";

// ─── mock data ────────────────────────────────────────────────────────────────

const BARS = [
  { month: "Jan", pct: 24 },
  { month: "Feb", pct: 38 },
  { month: "Mar", pct: 31 },
  { month: "Apr", pct: 55 },
  { month: "May", pct: 75 },
  { month: "Jun", pct: 100 },
];

const RECENT = [
  { id: "INV-2025-0089", client: "Yakubu & Partners",  amount: "₦1,200,000", status: "PAID"    },
  { id: "INV-2025-0088", client: "Fatima Enterprises", amount: "₦850,000",   status: "PENDING" },
  { id: "INV-2025-0087", client: "Lagos Tech Hub",     amount: "₦2,100,000", status: "OVERDUE" },
];

const STATUS_META = {
  PAID:    { icon: CheckCircle2,  label: "Paid",    cls: "text-(--success)" },
  PENDING: { icon: Clock3,        label: "Pending", cls: "text-(--warning)" },
  OVERDUE: { icon: AlertTriangle, label: "Overdue", cls: "text-(--error)"   },
} as const;

// ─── left feature bullets ─────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Cash flow forecasting",
    desc: "See projected revenue 3 months ahead, based on your real invoicing history.",
  },
  {
    icon: Eye,
    title: "Client performance view",
    desc: "Spot your highest-value clients and flag who consistently pays late.",
  },
  {
    icon: Zap,
    title: "Instant overdue alerts",
    desc: "Get notified the moment an invoice crosses its due date — before it becomes a problem.",
  },
];

// ─── component ────────────────────────────────────────────────────────────────

export default function AnalyticsInsightsSection() {
  return (
    <section className="bg-(--surface-base) py-16 lg:py-24 overflow-hidden">
      <div className="content-wrapper grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* ── Left: text ── */}
        <RevealOnScroll className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
                Smart Business Intelligence
              </span>
              <h2 className="font-display font-extrabold text-3xl lg:text-[38px] text-(--ink-900) leading-tight tracking-[-0.03em]">
                Your finances,{" "}
                <span className="text-(--blue-600) italic">crystal clear</span>
              </h2>
            </div>
            <p className="text-base text-(--ink-400) leading-relaxed font-body max-w-md">
              Invox turns every invoice into a data point. Understand exactly
              where your money is, which clients are worth keeping, and when
              your next payment lands — without opening a spreadsheet.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-lg bg-(--blue-50) border border-(--blue-100) flex items-center justify-center text-(--blue-600) shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-display font-bold text-sm text-(--ink-900) tracking-[-0.015em]">
                      {f.title}
                    </h4>
                    <p className="text-sm text-(--ink-400) leading-relaxed font-body">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </RevealOnScroll>

        {/* ── Right: overlapping dashboard mockup ── */}
        <RevealOnScroll delay={150} className="relative">

          {/* ── Revenue Overview card ── */}
          <div className="relative z-10 bg-(--surface-base) border border-(--border-default) rounded-2xl p-5 flex flex-col gap-5 shadow-sm">

            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-(--ink-300) uppercase tracking-widest font-display">
                  Revenue Overview
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span
                    className="text-2xl font-medium text-(--ink-900)"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    ₦22,434,800
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-(--success)">
                    <ArrowUpRight className="w-3 h-3" />
                    23.4%
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-(--ink-300) font-body bg-(--surface-overlay) px-2.5 py-1 rounded-full border border-(--border-default) shrink-0 mt-1">
                Jan – Jun 2025
              </span>
            </div>

            {/* Bar chart */}
            <div className="flex flex-col gap-2">
              <svg
                viewBox="0 0 256 80"
                className="w-full h-32"
                preserveAspectRatio="none"
                aria-hidden
              >
                {BARS.map((bar, i) => {
                  const barW = 36;
                  const gap = 8;
                  const x = i * (barW + gap);
                  const barH = (bar.pct / 100) * 80;
                  const isCurrent = i === BARS.length - 1;
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={80 - barH}
                      width={barW}
                      height={barH}
                      rx="4"
                      fill={isCurrent ? "var(--blue-600)" : "var(--blue-100)"}
                    />
                  );
                })}
              </svg>
              <div className="flex gap-2">
                {BARS.map((bar, i) => (
                  <span
                    key={i}
                    className={[
                      "flex-1 text-center text-[10px] font-medium font-body",
                      i === BARS.length - 1 ? "text-(--blue-600)" : "text-(--ink-300)",
                    ].join(" ")}
                  >
                    {bar.month}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Outstanding badge — overlaps downward out of this card ── */}
            <div className="absolute -bottom-6 right-6 z-20 bg-(--surface-base) border border-(--border-default) rounded-2xl px-4 py-2.5 shadow-sm flex flex-col gap-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-(--ink-300) font-display">
                Outstanding
              </span>
              <span
                className="text-sm font-semibold text-(--warning)"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ₦15,470,250
              </span>
            </div>
          </div>

          {/* ── Bottom row — mt-10 reveals the overlapping Outstanding badge ── */}
          <div className="mt-10 grid grid-cols-2 gap-4">

            {/* Invoice Pipeline card — "188 invoices" pill overlaps the top edge */}
            <div className="relative">
              <div className="absolute -top-3 left-4 z-20 inline-flex items-center gap-1 bg-(--blue-600) text-white rounded-full px-2.5 py-1">
                <span className="text-[10px] font-bold font-display tracking-wide">
                  188 invoices
                </span>
              </div>
              <div className="bg-(--surface-base) border border-(--border-default) rounded-2xl pt-7 px-5 pb-5 flex flex-col gap-4">
                <span className="text-xs font-semibold text-(--ink-300) uppercase tracking-widest font-display">
                  Invoice Pipeline
                </span>

                <div className="flex flex-col gap-2.5">
                  {(
                    [
                      { status: "PAID",    count: 168 },
                      { status: "PENDING", count: 12  },
                      { status: "OVERDUE", count: 8   },
                    ] as const
                  ).map(({ status, count }) => {
                    const meta = STATUS_META[status];
                    const Icon = meta.icon;
                    return (
                      <div key={status} className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${meta.cls}`} />
                        <span className="text-xs font-medium text-(--ink-500) font-body flex-1">
                          {meta.label}
                        </span>
                        <span
                          className={`text-xs font-semibold ${meta.cls}`}
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Stacked progress bar */}
                <div className="flex rounded-full overflow-hidden h-1.5 gap-px">
                  <div className="bg-(--success)" style={{ width: "89%" }} />
                  <div className="bg-(--warning)" style={{ width: "6%" }} />
                  <div className="bg-(--error)" style={{ width: "5%" }} />
                </div>
              </div>
            </div>

            {/* Recent Activity card */}
            <div className="bg-(--surface-base) border border-(--border-default) rounded-2xl p-5 flex flex-col gap-4">
              <span className="text-xs font-semibold text-(--ink-300) uppercase tracking-widest font-display">
                Recent Activity
              </span>

              <div className="flex flex-col gap-3">
                {RECENT.map((inv) => {
                  const meta = STATUS_META[inv.status as keyof typeof STATUS_META];
                  return (
                    <div key={inv.id} className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-[11px] font-medium text-(--blue-600) truncate"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {inv.id}
                        </span>
                        <span className={`text-[10px] font-bold font-display uppercase shrink-0 ${meta.cls}`}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-(--ink-400) font-body truncate">
                          {inv.client}
                        </span>
                        <span
                          className="text-[11px] font-medium text-(--ink-700) shrink-0"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {inv.amount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
