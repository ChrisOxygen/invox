# Invox v2

Invoice management SaaS for Nigerian freelancers and small businesses. Users create a business profile, add clients, and generate branded, professional PDF invoices tracked from draft to paid. Built mobile-first with the Nigerian market as the primary audience — NGN default, bank transfer focus, WhatsApp sharing.

## Tech Stack

- **Next.js 16.2** · App Router · TypeScript strict mode
- **Tailwind CSS v4** · shadcn/ui (CLI v3.8.5)
- **Prisma ORM 7.x** → Supabase PostgreSQL
- **Supabase Auth** + Supabase SSR (auth only — all data queries go through Prisma)
- **@react-pdf/renderer 4.x** · Invoice PDF generation
- **Vercel AI SDK v6** (`ai`) + `@ai-sdk/openai` · streaming (if applicable)
- **TanStack Query v5** · React Hook Form · Zod v4
- **PostHog** (analytics) · **Stripe** (billing, if applicable)
- **Vercel** deployment

## Commands

```bash
npm run dev                                   # start dev server
npm run build                                 # production build
npx tsc --noEmit                              # type check
npm run lint                                  # lint

npx prisma migrate dev --name <name>          # create + apply migration
npx prisma generate                           # regenerate client after schema changes
npx prisma studio                             # visual DB browser

npx shadcn@latest add <component>             # add shadcn component
npx shadcn@latest add button input form label select dialog sheet tabs card badge table skeleton avatar dropdown-menu popover separator
```

## Naming Conventions

- **Zod schemas + inferred types** → prefix with capital `Z`
  - e.g. `ZCreateInvoiceSchema`, `ZCreateInvoice`, `ZCreateClientSchema`
- **Server-only functions** (API route handlers, Prisma queries) → prefix with `_`
  - e.g. `_getInvoicesByProfileId`, `_createInvoice`, `_getClientById`
- **Components** → PascalCase (`InvoiceStatusBadge`, `ClientForm`)
- **Hooks** → camelCase prefixed with `use` (`useInvoices`, `useCreateInvoice`)
- **TanStack Query keys** → `['resource', identifier]`
  - e.g. `['invoices', profileId]`, `['invoice', invoiceId]`, `['clients', { search, page }]`
- **File names** → `kebab-case.ts` for utilities/actions/hooks, `PascalCase.tsx` for components
- **Named exports only** — no default exports except Next.js pages and layouts

## Folder Structure

Feature-based. No `src/` directory. All app code at project root. Cross-feature code in `shared/`. New features in `features/<feature>/` with sub-folders: `components/`, `hooks/`, `schemas/`, `server/`, `types.ts`, `constants/`.

```
/
├── app/                              # Next.js App Router
│   ├── (marketing)/                  # Public landing page — no auth
│   │   └── page.tsx
│   ├── (auth)/                       # Login, register, reset — no sidebar
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (app)/                        # Protected dashboard — requires auth
│   │   ├── layout.tsx                # sidebar + auth guard
│   │   ├── onboarding/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── invoices/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── preview/page.tsx
│   │   ├── clients/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── settings/page.tsx
│   ├── api/v1/                       # Versioned REST API route handlers
│   │   ├── auth/sync/route.ts        # POST — upsert Prisma User from Supabase session
│   │   ├── [resource]/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   └── [id]/route.ts         # GET (one), PATCH (update), DELETE
│   │   └── invoices/[id]/pdf/route.ts # PDF generation
│   ├── auth/callback/route.ts        # Supabase OAuth code exchange
│   ├── i/[token]/page.tsx            # Public invoice share — no auth required
│   └── layout.tsx                    # root layout
│
├── features/                         # feature modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   └── server/                   # _prefixed server functions
│   ├── onboarding/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   └── server/
│   ├── invoices/
│   │   ├── components/
│   │   │   ├── form/                 # InvoiceForm, LineItemRow, TotalsPanel
│   │   │   ├── list/                 # InvoiceTable, InvoiceFilters, InvoiceStatusBadge
│   │   │   ├── detail/               # InvoiceDetail, PaymentLog, ActionsToolbar
│   │   │   └── pdf/                  # InvoicePDF, PDFPreview, DownloadButton
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── server/
│   │   └── types.ts
│   ├── clients/
│   ├── dashboard/
│   └── settings/
│
├── shared/
│   ├── components/
│   │   └── ui/                       # shadcn/ui — DO NOT edit manually
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma singleton client (PrismaPg adapter)
│   │   ├── supabase/
│   │   │   ├── server.ts             # createClient() — Server Components + API routes
│   │   │   ├── client.ts             # createClient() — browser
│   │   │   ├── middleware.ts         # createMiddlewareClient() — used in proxy.ts
│   │   │   └── admin.ts              # createAdminClient() — service role (use sparingly)
│   │   ├── api-error.ts              # apiError(), apiValidationError(), AppError, NotFoundError
│   │   ├── env.ts                    # Zod-validated env vars
│   │   └── utils.ts                  # cn() and shared utilities
│   └── types/                        # global shared types
│
├── providers/
│   ├── query-provider.tsx            # TanStack QueryClientProvider (wraps root layout)
│   └── posthog-provider.tsx          # PostHog analytics provider (if applicable)
├── proxy.ts                          # protects /(app) routes (Next.js 16: middleware → proxy)
├── prisma/
│   └── schema.prisma
└── prisma.config.ts                  # Prisma 7 config at project root (replaces datasource block in schema.prisma)
```

## Version-Specific Notes

### Next.js 16.2
- `params` and `searchParams` in layouts and pages are **async** — always `await props.params`
- **`middleware.ts` is deprecated** — renamed to `proxy.ts`. The exported function is renamed from `middleware` to `proxy`. Use `proxy.ts` at the project root. `middleware.ts` still works but emits a deprecation warning.
- Turbopack is the default bundler — no extra config needed
- React Compiler is stable — no manual `useMemo`/`useCallback` needed in most cases
- Use `'use cache'` directive for caching, NOT `fetch` cache options
- Use `npx @next/codemod@canary upgrade latest` to upgrade between versions

```typescript
// proxy.ts — NOT middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/shared/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabase, supabaseResponse } = createMiddlewareClient(request)

  // Refresh session on every request
  const { data: { user } } = await supabase.auth.getUser()

  // Protect authenticated routes
  if (!user && (pathname.startsWith('/(app)') || pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect signed-in users away from auth pages
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

```typescript
// Page props — always await params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

### Prisma 7.x
- Ships as **ES module** — imports use `import`, not `require`
- Database config moves to **`prisma.config.ts`** at the project root instead of inline `datasource` block in `schema.prisma`
- Run `npx prisma generate` after **every** schema or config change — the client will silently be out of sync otherwise
- MongoDB is not supported in Prisma 7 — PostgreSQL only (Supabase)
- Prisma model types import from `@/shared/lib/generated/prisma/models`
- `DATABASE_URL` = Supabase pooled connection (for app queries); `DIRECT_URL` = Supabase direct connection (for migrations only)

```typescript
// prisma.config.ts (project root)
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    url: process.env['DIRECT_URL'], // Direct URL for migrations only
  },
})
```

**Prisma singleton (shared/lib/prisma.ts):**
```typescript
import { PrismaClient } from '@/shared/lib/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'

const createPrismaClient = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    max: 1, // 1 connection per serverless instance
  })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}
export const prisma = globalForPrisma.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Zod v4
- `z.string().nonempty()` → **use `z.string().min(1)`**
- `z.string().email()` → **use `z.email()`** (top-level shortcut)
- `z.string().url()` → **use `z.url()`**
- `.parse()` and `.safeParse()` work the same

### shadcn/ui
- Use `npx shadcn@latest add <component>` — NOT the old `npx shadcn-ui`
- Tailwind v4 is the default in new projects — config is in `globals.css`, not `tailwind.config.ts`
- Components live in `shared/components/ui/` — **never edit them directly**

### TanStack Query v5
- Single object argument only: `useQuery({ queryKey: [...], queryFn: ... })`
- `cacheTime` renamed to `gcTime`
- `onSuccess`/`onError`/`onSettled` removed from `useQuery` — move side effects to `useEffect` or mutation callbacks
- Use `isPending` (not `isLoading`) as the loading indicator for both queries and mutations
- **Always create a custom hook** for every query or mutation — never call `useQuery`/`useMutation` directly in a component
  - Query hooks → `features/<feature>/hooks/use-<resource>.ts` e.g. `useInvoices`
  - Mutation hooks → `features/<feature>/hooks/use-<verb>-<resource>.ts` e.g. `useCreateInvoice`
- Render an inline skeleton when `isPending` is true — never return `null`

## Architecture

### Auth Flow
Supabase manages sessions. `proxy.ts` protects `/(app)` routes via `createMiddlewareClient()`. All API routes extract `userId` from the Supabase session — never from request body or URL params.

1. User signs in/up → Supabase handles credentials → sets session cookie
2. OAuth: `app/auth/callback/route.ts` exchanges code → calls `POST /api/v1/auth/sync`
3. `auth/sync` route upserts the Prisma profile row: `prisma.profile.upsert({ where: { id: user.id }, ... })`
4. All subsequent data requests use `user.id` extracted from session

**Auth Sync Route:**
```typescript
// app/api/v1/auth/sync/route.ts
export async function POST() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id },
    update: {},
  })

  return NextResponse.json({ ok: true })
}
```

### Data Flow
Supabase is **auth only**. All database reads and writes go through **Prisma**. Never use the Supabase JS client to query data. The pattern is:

```
Client Component → TanStack Query hook → API route (/api/v1/) → _prefixed server function → Prisma → PostgreSQL
```

### Invoice Number Generation
Auto-generated on the server: `{invoicePrefix}-{year}-{zero-padded-count}`. Example: `INV-2025-0042`. The `invoicePrefix` comes from `profile.invoicePrefix`. Count is derived from total invoices for the profile.

### PDF Generation
`@react-pdf/renderer` renders to a PDF buffer server-side. The `InvoicePDF` component is isolated from all regular UI components — it uses `StyleSheet.create()` not Tailwind. PDFs are generated on-demand in a Route Handler (`/api/invoices/[id]/pdf`) and stored in Supabase Storage bucket `invoices-pdf`. Client-side preview uses `<PDFViewer>` behind `dynamic(() => import(...), { ssr: false })`.

### Share Tokens
Public invoice share links use a `shareToken` (nanoid, 21 chars) stored on the invoice with a 30-day expiry. The `/i/[token]` route is fully public — no auth required. RLS policy allows SELECT on invoices where `share_token IS NOT NULL AND share_token_exp > now()`.

## API Routes

All routes live under `app/api/v1/`. Every route follows this structure:

1. Extract `userId` from Supabase session — **never from request body**
2. Parse and validate request body with Zod `safeParse`
3. Call a `_prefixed` server function with validated data
4. Catch `AppError` → return structured error response
5. Catch unknown errors → return 500

```typescript
// app/api/v1/invoices/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { apiError, apiValidationError, AppError } from '@/shared/lib/api-error'
import { ZCreateInvoiceSchema } from '@/features/invoices/schemas'
import { _createInvoice } from '@/features/invoices/server/_create-invoice'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  const body = await request.json()
  const parsed = ZCreateInvoiceSchema.safeParse(body)
  if (!parsed.success) return apiValidationError(parsed.error)

  try {
    const invoice = await _createInvoice(user.id, parsed.data)
    return NextResponse.json(invoice, { status: 201 })
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode ?? 403)
    return apiError('internal_error', 'Internal server error', 500)
  }
}

// [id]/route.ts — always await params in Next.js 16
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // ...
}
```

**Error Response Shape:**
```json
{ "error": { "code": "not_found", "message": "Invoice not found" } }
{ "error": { "code": "validation_error", "message": "...", "details": { "fieldErrors": {} } } }
```

**HTTP Status Reference:**
| Status | Code |
|--------|------|
| 401 | `unauthorized` |
| 403 | `<feature>_limit_reached`, `forbidden` |
| 404 | `not_found` |
| 422 | `validation_error` |
| 429 | `rate_limited` |
| 500 | `internal_error` |

## Error Handling

### api-error.ts

```typescript
// shared/lib/api-error.ts
import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'

export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown }
}

export function apiError(code: string, message: string, status: number) {
  return NextResponse.json<ApiErrorBody>({ error: { code, message } }, { status })
}

export function apiValidationError(err: ZodError) {
  return NextResponse.json<ApiErrorBody>(
    { error: { code: 'validation_error', message: 'Validation failed', details: err.flatten() } },
    { status: 422 }
  )
}

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 403
  ) {
    super(message)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super('not_found', message, 404)
  }
}
```

### Server Function Pattern

Server functions live in `features/<feature>/server/`. They contain all Prisma queries and business logic. They **throw** errors — they never return HTTP responses. One function per file, file name matches function name (e.g. `_create-invoice.ts`).

```typescript
// features/invoices/server/_create-invoice.ts
import { prisma } from '@/shared/lib/prisma'
import { AppError } from '@/shared/lib/api-error'
import type { ZCreateInvoice } from '@/features/invoices/schemas'

export async function _createInvoice(profileId: string, data: ZCreateInvoice) {
  // Use Promise.all() for independent parallel queries
  const [count, profile] = await Promise.all([
    prisma.invoice.count({ where: { profileId } }),
    prisma.profile.findUnique({ where: { id: profileId }, select: { invoicePrefix: true } }),
  ])

  if (!profile) throw new AppError('not_found', 'Profile not found', 404)

  return prisma.invoice.create({
    data: { profileId, ...data },
    select: { id: true, invoiceNumber: true },
  })
}
```

**Rules:**
- Auth check happens in the API route — server functions receive `profileId` as a trusted parameter
- Use `Promise.all()` for independent parallel queries
- Always use `.select()` to limit returned fields
- Throw `AppError` or `NotFoundError` for expected failures — let unexpected errors bubble up to the API route

### Hook Pattern

```typescript
// features/invoices/hooks/use-create-invoice.ts
'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ZCreateInvoice } from '@/features/invoices/schemas'

interface InvoiceApiError extends Error {
  code?: string
}

export function useCreateInvoice(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ZCreateInvoice) => {
      const res = await fetch('/api/v1/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        const error: InvoiceApiError = new Error(json.error?.message ?? 'Failed to create invoice')
        error.code = json.error?.code
        throw error
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      options?.onSuccess?.()
    },
    onError: (err: InvoiceApiError) => {
      if (err.code === 'invoice_limit_reached') {
        // Handle limit UI
      }
    },
  })
}
```

## Workflow

- **Before any UI task**: invoke the `frontend-design` skill
- **Before writing React/Next.js code**: invoke the `vercel-react-best-practices` skill (if available)
- **Before writing TanStack Query hooks**: invoke the `tanstack-query-best-practices` skill (if available)
- **When writing Prisma queries**: invoke the `prisma-client-api` skill
- **When optimizing DB/schema**: invoke the `supabase-postgres-best-practices` skill
- **Before writing code**: check if there's an existing pattern in `features/` to follow
- **After schema changes**: run `npx prisma generate` then `npx tsc --noEmit` to verify types
- **After building a feature**: run `npx tsc --noEmit` and `npm run lint` before considering it done
- **New shadcn component needed**: `npx shadcn@latest add <component>` — never hand-write primitives
- **UI icons**: always use `lucide-react` — never inline SVG, never other icon libraries
- **New feature**: create `features/<name>/` with `components/`, `hooks/`, `schemas/`, `server/`, `types.ts`, `constants/`

## Critical Rules

IMPORTANT: Run `npx prisma generate` after every schema change — the client will silently be out of sync otherwise.

IMPORTANT: Never edit files in `shared/components/ui/` directly. Add components with `npx shadcn@latest add <component>`.

IMPORTANT: Never use the Supabase JS client for data queries. Supabase is auth-only. All DB reads/writes go through Prisma via `@/shared/lib/prisma`.

IMPORTANT: Never trust `userId` from a request body or URL param. Always extract it from the Supabase session using `supabase.auth.getUser()` in the API route.

IMPORTANT: Never use `middleware.ts` — use `proxy.ts` with `export function proxy(...)`. Next.js 16 deprecated `middleware.ts`.

IMPORTANT: All styling must be done with Tailwind utility classes or Invox CSS tokens in the `className` prop — never use the `style` prop for colors or spacing (exception: `fontFamily` for mono amounts).

IMPORTANT: Never hardcode hex values in components. Always use the semantic CSS tokens defined in `globals.css`.

IMPORTANT: `proxy.ts` is the only place that handles session refresh via `createMiddlewareClient()`. Never call it anywhere else.

---

## Brand & Design System

### Identity

- **Product:** Invox — invoice management for Nigerian freelancers and SMBs
- **Personality:** Precise, confident, data-dense. Think Linear or Mercury — not a generic SaaS template.
- **Aesthetic:** Clean data UI with a dark-edge identity. Numeric precision is a brand value.

### Color Tokens

Always use these CSS variable names in `globals.css`. **Never use raw Tailwind defaults** (`blue-500`, `gray-400`, etc.).

```css
/* Brand Blue — primary action color */
--blue-50:  #EEF1FF;
--blue-100: #D8DCFF;
--blue-200: #B3BCFF;
--blue-400: #5B72FF;
--blue-500: #2B4BF2;
--blue-600: #1740F5;   /* PRIMARY — buttons, links, focus rings */
--blue-700: #1232D0;   /* hover state */
--blue-800: #0D24A3;
--blue-900: #091880;

/* Cyan — alternate accent, dark-bg only */
--cyan-400: #00E5F5;
--cyan-500: #00D4E8;

/* Ink — neutral text/surface scale */
--ink-50:  #F0F0F8;
--ink-100: #D5D5E8;
--ink-200: #ADADC8;
--ink-300: #8080A8;   /* placeholder, hints */
--ink-400: #5A5A8A;   /* secondary text */
--ink-500: #3D3D6B;
--ink-700: #1C1C3A;
--ink-900: #0D0D1A;   /* primary text */
--ink-950: #08080F;   /* dark surfaces, nav bg */

/* Semantic — always use these for status */
--success: #0ECB7A;   /* Paid, complete */
--warning: #F5A623;   /* Pending, overdue warning */
--error:   #F53A3A;   /* Overdue, failed, destructive */

/* Surfaces */
--surface-page:    #F7F7FB;
--surface-base:    #FFFFFF;
--surface-raised:  #FAFAFE;
--surface-overlay: #F0F0F8;
--border-default:  #E3E3EE;
--border-strong:   #C8C8DE;
```

### Invoice Status → Color Mapping

| Status | Badge style |
|---|---|
| `DRAFT` | `--blue-50` bg · `--blue-700` text |
| `SENT` | `--cyan-50` bg · `#006A7A` text |
| `PAID` | `#EDFAF3` bg · `#0A8F52` text · `--success` dot |
| `PARTIAL` | `#FFF7EA` bg · `#B57200` text · `--warning` dot |
| `OVERDUE` | `#FFF0F0` bg · `#C72020` text · `--error` dot |
| `CANCELLED` | `--ink-50` bg · `--ink-500` text |

### Typography

Three fonts — use each only for its designated role.

| Font | Role | Weights |
|---|---|---|
| **Plus Jakarta Sans** | Display, headings, buttons, labels | 400 500 600 700 800 |
| **DM Sans** | Body, paragraph, input text | 300 400 500 |
| **JetBrains Mono** | All numbers, amounts, invoice IDs | 400 500 |

```css
--font-display: 'Plus Jakarta Sans', sans-serif;
--font-body:    'DM Sans', sans-serif;
--font-mono:    'JetBrains Mono', monospace;
```

**Type scale:**

| Token | Size | Weight | Font | Use |
|---|---|---|---|---|
| `display` | 56px | 800 | display | Hero amounts (₦450,000) |
| `h1` | 40px | 800 | display | Page titles |
| `h2` | 28px | 700 | display | Section headings |
| `h3` | 20px | 700 | display | Card headings |
| `h4` | 16px | 700 | display | Label headings |
| `body` | 15px | 400 | body | Paragraphs, descriptions |
| `small` | 13px | 400 | body | Hints, timestamps, metadata |
| `mono` | 13px | 500 | mono | Amounts, IDs, codes |

**Letter spacing:**
- Display + H1: `letter-spacing: -0.04em`
- H2: `letter-spacing: -0.025em`
- H3/H4: `letter-spacing: -0.02em`
- Mono labels/caps: `letter-spacing: 0.08em`
- Body: no letter-spacing

### Spacing

4px base grid. Only use these tokens — never arbitrary pixel values.

```
--s1: 4px    --s2: 8px    --s3: 12px   --s4: 16px
--s5: 20px   --s6: 24px   --s8: 32px   --s10: 40px
--s12: 48px  --s16: 64px  --s20: 80px
```

### Border Radius

```
--r-sm:  6px    → tags, small badges
--r-md:  8px    → buttons, inputs
--r-lg:  12px   → default for most UI elements
--r-xl:  16px   → cards, panels
--r-2xl: 24px   → large hero surfaces, modals
pill:    999px  → status badges ONLY
```

### Motion

```
fast:       100ms ease  → hover states, focus rings, toggles
base:       200ms ease  → button color, dropdowns, sidebar
deliberate: 350ms ease  → modals, page transitions, skeleton fade
```

---

## Component Contracts

### Button

```tsx
// Always use shadcn Button as base.
// Variants: default (blue), secondary, outline, ghost, destructive
// Loading: inline spinner + disabled state

<Button variant="default">Create invoice</Button>
<Button variant="outline" size="sm">Edit</Button>
<Button variant="destructive">Delete client</Button>
<Button variant="default" disabled={isPending}>
  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Save invoice
</Button>
```

### InvoiceStatusBadge

```tsx
// Dot indicator + label. Pill border-radius. Semantic colors per status table.
// Location: features/invoices/components/list/InvoiceStatusBadge.tsx

<InvoiceStatusBadge status="PAID" />     // → green dot + "Paid"
<InvoiceStatusBadge status="OVERDUE" />  // → red dot + "Overdue"
```

### Currency / Amount Display

```tsx
// All monetary values must use JetBrains Mono
// Format: ₦450,000.00 (never "NGN 450000")
// Use formatCurrency(amount, currency) utility

<span style={{ fontFamily: 'var(--font-mono)' }}>
  {formatCurrency(amount, currency)}
</span>
```

### Invoice Number Display

```tsx
// Always mono font. Always the full prefixed number.
<span className="font-mono text-sm text-blue-600">INV-2025-0087</span>
```

### Data Tables

- Always use `@tanstack/react-table` — never build raw `<table>` elements
- Use the project's `DataTable` wrapper component
- Skeleton rows for loading states — never a spinner
- Empty state: icon + heading + action CTA (never just text)

### Cards

```tsx
// Standard card — surface-base bg, border-default border, r-xl radius
// Accent card (selected) — adds left blue border (3px, --blue-600)
// Stat card — surface-base, r-xl, padding s5, no shadow

// Never use shadow-lg. Max shadow-sm. Prefer border-only cards.
```

### Forms

```tsx
// React Hook Form + Zod v4 resolver always
// Label: Plus Jakarta Sans 600 12px
// Input: DM Sans 14px, r-md, 9px 14px padding
// Error: 11px, --error color, below input

const form = useForm<ZCreateClient>({
  resolver: zodResolver(ZCreateClientSchema),
  defaultValues: { ... }
})
```

---

## UI Anti-Patterns — Never Do These

| ❌ Never | ✅ Instead |
|---|---|
| Raw Tailwind `blue-500`, `gray-400`, etc. | Invox CSS tokens |
| `shadow-lg` on cards | `shadow-sm` or border-only |
| `rounded-full` on rectangular elements | `--r-xl` (16px) max on rects |
| Gradient section backgrounds | Flat `--surface-page` or `--ink-950` |
| Center-aligned full-screen layouts | Left-aligned sidebar + main content |
| Colorful gradient stat cards | Neutral surface cards with colored left-border accent |
| Heroicons, Phosphor, or any other icon set | `lucide-react` exclusively |
| More than 2 font weights in one UI region | Respect the type scale |
| Arbitrary Tailwind values `w-[437px]` | Spacing tokens only |
| Inline `style={{ color: '#333' }}` for text | CSS variables |
| Spinner centered on page for data loading | Skeleton loaders |
| Building modals, dialogs, sheets from scratch | shadcn Dialog / Sheet |
| `<table>` elements built manually | `@tanstack/react-table` + DataTable |
| Cyan logo on white/light backgrounds | Cyan on dark only |
| `middleware.ts` | `proxy.ts` with `export function proxy(...)` using `createMiddlewareClient()` |
| Supabase client for DB queries | Prisma only |

---

## Streaming AI (Vercel AI SDK v6)

Use `useChat()` from `@ai-sdk/react` — `useCompletion()` is deprecated in v6.

**Route Handler:**
```typescript
// app/api/v1/generations/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@/shared/lib/supabase/server'
import { apiError } from '@/shared/lib/api-error'

export const maxDuration = 60

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  const body = await request.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: body.messages,
    onFinish: async ({ text }) => {
      // Save to DB after stream completes
    },
  })

  return result.toDataStreamResponse()
}
```

**Client Hook (must be in a Client Component):**
```typescript
'use client'
import { useChat } from '@ai-sdk/react'

export function GenerationPanel() {
  const { messages, append, isLoading } = useChat({
    api: '/api/v1/generations',
  })

  // Extract text from message parts
  const outputText = messages
    .filter(m => m.role === 'assistant')
    .flatMap(m => m.parts.filter((p: { type: string }) => p.type === 'text').map((p: { text: string }) => p.text))
    .join('')

  return <div>{isLoading ? 'Generating...' : outputText}</div>
}
```

---

## Supabase Patterns

**Client Selection:**
| Context | Import |
|---------|--------|
| Browser component | `createClient` from `@/shared/lib/supabase/client` |
| Server component / API route | `createClient` from `@/shared/lib/supabase/server` |
| proxy.ts | `createMiddlewareClient` from `@/shared/lib/supabase/middleware` |
| Service-level ops | `createAdminClient` from `@/shared/lib/supabase/admin` |

### Server Client (Server Components & API Routes)

```typescript
// shared/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### Auth Check Pattern (every API route must start with this)

```typescript
const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()
if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)
// user.id === profileId for all Prisma queries
```

### RLS is enabled on all tables. Prisma queries are rejected if the user doesn't own the row. Never disable RLS.

---

## Database Conventions

- `profileId` is always `String @db.Uuid` and always equals `supabase.auth.user.id`
- All tables have `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`
- Soft deletes use `deletedAt DateTime?` — never hard delete clients
- Invoice numbers are unique per profile: `@@unique([profileId, invoiceNumber])`
- Monetary values stored as `Float` — display formatting happens in the UI layer only
- Always use `@@index` on foreign keys and frequently filtered columns
- Prisma datasource config lives in `prisma.config.ts` at the project root — not inside `schema.prisma`

---

## Nigerian Market Requirements

Non-negotiable product requirements.

- Default currency: **NGN** with `₦` symbol
- Support WHT (Withholding Tax) as an optional invoice line item
- Profile fields: **TIN** (Tax Identification Number) + **RC Number** (CAC registration)
- Bank transfer details must appear prominently on the PDF invoice
- WhatsApp share button on invoice detail: `wa.me/?text=...`
- Payment methods include: `PAYSTACK`, `FLUTTERWAVE`, `BANK_TRANSFER`, `WISE`, `PAYPAL`
- Date format: `DD MMM YYYY` (e.g. "15 Jan 2025") — never MM/DD/YYYY

---

## Performance Rules

- All PDF components: `dynamic(() => import(...), { ssr: false })`
- All chart components (Recharts): `dynamic(() => import(...), { ssr: false })`
- Invoice list: always render skeleton loading state, never a blank screen
- Debounce search inputs: **300ms**
- Debounce invoice form auto-save: **2000ms**
- Debounce PDF live preview re-render: **400ms**
- Supabase Storage images: serve with correct cache headers

---

## Environment Variables

All env vars are validated via Zod in `shared/lib/env.ts`. Never access `process.env` directly outside that file.

```typescript
// shared/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.url(),
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
})

export const env = envSchema.parse(process.env)
```

```env
# .env.local (never commit)
DATABASE_URL=                         # Supabase pooler connection string (app queries)
DIRECT_URL=                           # Supabase direct connection (migrations only)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI (if using Vercel AI SDK)
OPENAI_API_KEY=

# Billing (if using Stripe)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email (Phase 10+)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
```

---

## Current Phase

**Phase 0 — Project Setup** (not started)

See the full phased plan in `REBUILD.md`.

When asked to work on a phase: read the relevant section of `REBUILD.md` first, implement every task in order, check off tasks as completed. Do not skip ahead unless explicitly asked.

---

## When Compacting

Preserve: current phase being worked on, list of modified files, any pending Prisma migrations, any unresolved TypeScript errors, and any decisions made that deviate from `REBUILD.md`.

---

*Invox v2 — Branch: `invox-2` | Last updated: March 2026*
