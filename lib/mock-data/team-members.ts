/*
 * Team & Expertise mock. These users would normally come from a
 * `profiles` table populated from Supabase Auth on sign-up; for
 * now we hard-code a handful to demo the filter/list UI.
 *
 * `email` is the key used to match the signed-in user — when the
 * Supabase session email matches an entry here the team card is
 * rendered with the "JU" badge and a "Bewerk profiel" CTA.
 */

export type TeamDiscipline = "marketing" | "development" | "account-pm" | "design";

export interface TeamDisciplineOption {
  id: TeamDiscipline;
  label: string;
}

export const TEAM_DISCIPLINES: TeamDisciplineOption[] = [
  { id: "marketing", label: "Marketing" },
  { id: "development", label: "Development" },
  { id: "account-pm", label: "Account / PM" },
  { id: "design", label: "Design" },
];

export interface TeamMember {
  /** URL slug used for the profile detail route. */
  slug: string;
  /** Matching key for "is this the signed-in user?". */
  email: string;
  name: string;
  jobTitle: string;
  discipline: TeamDiscipline;
  /**
   * Free-text expertise labels. Rendered as purple pills on the
   * card and used to populate the "Expertises" sidebar filter.
   */
  expertises: string[];
  /** Public `/images/…` path; falls back to coloured initials. */
  photoUrl?: string;
  phone?: string;
}

export const teamMembers: TeamMember[] = [
  {
    slug: "youri-pols",
    email: "youri@linc.nl",
    name: "Youri Pols",
    jobTitle: "Developer & Innovation Manager",
    discipline: "development",
    expertises: ["WordPress", "Figma", "AI"],
    phone: "+31612345670",
  },
  {
    slug: "joost-bakkers",
    email: "joost@linc.nl",
    name: "Joost Bakkers",
    jobTitle: "Senior Developer",
    discipline: "development",
    expertises: ["WordPress", "Figma", "AI"],
    phone: "+31612345671",
  },
  {
    slug: "lisa-jansen",
    email: "lisa@linc.nl",
    name: "Lisa Jansen",
    jobTitle: "Content Strategist",
    discipline: "marketing",
    expertises: ["WordPress", "Figma", "AI"],
    phone: "+31612345672",
  },
  {
    slug: "sophie-de-vries",
    email: "sophie@linc.nl",
    name: "Sophie de Vries",
    jobTitle: "Account Manager",
    discipline: "account-pm",
    expertises: ["WordPress", "Figma", "AI"],
    phone: "+31612345673",
  },
  {
    slug: "roy-van-kasteren",
    email: "roy@linc.nl",
    name: "Roy van Kasteren",
    jobTitle: "Senior Designer",
    discipline: "design",
    expertises: ["WordPress", "Figma", "AI"],
    phone: "+31612345674",
  },
  {
    slug: "thomas-bakker",
    email: "thomas@linc.nl",
    name: "Thomas Bakker",
    jobTitle: "Full-stack Developer",
    discipline: "development",
    expertises: ["WordPress", "AI", "Figma"],
    phone: "+31612345675",
  },
  {
    slug: "daan-willems",
    email: "daan@linc.nl",
    name: "Daan Willems",
    jobTitle: "Project Manager",
    discipline: "account-pm",
    expertises: ["AI"],
    phone: "+31612345676",
  },
  {
    slug: "emma-van-dijk",
    email: "emma@linc.nl",
    name: "Emma van Dijk",
    jobTitle: "Digital Strategist",
    discipline: "marketing",
    expertises: ["Figma", "AI"],
    phone: "+31612345677",
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug);
}

/*
 * Merge team metadata (jobTitle / discipline / expertises) from
 * the mock into a list of users pulled from Supabase. Users
 * without a matching mock entry get sensible defaults and land
 * in the "Development" bucket — so the page still surfaces them.
 */
export interface SupabaseTeamUser {
  email: string;
  name: string;
  photoUrl?: string;
}

export function mergeTeamMembers(users: SupabaseTeamUser[]): TeamMember[] {
  return users.map((u) => {
    const email = u.email.toLowerCase();
    const mock = teamMembers.find((m) => m.email.toLowerCase() === email);
    if (mock) {
      return {
        ...mock,
        name: u.name || mock.name,
        photoUrl: u.photoUrl ?? mock.photoUrl,
      };
    }
    const local = email.split("@")[0] ?? "";
    return {
      slug: local || `user-${Math.random().toString(36).slice(2, 8)}`,
      email,
      name: u.name,
      jobTitle: "Medewerker",
      discipline: "development",
      // Demo: until real profile tags land in Supabase, give every
      // team member the same default trio so the cards look filled.
      expertises: ["WordPress", "Figma", "AI"],
      photoUrl: u.photoUrl,
    };
  });
}
