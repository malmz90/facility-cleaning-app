"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  getSession,
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

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const currentSession = await getSession();
        if (mounted) setSession(currentSession);
      } catch (error) {
        console.error("Could not load session:", error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSession();

    const subscription = onAuthStateChange((nextSession) => {
      if (mounted) setSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

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
    await signOutService();
    setSession(null);
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
