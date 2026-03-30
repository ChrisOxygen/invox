import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/shared/lib/supabase/middleware'

const PROTECTED_ROUTES = ['/dashboard', '/invoices', '/clients', '/settings', '/onboarding']
const AUTH_ROUTES = ['/login', '/register', '/forgot-password']

export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse } = createMiddlewareClient(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
