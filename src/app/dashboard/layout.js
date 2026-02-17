import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Dashboard layout - Server Component that ensures authentication
 * This runs on the server before rendering any dashboard pages
 */
export default async function DashboardLayout({ children }) {
  const supabase = await createClient();

  // Check if user is authenticated on the server
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, redirect to login (server-side redirect)
  if (!session) {
    redirect("/login");
  }

  // User is authenticated, render the dashboard content
  return <>{children}</>;
}
