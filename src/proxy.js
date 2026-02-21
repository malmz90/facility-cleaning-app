import { createClient } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";

/**
 * Next.js 16 uses proxy.js instead of middleware.js.
 * Exported function must be named `proxy`.
 *
 * getSession() is used here only to refresh the cookie-stored session token —
 * this is the correct pattern for middleware (avoids an extra Auth server round-trip
 * on every request). Security-critical checks (auth + onboarding) use getUser(),
 * which re-validates the token with the Supabase Auth server.
 *
 * @param {import('next/server').NextRequest} request
 */
export async function proxy(request) {
  const { supabase, response } = createClient(request);
  const { pathname } = request.nextUrl;

  // Refresh the session cookie — required for Server Components to pick up changes.
  // Do NOT use the session object from here for security decisions.
  await supabase.auth.getSession();

  // Validate the token with the Auth server to get a trustworthy user object.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // ── Dashboard routes ──────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", user.id)
      .single();

    if (!profile?.onboarded) {
      return NextResponse.redirect(
        new URL("/onboarding/create-organization", request.url),
      );
    }
  }

  // ── Onboarding routes ─────────────────────────────────────────────────────
  if (pathname.startsWith("/onboarding")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", user.id)
      .single();

    if (profile?.onboarded) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
