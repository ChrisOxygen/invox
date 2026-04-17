# Invox — Invoice Management for Nigerian Freelancers

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

> Invoice management SaaS built for Nigerian freelancers and small businesses. Create branded PDF invoices, manage clients, and track payments — from draft to paid.

## Features

### Invoice Management

- **Invoice creation** — line items with quantity, unit price, and automatic totals
- **Tax & discount support** — percentage or fixed-amount tax and discount per invoice; supports WHT (Withholding Tax)
- **Status workflow** — Draft → Sent → Paid, with Partial, Overdue, and Cancelled states
- **Payment logging** — record multiple partial payments against a single invoice
- **Auto-generated invoice numbers** — `{PREFIX}-{YEAR}-{COUNT}` format (e.g. `INV-2025-0042`)
- **PDF generation** — server-side PDF rendering via `@react-pdf/renderer` with live browser preview
- **Public share links** — shareable token-based invoice URLs (`/i/[token]`) with 30-day expiry, no login required
- **Internal notes** — private notes visible only to the business owner

### Client Management

- **Client profiles** — name, email, phone, company, and full address
- **Soft deletes** — clients are archived, never hard-deleted
- **Client invoice history** — view all invoices and payment stats per client
- **Search & filter** — find clients by name or company

### Dashboard

- **Revenue stats** — total revenue, paid, pending, and overdue amounts
- **Invoice status distribution** — donut chart breakdown by status
- **Revenue trend** — monthly bar chart
- **Recent invoices** — quick-access list on the dashboard

### Business Settings

- **Business profile** — name, address, phone, email, website, TIN, RC Number
- **Logo upload** — stored in Supabase Storage
- **Brand color** — applied to PDF invoices
- **Invoice defaults** — default currency, invoice number prefix
- **Bank details** — displayed prominently on PDF invoices for bank transfer payments

### Onboarding

- **4-step wizard** — business profile → first client → invoice preview → bank details
- **Progress tracking** — resumable; redirects to dashboard once complete

### Authentication

- **Supabase Auth** — email/password sign-up and login
- **Password reset** — forgot password / reset password flow
- **Protected routes** — `proxy.ts` guards all dashboard routes; redirects unauthenticated users to login
- **Auth sync** — Supabase user is synced to a Prisma `Profile` row on first login

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase PostgreSQL via Prisma 7.x |
| Auth | Supabase Auth + Supabase SSR |
| PDF | @react-pdf/renderer 4.x |
| Data fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod v4 |
| Deployment | Vercel |

## Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (PostgreSQL + Auth)

### Setup

```bash
git clone https://github.com/ChrisOxygen/invox.git
cd invox
npm install

cp .env.example .env.local
# Fill in the required environment variables (see below)

npx prisma migrate dev
npx prisma generate

npm run dev
```

Visit `http://localhost:3000`.

### Environment Variables

```env
DATABASE_URL=           # Supabase pooled connection string
DIRECT_URL=             # Supabase direct connection (migrations only)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
```

## Project Structure

```
/
├── app/
│   ├── (marketing)/          # Public landing page
│   ├── (auth)/               # Login, register, forgot/reset password
│   ├── (app)/                # Protected dashboard (sidebar layout)
│   │   ├── dashboard/
│   │   ├── invoices/         # List, new, detail, preview
│   │   ├── clients/          # List, detail
│   │   └── settings/
│   ├── (onboarding)/         # Onboarding wizard
│   ├── api/v1/               # Versioned REST API routes
│   ├── auth/callback/        # Supabase OAuth callback
│   └── i/[token]/            # Public invoice share page
├── features/                 # Feature modules (auth, invoices, clients, dashboard, settings, onboarding)
├── shared/
│   ├── components/ui/        # shadcn/ui components (do not edit)
│   └── lib/                  # prisma, supabase clients, api-error, env, utils
├── prisma/
│   └── schema.prisma
├── prisma.config.ts
└── proxy.ts                  # Route protection (Next.js 16 middleware replacement)
```

## Development Commands

```bash
npm run dev                                   # start dev server
npm run build                                 # production build
npx tsc --noEmit                              # type check
npm run lint                                  # lint

npx prisma migrate dev --name <name>          # create + apply migration
npx prisma generate                           # regenerate client after schema changes
npx prisma studio                             # visual DB browser

npx shadcn@latest add <component>             # add shadcn component
```

## API Routes

All routes are under `/api/v1/` and require a valid Supabase session.

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/v1/auth/sync` | Upsert Prisma profile from Supabase session |
| `GET` | `/api/v1/invoices` | List invoices |
| `POST` | `/api/v1/invoices` | Create invoice |
| `GET` | `/api/v1/invoices/[id]` | Get invoice |
| `PATCH` | `/api/v1/invoices/[id]` | Update invoice |
| `DELETE` | `/api/v1/invoices/[id]` | Delete invoice |
| `GET` | `/api/v1/invoices/[id]/pdf` | Generate and return PDF |
| `GET` | `/api/v1/clients` | List clients |
| `POST` | `/api/v1/clients` | Create client |
| `GET` | `/api/v1/clients/[id]` | Get client |
| `PATCH` | `/api/v1/clients/[id]` | Update client |
| `DELETE` | `/api/v1/clients/[id]` | Soft-delete client |
| `GET` | `/api/v1/profile` | Get profile |
| `PATCH` | `/api/v1/profile` | Update profile |

---

Built by [ChrisOxygen](https://github.com/ChrisOxygen)
