import { createClient } from "@supabase/supabase-js";

/*
 * Service-role Supabase client. Only import this from server code
 * (route handlers, server components, server actions) — it has
 * full admin rights and MUST NEVER leak to the browser bundle.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local. Returns null if
 * the key is missing so callers can fall back gracefully rather
 * than crashing the page.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
