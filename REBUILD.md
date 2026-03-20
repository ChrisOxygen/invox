# Invox v2 — Full Rebuild Plan
> Branch: `invox-2` | Strategy: Gut-in-place | Target: PRD v2.0

---

## Overview

This document is the single source of truth for the Invox v2 rebuild.
The entire codebase is being rebuilt from scratch on the `invox-2` branch to align with the PRD v2.0 specification.

**What changes:**
- MongoDB → Supabase (PostgreSQL)
- NextAuth v5 (beta) → Supabase Auth
- Cloudinary → Supabase Storage
- All existing features rebuilt with cleaner architecture

**What stays the same:**
- Next.js 15 App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- TanStack Query
- @react-pdf/renderer
- Vercel deployment

---

## Tech Stack — Exact Versions

### Core Framework
| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.0 | App Router, Server Actions, Server Components |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | DOM rendering |
| `typescript` | 5.9.3 | Type safety |

### Styling & UI
| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | 4.2.2 | Utility CSS (v4 — `@import "tailwindcss"` syntax) |
| `class-variance-authority` | 0.7.1 | Component variants |
| `clsx` | 2.1.1 | Conditional class names |
| `tailwind-merge` | 3.5.0 | Merge Tailwind classes without conflicts |
| `lucide-react` | 0.577.0 | Icon library |
| `next-themes` | 0.4.6 | Dark/light mode |
| `sonner` | 2.0.7 | Toast notifications |
| `recharts` | 3.8.0 | Dashboard charts |

> shadcn/ui is installed via CLI (`npx shadcn@latest init`) — not a versioned npm package.

### Auth & Database
| Package | Version | Purpose |
|---|---|---|
| `@supabase/supabase-js` | 2.99.3 | Supabase client |
| `@supabase/ssr` | 0.9.0 | SSR-safe Supabase client for Next.js |
| `prisma` | 7.5.0 | ORM + migrations (dev dependency) |
| `@prisma/client` | 7.5.0 | Type-safe DB queries |

### Forms & Validation
| Package | Version | Purpose |
|---|---|---|
| `react-hook-form` | 7.71.2 | Form state management |
| `@hookform/resolvers` | 5.2.2 | Zod integration with RHF |
| `zod` | 4.3.6 | Schema validation (v4 — new API) |

### Data Fetching
| Package | Version | Purpose |
|---|---|---|
| `@tanstack/react-query` | 5.91.2 | Client-side caching, optimistic updates |
| `@tanstack/react-table` | 8.21.3 | Invoice/client data tables |

### File Handling & PDF
| Package | Version | Purpose |
|---|---|---|
| `@react-pdf/renderer` | 4.3.2 | Invoice PDF generation |
| `react-dropzone` | 15.0.0 | Logo/file upload UI |
| `sharp` | 0.34.5 | Image optimisation (server-side) |

### Dates
| Package | Version | Purpose |
|---|---|---|
| `date-fns` | 4.1.0 | Date formatting and calculation |
| `react-day-picker` | 9.14.0 | Date picker component |

### Email & AI (Post-MVP)
| Package | Version | Purpose |
|---|---|---|
| `resend` | 6.9.4 | Transactional email (invoice delivery) |
| `@anthropic-ai/sdk` | 0.80.0 | Claude API for AI tier |

### Analytics & Monitoring
| Package | Version | Purpose |
|---|---|---|
| `posthog-js` | 1.363.0 | User behaviour analytics |

> **Sentry** for error monitoring — install via `@sentry/nextjs` (version pinned at install time).

---

## Important Version Notes

### Zod v4 (Breaking Changes from v3)
- `z.string().nonempty()` → `z.string().min(1)`
- `z.object().strict()` behaviour changed
- `.parse()` still works the same
- New: `z.email()`, `z.url()` as top-level shortcuts
- Docs: https://zod.dev/v4

### Next.js 16 (Breaking Changes from 15)
- `params` and `searchParams` in page props are now `Promise<...>` — always `await` them
- `use cache` directive for caching (replaces `fetch` cache options)
- Turbopack is the default bundler — no config needed
- React Compiler is stable — no manual `useMemo`/`useCallback` needed in most cases

### Recharts v3 (Breaking Changes from v2)
- New `<BarChart data={...}>` API — check docs before copying v2 examples
- Better TypeScript support

### react-dropzone v15
- Hook API unchanged (`useDropzone`) — minor internal changes only

---

## Supabase Setup (Do This First)

### 1. Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Name it `invox-prod` (or `invox-dev` for a dev instance)
3. Choose a region closest to Nigeria: **EU West** or **US East**
4. Save the database password securely

### 2. Get Credentials
From Project Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only, never expose to client)

From Project Settings → Database → Connection string (URI):
- `DATABASE_URL` (use the **Prisma** connection string with `?pgbouncer=true&connection_limit=1`)
- `DIRECT_URL` (use the **direct** connection string — needed for Prisma migrations)

### 3. Enable Google OAuth
1. Supabase Dashboard → Authentication → Providers → Google
2. Add your Google OAuth credentials
3. Add callback URL to Google Console: `https://<your-supabase-project>.supabase.co/auth/v1/callback`

### 4. Environment Variables
Create `.env.local` (never commit this file):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database (Prisma)
DATABASE_URL=postgresql://postgres.xxxx:[password]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.xxxx:[password]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Post-MVP)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=invoices@yourdomain.com

# Analytics (Post-MVP)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# AI Tier (Post-MVP)
ANTHROPIC_API_KEY=sk-ant-...
```

Create `.env.example` with all keys but empty values (commit this file).

---

## Database Schema (Prisma + Supabase PostgreSQL)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Profiles — extends Supabase auth.users (1-to-1)
model Profile {
  id             String    @id @db.Uuid  // matches auth.users.id
  businessName   String?
  address        String?
  city           String?
  state          String?
  zipCode        String?
  country        String?   @default("Nigeria")
  phone          String?
  email          String?
  website        String?
  logoUrl        String?
  brandColor     String?   @default("#000000")
  currency       String    @default("NGN")
  invoicePrefix  String    @default("INV")
  taxNumber      String?   // TIN (Nigeria) or VAT number
  rcNumber       String?   // RC Number (Nigeria business reg)
  onboardingDone Boolean   @default(false)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  clients        Client[]
  invoices       Invoice[]

  @@map("profiles")
}

model Client {
  id          String    @id @default(cuid())
  profileId   String    @db.Uuid
  profile     Profile   @relation(fields: [profileId], references: [id], onDelete: Cascade)
  name        String
  email       String?
  phone       String?
  address     String?
  city        String?
  state       String?
  country     String?
  company     String?
  deletedAt   DateTime?  // soft delete
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  invoices    Invoice[]

  @@index([profileId])
  @@index([email])
  @@map("clients")
}

model Invoice {
  id             String        @id @default(cuid())
  profileId      String        @db.Uuid
  profile        Profile       @relation(fields: [profileId], references: [id], onDelete: Cascade)
  clientId       String
  client         Client        @relation(fields: [clientId], references: [id])
  invoiceNumber  String
  status         InvoiceStatus @default(DRAFT)
  issueDate      DateTime
  dueDate        DateTime
  currency       String        @default("NGN")
  taxRate        Float         @default(0)
  taxType        TaxType       @default(PERCENTAGE)
  discount       Float         @default(0)
  discountType   DiscountType  @default(PERCENTAGE)
  subtotal       Float         @default(0)
  taxAmount      Float         @default(0)
  discountAmount Float         @default(0)
  total          Float         @default(0)
  notes          String?       // shown on PDF
  internalNotes  String?       // hidden from PDF
  shareToken     String?       @unique
  shareTokenExp  DateTime?
  sentAt         DateTime?
  paidAt         DateTime?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  items          InvoiceItem[]
  payments       Payment[]

  @@unique([profileId, invoiceNumber])
  @@index([profileId])
  @@index([status])
  @@index([clientId])
  @@index([dueDate])
  @@index([shareToken])
  @@map("invoices")
}

model InvoiceItem {
  id          String  @id @default(cuid())
  invoiceId   String
  invoice     Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  description String
  quantity    Float
  unitPrice   Float
  subtotal    Float

  @@index([invoiceId])
  @@map("invoice_items")
}

model Payment {
  id        String        @id @default(cuid())
  invoiceId String
  invoice   Invoice       @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  profileId String        @db.Uuid
  amount    Float
  datePaid  DateTime
  method    PaymentMethod
  note      String?
  createdAt DateTime      @default(now())

  @@index([invoiceId])
  @@index([profileId])
  @@map("payments")
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  PARTIAL
  OVERDUE
  CANCELLED
}

enum TaxType {
  PERCENTAGE
  FIXED
}

enum DiscountType {
  PERCENTAGE
  FIXED
}

enum PaymentMethod {
  BANK_TRANSFER
  CASH
  PAYPAL
  WISE
  PAYSTACK
  FLUTTERWAVE
  OTHER
}
```

### Supabase RLS Policies
Run these in Supabase SQL Editor after migration:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only access their own profile
CREATE POLICY "Users manage own profile"
ON profiles FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Clients: scoped to profile owner
CREATE POLICY "Users manage own clients"
ON clients FOR ALL
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- Invoices: scoped to profile owner
CREATE POLICY "Users manage own invoices"
ON invoices FOR ALL
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- Public invoice share (read-only via token, no auth required)
CREATE POLICY "Public can view shared invoices"
ON invoices FOR SELECT
USING (
  share_token IS NOT NULL
  AND share_token_exp > now()
);

-- Invoice items: accessible if user owns the invoice
CREATE POLICY "Users manage own invoice items"
ON invoice_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.profile_id = auth.uid()
  )
);

-- Payments: scoped to profile owner
CREATE POLICY "Users manage own payments"
ON payments FOR ALL
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);
```

---

## Application Route Structure

```
app/
├── (marketing)/                  # Public marketing pages
│   ├── page.tsx                  # / — Landing page
│   ├── layout.tsx
│   └── (legal)/
│       ├── privacy-policy/
│       └── terms-of-service/
│
├── (auth)/                       # Auth pages (no sidebar)
│   ├── layout.tsx
│   ├── login/page.tsx            # /login
│   ├── register/page.tsx         # /register
│   ├── forgot-password/page.tsx  # /forgot-password
│   └── reset-password/page.tsx   # /reset-password (token from email)
│
├── (app)/                        # Protected dashboard
│   ├── layout.tsx                # Sidebar + auth guard
│   ├── onboarding/page.tsx       # /onboarding (first login only)
│   ├── dashboard/page.tsx        # /dashboard
│   ├── invoices/
│   │   ├── page.tsx              # /invoices — list
│   │   ├── new/page.tsx          # /invoices/new — create
│   │   └── [id]/
│   │       ├── page.tsx          # /invoices/[id] — view/edit
│   │       └── preview/page.tsx  # /invoices/[id]/preview — PDF preview
│   ├── clients/
│   │   ├── page.tsx              # /clients — list
│   │   ├── new/page.tsx          # /clients/new
│   │   └── [id]/page.tsx         # /clients/[id] — detail + invoice history
│   └── settings/
│       └── page.tsx              # /settings — tabbed settings page
│
└── i/
    └── [token]/page.tsx          # /i/[token] — public invoice view (no auth)
```

---

## Feature Folder Structure

```
features/
├── auth/
│   ├── actions/        # Server Actions: signIn, signUp, signOut, resetPassword
│   ├── components/     # LoginForm, RegisterForm, ForgotPasswordForm
│   ├── hooks/          # useSignIn, useSignUp
│   └── schemas/        # Zod schemas for auth forms
│
├── onboarding/
│   ├── actions/        # saveOnboardingStep, completeOnboarding
│   ├── components/     # OnboardingWizard, Step1..Step5
│   ├── context/        # OnboardingContext (step state)
│   └── schemas/
│
├── invoices/
│   ├── actions/        # createInvoice, updateInvoice, deleteInvoice, getInvoices, etc.
│   ├── components/
│   │   ├── form/       # InvoiceForm, LineItemRow, TotalsPanel, ClientSelector
│   │   ├── list/       # InvoiceTable, InvoiceFilters, InvoiceStatusBadge
│   │   ├── detail/     # InvoiceDetail, PaymentLog, ActionsToolbar
│   │   └── pdf/        # InvoicePDF, PDFPreview, DownloadButton
│   ├── hooks/          # useInvoices, useInvoice, useCreateInvoice, useUpdateInvoice
│   ├── types/
│   └── schemas/
│
├── clients/
│   ├── actions/
│   ├── components/     # ClientForm, ClientTable, ClientDetail
│   ├── hooks/
│   └── schemas/
│
├── dashboard/
│   ├── actions/        # getDashboardStats
│   ├── components/     # StatsCards, RevenueChart, StatusChart, RecentInvoices
│   └── hooks/
│
└── settings/
    ├── actions/        # updateProfile, uploadLogo, updateBrandColor
    ├── components/     # BusinessInfoForm, BrandingForm, InvoiceDefaultsForm
    └── hooks/
```

---

## Phased Implementation Plan

---

### Phase 0 — Project Setup
**Goal:** Clean repo, correct dependencies, Supabase wired up, app boots.

**Tasks:**
- [ ] Delete all existing `app/`, `features/`, `components/`, `hooks/`, `lib/`, `prisma/`, `types/` content
- [ ] Keep: `package.json`, `.gitignore`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `public/`
- [ ] Install all packages at versions listed above
- [ ] Run `npx shadcn@latest init` (Tailwind v4, TypeScript, `src/` = no, RSC = yes)
- [ ] Add shadcn components: `button input form label select dialog sheet tabs card badge table skeleton avatar dropdown-menu popover separator toast`
- [ ] Set up Supabase clients:
  - `lib/supabase/server.ts` — `createServerClient` (for Server Components + Actions)
  - `lib/supabase/client.ts` — `createBrowserClient` (for Client Components)
  - `lib/supabase/middleware.ts` — `updateSession` helper
- [ ] Set up Prisma with PostgreSQL schema (schema above)
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Configure `middleware.ts` to protect `/(app)/*` routes
- [ ] Set up `lib/env.ts` with Zod validation of env vars
- [ ] Set up TanStack Query provider
- [ ] Configure `next.config.ts` (image domains, etc.)
- [ ] Verify: `npm run dev` boots, `/` renders, `/dashboard` redirects to `/login`

---

### Phase 1 — Authentication
**Goal:** Full auth flow working: register, login, Google OAuth, forgot password, reset password.

**User Stories covered:** US-01, US-02

**Tasks:**
- [ ] Build `/register` page — email, password, full name form
  - Zod schema: email, password min 8, name required
  - Server Action: `signUp()` — calls `supabase.auth.signUp()`, creates Profile row
  - Trigger: on sign-up, insert row into `profiles` table with `id = user.id`
  - Show verification email sent state
- [ ] Build `/login` page — email + password + Google button
  - Server Action: `signIn()` — calls `supabase.auth.signInWithPassword()`
  - Google OAuth: `supabase.auth.signInWithOAuth({ provider: 'google' })`
  - Redirect to `/dashboard` on success, redirect new users to `/onboarding`
- [ ] Build `/forgot-password` page
  - Server Action: `sendResetEmail()` — calls `supabase.auth.resetPasswordForEmail()`
- [ ] Build `/reset-password` page
  - Reads token from URL, calls `supabase.auth.updateUser({ password })`
- [ ] Set up `middleware.ts`:
  - Call `updateSession()` on every request
  - Unauthenticated → redirect to `/login`
  - Authenticated + onboarding not done → redirect to `/onboarding`
  - Authenticated + on auth page → redirect to `/dashboard`
- [ ] Auto-create Profile on first OAuth login (use Supabase Auth hook or check in middleware)

**Supabase Auth Hook (run in SQL Editor):**
```sql
-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

### Phase 2 — Onboarding Wizard
**Goal:** First-time user completes business setup before reaching dashboard.

**User Story covered:** US-03

**Steps (5 steps, down from 8):**
1. **Business Info** — business name, type, phone, email
2. **Address** — address line, city, state, country
3. **Branding** — logo upload (Supabase Storage), brand color picker, invoice prefix
4. **Invoice Defaults** — default currency, default tax rate, payment terms
5. **Done** — "You're all set" → redirect to `/dashboard`

**Tasks:**
- [ ] `OnboardingContext` — tracks current step + accumulated form data
- [ ] `completeOnboardingStep()` Server Action — upserts Profile data per step
- [ ] `completeOnboarding()` Server Action — sets `onboardingDone = true`
- [ ] Logo upload to Supabase Storage bucket `logos` (private, per-user path)
- [ ] Color picker component (hex input + `<input type="color">`)
- [ ] Progress indicator component (step X of 5)
- [ ] Skip button on steps 3 and 4
- [ ] Middleware: redirect to `/onboarding` if `profile.onboardingDone === false`

---

### Phase 3 — Client Management
**Goal:** Users can create, view, edit, delete, and search clients.

**User Stories covered:** US-04, US-05

**Tasks:**
- [ ] `/clients` — paginated list, search by name/email, sort by name/date
  - `ClientTable` with `@tanstack/react-table`
  - Search debounced 300ms
  - Empty state with "Add your first client" CTA
- [ ] Create client — slide-out `Sheet` (not a separate page)
  - Fields: name, email, phone, company, address, city, state, country
  - Inline create available from invoice form
- [ ] `/clients/[id]` — client detail
  - Client info card with edit button
  - Invoice history table (all invoices for this client)
  - Total billed + total paid summary
- [ ] Edit client — same Sheet, pre-filled
- [ ] Delete client — confirmation Dialog
  - Soft delete (`deletedAt`) — invoices retained
- [ ] Duplicate email warning (not a hard block)

---

### Phase 4 — Invoice Creation
**Goal:** Users can create a full invoice with line items, tax, discount, and save as draft or sent.

**User Stories covered:** US-06, US-07, US-08

**Layout:**
- Desktop: two-column — form on left, live PDF preview on right (debounced 400ms)
- Mobile: form only, preview accessible via "Preview" tab

**Tasks:**
- [ ] `/invoices/new` page
- [ ] Invoice form sections:
  - **Header:** Invoice number (auto-gen from prefix + counter), issue date, due date + presets (Net 15 / Net 30 / Net 45 / Due on receipt)
  - **Client:** Searchable client selector. "Create new client" inline option
  - **Line items:** Dynamic table — add/remove rows, inline editing, quantity × unit price = row subtotal (real-time)
  - **Totals panel:** Subtotal, tax (% or fixed), discount (% or fixed), grand total — all real-time
  - **Notes:** "Notes to client" (shows on PDF) + "Internal notes" (hidden from PDF)
  - **Currency:** Per-invoice currency (defaults to profile currency)
- [ ] `calculateTotals()` utility — pure function, easy to test
- [ ] Zod schema (v4) for invoice validation — draft mode lenient, sent mode strict
- [ ] `createInvoice()` Server Action — validate, insert invoice + items atomically
- [ ] Auto-save draft (debounced 2s on any field change)
- [ ] "Save Draft" and "Save & Mark as Sent" buttons
- [ ] `/invoices/[id]` — edit existing invoice (all fields editable while DRAFT)
- [ ] Invoice duplication — copy invoice → new DRAFT, new number, reset dates

---

### Phase 5 — Invoice Tracking & Status
**Goal:** Full invoice lifecycle from draft to paid, with payment logging.

**User Stories covered:** US-09, US-10, US-11

**Tasks:**
- [ ] `/invoices` list page
  - Status filter tabs: All / Draft / Sent / Paid / Overdue / Cancelled
  - Search by invoice number or client name (debounced)
  - Date range filter (issue date or due date)
  - Active filters shown as dismissable chips
  - Columns: Invoice #, Client, Issue Date, Due Date, Amount, Status, Actions
  - Row actions menu: View, Edit, Download PDF, Mark Paid, Duplicate, Cancel, Delete
  - Empty state per status tab
- [ ] Invoice detail page (`/invoices/[id]`)
  - Read-only view of all invoice data
  - Status badge (colour-coded)
  - "Overdue by X days" indicator
  - Payment log section (list of payments received)
  - Actions toolbar: Edit, Download PDF, Share Link, Mark as Paid, Duplicate
- [ ] "Mark as Paid" modal
  - Fields: date paid, amount, payment method, optional note
  - Partial payment → status `PARTIAL`, shows running balance
  - Full payment → status `PAID`, timestamp recorded
- [ ] Auto overdue detection
  - Run on invoice list load: invoices where `dueDate < today AND status = SENT` → update to `OVERDUE`
  - Server Action: `markOverdueInvoices(profileId)`
- [ ] Invoice share link generation
  - "Copy Link" button → generates `shareToken` (nanoid, 21 chars) + `shareTokenExp = +30 days`
  - Saves to invoice record
  - Copies `${APP_URL}/i/${token}` to clipboard

---

### Phase 6 — PDF Generation & Export
**Goal:** WYSIWYG PDF matching the web preview, downloadable and printable.

**User Stories covered:** US-12, US-13, US-14

**Tasks:**
- [ ] `InvoicePDF` component — `@react-pdf/renderer` document
  - Sections: Header (logo + brand colour + business info), Client block, Line items table, Totals, Notes, Footer (payment info + "Generated by Invox")
  - Multi-page support (25 items per page with page numbers)
  - Brand colour applied to header strip and table header row
  - Logo rendered from Supabase Storage signed URL
- [ ] `/invoices/[id]/preview` page
  - Left: Invoice detail summary
  - Right: Live PDF preview via `<PDFViewer>` (dynamic import, `ssr: false`)
  - Desktop: side-by-side. Mobile: tabbed
- [ ] Download button — `<PDFDownloadLink>` from `@react-pdf/renderer`
  - Filename: `INVOX-{invoiceNumber}-{clientName}.pdf`
- [ ] Print button — triggers `window.print()` with print-only stylesheet that hides nav/sidebar
- [ ] Store generated PDFs in Supabase Storage bucket `invoices-pdf`
  - Path: `{profileId}/{invoiceId}.pdf`
  - Regenerate when invoice is updated

---

### Phase 7 — Dashboard
**Goal:** At-a-glance overview of invoice activity and financial health.

**User Story covered:** US-09

**Tasks:**
- [ ] `/dashboard` page (redirect from `/`)
- [ ] Stats cards row:
  - Total Outstanding (sum of SENT + OVERDUE)
  - Total Paid This Month
  - Total Overdue (highlighted red)
  - Invoice count by status
- [ ] Revenue chart — monthly bar chart (last 6 months) with Recharts
- [ ] Invoice status distribution — pie/donut chart
- [ ] Recent invoices table — last 10, with quick action links
- [ ] "Create Invoice" primary CTA — always visible
- [ ] Overdue invoices highlighted in red with "X days overdue" badge
- [ ] Empty state for new users — illustration + "Create your first invoice"
- [ ] `getDashboardStats()` Server Action — single DB call, returns all needed data

---

### Phase 8 — Public Invoice View
**Goal:** Clients can view their invoice via a shareable link without logging in.

**User Story:** US-12 (preview) + share feature

**Tasks:**
- [ ] `/i/[token]` route — no auth required
  - Validate token: exists, not expired
  - Render read-only invoice view
  - Shows: logo, business info, client info, line items, totals, payment details, notes
  - Download PDF button
  - "Powered by Invox" footer with signup CTA
  - Does NOT show internal notes
  - Returns 404 if token invalid or expired

---

### Phase 9 — Settings & Branding
**Goal:** Users can manage all business and account settings.

**User Stories covered:** US-15, US-16

**Tasks:**
- [ ] `/settings` page — tabbed layout
  - **Business Info tab:** name, address, phone, email, website, TIN, RC number
  - **Branding tab:** logo upload + preview, brand colour picker + preview on mini invoice template
  - **Invoice Defaults tab:** default currency, invoice prefix, default tax rate, default payment terms
  - **Account tab:** change email, change password, delete account (with confirmation)
- [ ] Logo upload flow:
  - Drag-and-drop (`react-dropzone` v15)
  - Client-side validation: PNG/JPG/SVG, max 2MB
  - Upload to Supabase Storage `logos/{profileId}/logo.{ext}`
  - Return public URL, save to profile
  - Live preview updates immediately
- [ ] Brand colour picker:
  - Hex input field + native `<input type="color">`
  - Preview shows on a mini invoice template thumbnail
- [ ] All changes save on submit with success toast
- [ ] Changes to business info immediately reflected in new invoices (not retroactive)

---

### Phase 10 — Polish, Security & Launch Prep
**Goal:** Production-ready, tested, monitored.

**Tasks:**
- [ ] Set up Sentry error monitoring (`npx @sentry/wizard@latest -i nextjs`)
- [ ] Set up PostHog analytics
- [ ] Validate all RLS policies — confirm no cross-user data leakage
- [ ] Confirm all Server Actions check `auth.getUser()` before any DB operation
- [ ] Nigerian market additions:
  - WHT (Withholding Tax) optional line item on invoices
  - TIN + RC Number fields on business profile
  - Bank transfer details prominently on PDF
  - WhatsApp share button on invoice detail (`wa.me/?text=...`)
  - NGN default currency
- [ ] Mobile audit — all pages usable on 375px screen
- [ ] Print stylesheet (`@media print`) — hides sidebar, nav, action buttons
- [ ] Performance:
  - All heavy components (PDF viewer, charts) behind `dynamic(() => import(...), { ssr: false })`
  - Supabase Storage images served with correct cache headers
  - Invoice list: skeleton loading states
- [ ] End-to-end test of critical path: Register → Onboard → Add Client → Create Invoice → Download PDF → Share Link

---

### Post-MVP — AI Paid Tier (Phase 11)
**Goal:** Paid tier with AI-powered features using Claude API.

**Tasks:**
- [ ] AI invoice line item drafting — plain text description → suggested line items
- [ ] AI payment follow-up email — generate personalised reminder for overdue invoices
- [ ] Smart invoice title + notes suggestions
- [ ] Stripe/Paystack subscription for paid tier
- [ ] Feature flag system (check subscription status before AI features)
- [ ] In-app upsell prompts ("This would take 2 seconds with AI ✨")

---

## File Conventions

### Server Actions
```typescript
// features/invoices/actions/index.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createInvoice(data: CreateInvoiceInput) {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')

  // ... db operations with prisma
  revalidatePath('/invoices')
}
```

### Supabase Server Client
```typescript
// lib/supabase/server.ts
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

### Zod v4 Schema Pattern
```typescript
import { z } from 'zod'

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  invoiceNumber: z.string().min(1),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  currency: z.string().default('NGN'),
  taxRate: z.number().min(0).max(100).default(0),
  discount: z.number().min(0).default(0),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
  })).min(1, 'At least one item is required'),
})

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>
```

### TanStack Query Hook Pattern
```typescript
// features/invoices/hooks/useInvoices.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { getInvoices } from '../actions'

export function useInvoices(filters: InvoiceFilters) {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => getInvoices(filters),
    staleTime: 1000 * 60 * 5,
  })
}
```

---

## Progress Tracker

| Phase | Name | Status |
|---|---|---|
| 0 | Project Setup | ⬜ Not started |
| 1 | Authentication | ⬜ Not started |
| 2 | Onboarding | ⬜ Not started |
| 3 | Client Management | ⬜ Not started |
| 4 | Invoice Creation | ⬜ Not started |
| 5 | Invoice Tracking & Status | ⬜ Not started |
| 6 | PDF Generation & Export | ⬜ Not started |
| 7 | Dashboard | ⬜ Not started |
| 8 | Public Invoice View | ⬜ Not started |
| 9 | Settings & Branding | ⬜ Not started |
| 10 | Polish & Launch Prep | ⬜ Not started |
| 11 | AI Paid Tier (Post-MVP) | ⬜ Not started |

---

*Invox v2 — Built by Chris Destiny | Branch: invox-2 | Last updated: March 2026*
