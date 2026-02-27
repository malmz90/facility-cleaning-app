import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";

/**
 * Dashboard layout — server-side auth + onboarding guard.
 * Passes the authenticated user's email down to the client-side shell
 * so the sidebar can display it without an extra client fetch.
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

  return (
    <DashboardShell userEmail={user.email}>
      {children}
    </DashboardShell>
  );
}
