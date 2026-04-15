import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_PROFILE,
  mergeTeamMembers,
  teamMembers as mockTeamMembers,
  type SupabaseTeamUser,
  type TeamMember,
} from "@/lib/mock-data/team-members";

/*
 * Server-only helpers that build the "live" team list by pulling
 * users from Supabase Auth (admin API) and merging our mock
 * metadata onto each of them. Used by both the team index and
 * the member detail page so they always see the same roster —
 * that way clicking a card for a Supabase-only user on the index
 * resolves to an actual profile page instead of 404-ing.
 *
 * If the service-role key is missing we fall back to the pure
 * mock so local dev without `SUPABASE_SERVICE_ROLE_KEY` still
 * works.
 */
export async function listTeamMembers(): Promise<TeamMember[]> {
  const admin = createAdminClient();
  if (!admin) return mockTeamMembers;

  const { data } = await admin.auth.admin.listUsers({ perPage: 200 });
  const supabaseUsers: SupabaseTeamUser[] = (data?.users ?? [])
    .filter((u) => !!u.email)
    .map((u) => {
      const meta = u.user_metadata ?? {};
      const name = (meta.full_name as string | undefined) || (meta.name as string | undefined) || u.email!.split("@")[0];
      return {
        email: u.email!,
        name,
        photoUrl: meta.avatar_url as string | undefined,
      };
    });

  if (supabaseUsers.length === 0) return mockTeamMembers;
  return mergeTeamMembers(supabaseUsers);
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | undefined> {
  const members = await listTeamMembers();
  return members.find((m) => m.slug === slug);
}

/*
 * Same as `getTeamMemberBySlug` but with the shared profile
 * defaults (bio / badges / stats) layered underneath the member's
 * own data. Lets every member — including Supabase-only users
 * without a mock entry — render a full detail page.
 */
export async function getTeamMemberBySlugWithProfile(
  slug: string,
): Promise<TeamMember | undefined> {
  const match = await getTeamMemberBySlug(slug);
  if (!match) return undefined;
  return { ...DEFAULT_PROFILE, ...match };
}
