import { FileText, BellRing, Landmark, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { RevealOnScroll } from "../RevealOnScroll";

const FEATURES = [
  {
    icon: FileText,
    label: "Invoice in Seconds",
    description: "Create polished, branded invoices in under a minute.",
  },
  {
    icon: BellRing,
    label: "Automated Follow-ups",
    description:
      "Stop chasing clients manually. Smart reminders go out at exactly the right time — without you lifting a finger.",
  },
  {
    icon: Landmark,
    label: "Built for Bank Transfers",
    description:
      "Your account details sit prominently on every invoice. Designed for how Nigeria actually pays — no PayPal required.",
  },
  {
    icon: ShieldCheck,
    label: "Track Every Payment",
    description: "Paid, pending, or overdue — always at a glance.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-(--surface-page) overflow-hidden">
      <div className="content-wrapper flex flex-col gap-14">
        {/* Header */}
        <RevealOnScroll className="flex flex-col items-center text-center gap-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-(--border-default) bg-(--surface-base) text-xs font-semibold text-(--ink-400) uppercase tracking-widest font-display">
            <span className="w-1.5 h-1.5 rounded-full bg-(--blue-500)" />
            Why Invox?
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[38px] text-(--ink-900) leading-tight tracking-[-0.03em] max-w-2xl">
            The invoice tool built{" "}
            <span className="text-(--blue-600) italic">for how you work</span>
          </h2>
          <p className="text-base text-(--ink-400) leading-relaxed font-body max-w-xl">
            Nigerian freelancers and small businesses deserve tools that
            understand their workflow — not generic software designed for
            someone else.
          </p>
        </RevealOnScroll>

        {/* Body — image + feature grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5 items-stretch">
          {/* Left — image */}
          <RevealOnScroll className="h-full min-h-120">
            <div className="relative h-full min-h-120 rounded-2xl overflow-hidden border border-(--border-default) bg-(--surface-overlay)">
              <Image
                src="/assets/lady-typing.png"
                alt="A freelancer using Invox to manage invoices"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </RevealOnScroll>

          {/* Right — 3-col grid: narrow|wide then wide|narrow (stacks on mobile, 2-col on sm, asymmetric on lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              const isWide = i === 1 || i === 2; // second and third cards span 2 cols on lg
              const isAccent = i === 1;

              return (
                <RevealOnScroll
                  key={i}
                  delay={i * 70}
                  className={`${isWide ? "sm:col-span-1 lg:col-span-2" : "col-span-1"} h-full`}
                >
                  <div
                    className={[
                      "flex flex-col gap-4 p-6 h-full rounded-2xl border transition-all duration-200 group",
                      isAccent
                        ? "bg-(--blue-50) border-(--blue-100) hover:border-(--blue-300)"
                        : "bg-(--surface-base) border-(--border-default) hover:border-(--blue-200) hover:bg-(--surface-raised)",
                    ].join(" ")}
                  >
                    {/* Icon */}
                    <div
                      className={[
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200",
                        isAccent
                          ? "bg-(--blue-100) text-(--blue-700) group-hover:bg-(--blue-600) group-hover:text-white"
                          : "bg-(--surface-overlay) text-(--ink-400) group-hover:bg-(--blue-600) group-hover:text-white",
                      ].join(" ")}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Label */}
                    <span
                      className={[
                        "text-[10px] font-bold uppercase tracking-widest font-display",
                        isAccent ? "text-(--blue-700)" : "text-(--ink-300)",
                      ].join(" ")}
                    >
                      {feature.label}
                    </span>

                    {/* Description */}
                    <p
                      className={[
                        "text-sm leading-relaxed font-body font-medium",
                        isAccent ? "text-(--ink-700)" : "text-(--ink-500)",
                      ].join(" ")}
                    >
                      {feature.description}
                    </p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
