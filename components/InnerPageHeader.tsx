import ExternalNavMenu from '@/components/ExternalNavMenu'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface InnerPageHeaderProps {
  title: string
  description?: string
  breadcrumb?: string
}

export default function InnerPageHeader({
  title,
  description,
  breadcrumb,
}: InnerPageHeaderProps) {
  return (
    <section className="bg-(--ink-950) grid grid-rows-[80px_1fr] w-full relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] bg-[url('/assets/shape-grid-top.svg')] bg-size-[600px] bg-repeat" />
      <ExternalNavMenu />
      <div className="relative z-10 content-wrapper pt-8 pb-16 flex flex-col justify-center">
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-xs text-(--ink-500) mb-6 font-body">
            <Link
              href="/"
              className="hover:text-(--ink-300) transition-colors duration-200"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-(--ink-300)">{breadcrumb}</span>
          </div>
        )}
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-[-0.03em] mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-base text-(--ink-300) leading-relaxed font-body max-w-140">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
