import "server-only";

import { createClient } from "@/lib/supabase/server";

/*
 * Thin wrapper around fetch() that adds the signed-in user's
 * Google OAuth access token to a request, and — crucially —
 * automatically refreshes the token when Google returns 401
 * because the access token is expired. Supabase stores the
 * refresh token as `provider_refresh_token` on the session, but
 * it doesn't automatically hand out fresh access tokens for
 * external providers. We do that ourselves by posting to
 * Google's token endpoint with the stored refresh token.
 *
 * Usage:
 *
 *   const res = await fetchWithGoogle("https://www.googleapis.com/...", {
 *     method: "POST",
 *     body: JSON.stringify(body),
 *   });
 *
 * The returned Response is either:
 *   - the successful original response,
 *   - the successful retry response after refresh,
 *   - or the original 401 when refresh is unavailable / failed.
 *
 * Returns `null` when the user has no provider token on their
 * session at all (not logged in with Google or scope never granted).
 */
export async function fetchWithGoogle(input: string, init: RequestInit = {}): Promise<Response | null> {
  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.provider_token ?? null;
  const refreshToken = sessionData.session?.provider_refresh_token ?? null;

  if (!accessToken) return null;

  const attempt = (token: string) =>
    fetch(input, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

  let res = await attempt(accessToken);
  if (res.status !== 401) return res;

  // Token expired. Try to refresh via Google's token endpoint.
  if (!refreshToken) return res;
  const fresh = await refreshGoogleAccessToken(refreshToken);
  if (!fresh) return res;

  return attempt(fresh);
}

async function refreshGoogleAccessToken(refreshToken: string): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.warn("[google] cannot refresh provider token — GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set in env");
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn("[google] refresh failed:", res.status, body);
      return null;
    }
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch (err) {
    console.error("[google] refresh threw:", err);
    return null;
  }
}
