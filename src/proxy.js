import { createClient } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";

/**
 * Proxy to protect routes requiring authentication
 * @param {import('next/server').NextRequest} request
 */
export async function proxy(request) {
  const { supabase, response } = createClient(request);

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session exists and trying to access protected routes, redirect to login
  if (!session) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Apply proxy only to dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};

