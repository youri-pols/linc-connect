import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  mergeTeamMembers,
  teamMembers as mockTeamMembers,
  type SupabaseTeamUser,
} from "@/lib/mock-data/team-members";
import { TeamView } from "./team-view";

/*
 * Server entry for Team & Expertise. Lists every signed-up user
 * from Supabase Auth (via the admin API) so real Google photos +
 * emails land on the cards, then merges in our mock job title /
 * discipline / expertise metadata by matching on email.
 *
 * If the admin key is missing we fall back to the pure mock so
 * the page keeps working locally without the service-role key.
 */
export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentUserEmail = user?.email;
  const currentUserPhotoUrl = user?.user_metadata?.avatar_url as
    | string
    | undefined;

  const admin = createAdminClient();
  let members = mockTeamMembers;
  if (admin) {
    /*
     * `listUsers` returns up to 1000 users per page — more than
     * enough for LiNC for now. We only need a small projection,
     * so we pick out the bits used by the card.
     */
    const { data } = await admin.auth.admin.listUsers({ perPage: 200 });
    const supabaseUsers: SupabaseTeamUser[] = (data?.users ?? [])
      .filter((u) => !!u.email)
      .map((u) => {
        const meta = u.user_metadata ?? {};
        const name =
          (meta.full_name as string | undefined) ||
          (meta.name as string | undefined) ||
          u.email!.split("@")[0];
        return {
          email: u.email!,
          name,
          photoUrl: meta.avatar_url as string | undefined,
        };
      });
    if (supabaseUsers.length > 0) {
      members = mergeTeamMembers(supabaseUsers);
    }
  }

  return (
    <TeamView
      members={members}
      currentUserEmail={currentUserEmail}
      currentUserPhotoUrl={currentUserPhotoUrl}
    />
  );
}
