"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getValidatedSession,
  onAuthStateChange,
  signIn as signInService,
  signOut as signOutService,
  signUp as signUpService,
} from "@/services/auth.service";

/**
 * AuthContext - For UI state only
 * 
 * IMPORTANT: This context is used ONLY for displaying user information
 * and UI-related auth state (loading, user email, logout button, etc.).
 * 
 * Route protection is handled on the server via:
 * - Proxy (src/proxy.js) for initial route checks
 * - Dashboard layout (app/dashboard/layout.js) for server-side verification
 * 
 * DO NOT use this context for route protection or security decisions.
 */
export const AuthContext = createContext(null);

const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/buildings",
  "/employees",
  "/onboarding",
];

function isProtectedPath(pathname) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (routePrefix) => pathname === routePrefix || pathname.startsWith(`${routePrefix}/`),
  );
}

export function AuthProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        // One-time fallback check at app load.
        // If the cookie/session token is stale, this returns null.
        const currentSession = await getValidatedSession();
        if (mounted) setSession(currentSession);
      } catch (error) {
        console.error("Could not load session:", error.message);
        if (mounted) setSession(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSession();

    const subscription = onAuthStateChange((event, nextSession) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        setSession(null);
      } else {
        setSession(nextSession ?? null);
      }

      // Never leave auth UI in loading after any auth event.
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    // Client-side fallback: if auth disappears while on a protected page,
    // force navigation to login instead of leaving the UI in a pending state.
    if (!session && isProtectedPath(pathname)) {
      router.replace("/login");
    }
  }, [loading, pathname, router, session]);

  const signUp = useCallback(async (email, password) => {
    const data = await signUpService(email, password);
    if (data.session) setSession(data.session);
    return data;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const data = await signInService(email, password);
    setSession(data.session ?? null);
    return data;
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await signOutService();
      setSession(null);
    } finally {
      // Ensure UI does not get stuck even if sign-out returns an error.
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signUp,
      signIn,
      signOut,
    }),
    [loading, session, signIn, signOut, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
