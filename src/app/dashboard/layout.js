import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Dashboard layout — server-side double-check of auth + onboarding.
 * Middleware handles the common path; this is a safety net for direct
 * server renders that bypass middleware (e.g. prefetch, RSC fetches).
 */
export default async function DashboardLayout({ children }) {
  const supabase = await createClient();

  // getUser() re-validates the token with the Supabase Auth server.
  // Never use getSession() in server components/layouts for security checks.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded, active_organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarded || !profile?.active_organization_id) {
    redirect("/onboarding/create-organization");
  }

  return <>{children}</>;
}
