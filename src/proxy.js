import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/buildings",
  "/employees",
  "/onboarding",
];

function isProtectedRoute(pathname) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (routePrefix) => pathname === routePrefix || pathname.startsWith(`${routePrefix}/`),
  );
}

/**
 * Next.js 16 route protection (proxy replaces middleware convention).
 * Auth is enforced on protected routes using Supabase SSR cookies.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const { supabase, response } = createClient(request);

  // Refresh auth cookies for SSR consistency.
  await supabase.auth.getSession();

  // Always validate user with Auth server for secure protection decisions.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/buildings/:path*",
    "/employees/:path*",
    "/onboarding/:path*",
  ],
};
