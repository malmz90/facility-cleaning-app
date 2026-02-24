import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with service-role privileges.
 * Only call this from trusted server-side code (Server Actions, Route Handlers).
 * Never expose this client or the service role key to the browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
