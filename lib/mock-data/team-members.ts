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
  /** Google Chat handle shown in the profile contact section. */
  chatHandle?: string;

  /* ── Profile-only fields (used on /team/[slug]) ─────────── */

  /** Current LiNC Connect XP. */
  xp?: number;
  /** Tier label ("Tier 1", "Tier 2", …). */
  xpTier?: string;
  /** XP needed to reach the next tier. */
  xpTarget?: number;
  /** Free-text about section. */
  bio?: string;
  /** `public/images/badge-*.webp` slugs the member has earned. */
  earnedBadges?: ProfileBadge[];
  publishedArticlesCount?: number;
  answeredQuestionsCount?: number;
  yearsAtLinc?: number;
}

export interface ProfileBadge {
  /** Public `/images/…` path to the badge image. */
  src: string;
  /** Small caption shown under the badge. */
  label: string;
  /** XP awarded for earning this badge — shown below the label. */
  xp?: number;
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
 * Default profile fields applied to any team member that doesn't
 * declare them in the mock — so /team/[slug] always has stats,
 * badges, and a bio to render.
 */
export const DEFAULT_PROFILE: Partial<TeamMember> = {
  xp: 250,
  xpTier: "Tier 17",
  xpTarget: 1500,
  bio: "Lorem ipsum dolor sit amet consectetur. Id malesuada faucibus in elit. Bibendum ullamcorper ut sed urna id magna scelerisque eros sed. Bibendum quisque tristique sed tortor ultrices fermentum volutpat amet.",
  earnedBadges: [
    { src: "/images/badge-fase-1.webp", label: "Oriëntatie voltooid", xp: 1000 },
    { src: "/images/badge-fase-2.webp", label: "Rolspecifieke basis", xp: 1250 },
    { src: "/images/badge-eerste-artikel.webp", label: "Eerste artikel", xp: 100 },
    { src: "/images/badge-10-vragen-antwoord.webp", label: "10 vragen beantwoord", xp: 250 },
    { src: "/images/badge-fase-3.webp", label: "Zelfstandig werken", xp: 1500 },
    { src: "/images/badge-alle-fases-voltooid.webp", label: "Volledig ingewerkt", xp: 1500 },
  ],
  publishedArticlesCount: 6,
  answeredQuestionsCount: 34,
  yearsAtLinc: 5,
};

export function getTeamMemberWithProfile(slug: string): TeamMember | undefined {
  const match = getTeamMember(slug);
  if (!match) return undefined;
  return { ...DEFAULT_PROFILE, ...match };
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
