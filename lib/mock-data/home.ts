import type {
  HomeStat,
  KnowledgePreview,
  Mentee,
  OpenQuestion,
  Phase,
  Shortcut,
  Task,
  TeamActivity,
  UpcomingCheckIn,
} from "@/lib/types/home";

/*
 * Fase 1 mock data for the new-employee home. Every function below
 * has the same signature it will have once the data moves to
 * Supabase: async + optional user id. The page already `await`s the
 * calls so swapping the body to real queries is a one-file change.
 */

export async function getPhasesForNewEmployee(): Promise<Phase[]> {
  return [
    {
      id: "phase-1",
      title: "Fase 1",
      status: "completed",
      statusLabel: "Afgerond",
      subtitle: "Week 1 · Oriëntatie",
      progress: 100,
    },
    {
      id: "phase-2",
      title: "Fase 2",
      status: "active",
      statusLabel: "Nu actief",
      subtitle: "Week 2-4 · Rolspecifiek",
      progress: 35,
    },
    {
      id: "phase-3",
      title: "Fase 3",
      status: "upcoming",
      statusLabel: "Binnenkort",
      subtitle: "Week 8-12 · Zelfstandig werken",
      progress: 0,
    },
    {
      id: "phase-4",
      title: "Fase 4",
      status: "upcoming",
      statusLabel: "Binnenkort",
      subtitle: "Week 16-26 · Bijdragen & aan de slag",
      progress: 0,
    },
  ];
}

export async function getOpenTasksForNewEmployee(): Promise<Task[]> {
  return [
    {
      id: "task-1",
      title: "Git workflow bij LiNC lezen",
      description:
        "Begrijp hoe we werken met feature branches, pull requests en code review.",
      moduleLabel: "Module 2 · Week 2-4",
      completed: false,
      current: true,
      linkedArticle: {
        title: "Git workflow bij LiNC",
        href: "/mijn-pad/phase-2/2-2",
      },
    },
    {
      id: "task-2",
      title: "Eerste pull request indienen",
      description:
        "Dien je eerste pull request in en doorloop het review proces met een collega.",
      moduleLabel: "Module 2 · Week 2-4",
      completed: false,
      current: false,
    },
    {
      id: "task-3",
      title: "Design tokens in de codebase",
      description:
        "Leer hoe design tokens worden gebruikt en hoe je ze toepast in je components.",
      moduleLabel: "Module 2 · Week 2-4",
      completed: false,
      current: false,
    },
  ];
}

/*
 * Shortcuts are role-agnostic: every dashboard shows the same set.
 * Kept as a single fetcher so the future Supabase query lives in
 * one place.
 */
export async function getShortcuts(): Promise<Shortcut[]> {
  return [
    {
      id: "shortcut-bhv",
      label: "BHV-contacten",
      emoji: "🚨",
      href: "/praktische-info/veiligheid-bhv",
      variant: "bhv",
    },
    {
      id: "shortcut-verlof",
      label: "Verlof aanvragen",
      emoji: "🏖️",
      href: "/praktische-info/verlof-afwezigheid/verlof-aanvragen",
      variant: "default",
    },
    {
      id: "shortcut-checkin",
      label: "Check-in plannen",
      emoji: "📅",
      href: "/mijn-pad",
      variant: "default",
    },
    {
      id: "shortcut-team",
      label: "Team bekijken",
      emoji: "👤",
      href: "/team",
      variant: "default",
    },
  ];
}

export async function getTeamActivityForNewEmployee(): Promise<TeamActivity[]> {
  return [
    {
      id: "activity-1",
      authorName: "Youri",
      authorInitials: "YP",
      avatarColor: "purple",
      action: "plaatste",
      targetTitle: "een nieuw artikel over CSS Grid",
      timeAgo: "2 min geleden",
      href: "/kennisbank/css-grid-basics",
    },
    {
      id: "activity-2",
      authorName: "Joost",
      authorInitials: "JB",
      avatarColor: "orange",
      action: "plaatste",
      targetTitle: "een update over het verlofbeleid",
      timeAgo: "1 uur geleden",
      href: "/praktische-info/verlof-afwezigheid/verlof-aanvragen",
    },
    {
      id: "activity-3",
      authorName: "Lisa",
      authorInitials: "LJ",
      avatarColor: "green",
      action: "plaatste",
      targetTitle: "nieuwe kennisbank over Figma variables",
      timeAgo: "2 uur geleden",
      href: "/kennisbank/figma-variables",
    },
  ];
}

/*
 * Experienced-employee home variant. Same shapes, different tone:
 * stat cards instead of onboarding phases, a feed of open questions
 * the user can answer, and a "Nieuw in kennisbank" panel that
 * surfaces articles the user themselves recently authored.
 */

export async function getStatsForExperiencedEmployee(): Promise<HomeStat[]> {
  return [
    {
      id: "stat-read",
      value: "47",
      label: "Artikelen gelezen",
      caption: "8 deze week",
      captionAccent: "green",
      captionIcon: "trending_up",
    },
    {
      id: "stat-contributions",
      value: "12",
      label: "Eigen bijdragen",
      caption: "1 nieuwe",
      captionAccent: "green",
      captionIcon: "trending_up",
    },
    {
      id: "stat-questions",
      value: "2",
      label: "Open vragen voor jou",
      caption: "Wacht op antwoord",
      captionAccent: "orange",
    },
    {
      id: "stat-new-colleagues",
      value: "3",
      label: "Nieuwe collega's dit kwartaal",
      caption: "In onboarding",
      captionAccent: "purple",
    },
  ];
}

export async function getOpenQuestionsForExperiencedEmployee(): Promise<OpenQuestion[]> {
  return [
    {
      id: "question-1",
      title: "Hoe exporteer ik assets voor retina schermen in Figma?",
      discipline: "Design",
      href: "/kennisbank/figma-retina-assets",
    },
    {
      id: "question-2",
      title: "Hoe maak ik een component aan?",
      discipline: "Design",
      href: "/kennisbank/figma-components",
    },
  ];
}

export async function getTeamActivityForExperiencedEmployee(): Promise<TeamActivity[]> {
  // The feed is identical for now; kept as a separate fetcher so a
  // future Supabase query can filter by the viewer's role.
  return getTeamActivityForNewEmployee();
}

export async function getKnowledgePreviewsForExperiencedEmployee(): Promise<KnowledgePreview[]> {
  return [
    {
      id: "kb-self-1",
      discipline: "Designs",
      title: "De design trends van 2026",
      author: "Jij.",
      timeAgo: "5 uur geleden",
      href: "/kennisbank/design-trends-2026",
    },
    {
      id: "kb-self-2",
      discipline: "Algemeen",
      title: "Presentatietemplate klanten",
      author: "Jij.",
      timeAgo: "2 dagen geleden",
      href: "/kennisbank/presentatietemplate-klanten",
    },
    {
      id: "kb-self-3",
      discipline: "Design",
      title: "Branding richtlijnen LiNC 2026",
      author: "Jij.",
      timeAgo: "1 week geleden",
      href: "/kennisbank/branding-richtlijnen-linc-2026",
    },
  ];
}

export async function getKnowledgePreviewsForNewEmployee(): Promise<KnowledgePreview[]> {
  return [
    {
      id: "kb-1",
      discipline: "Development",
      title: "Tailwind v4 migratiegids voor bestaande projecten",
      author: "Youri P.",
      timeAgo: "2 uur geleden",
      href: "/kennisbank/tailwind-v4-migratiegids",
    },
    {
      id: "kb-2",
      discipline: "Designs",
      title: "De design trends van 2026",
      author: "Roy vK.",
      timeAgo: "5 uur geleden",
      href: "/kennisbank/design-trends-2026",
    },
    {
      id: "kb-3",
      discipline: "Marketing",
      title: "Google Ads AI Max campagnes",
      author: "Pim E.",
      timeAgo: "6 uur geleden",
      href: "/kennisbank/google-ads-ai-max",
    },
  ];
}

/*
 * Mentor home variant. Cards are stat tiles without a caption, the
 * main body shows mentee progress, and the right panel swaps the
 * kennisbank feed for a list of upcoming check-ins.
 */

export async function getStatsForMentor(): Promise<HomeStat[]> {
  return [
    {
      id: "stat-mentees",
      value: "2",
      label: "Medewerkers in begeleiding",
    },
    {
      id: "stat-checkins",
      value: "2",
      label: "Geplande check-ins deze week",
    },
    {
      id: "stat-stalled",
      value: "1",
      label: "Medewerker zonder vooruitgang (4+ d)",
    },
  ];
}

export async function getMenteesForMentor(): Promise<Mentee[]> {
  return [
    {
      id: "mentee-vincent",
      name: "Vincent Roeland",
      roleLabel: "Junior Developer · Week 2",
      initials: "VR",
      avatarColor: "orange",
      progress: 35,
      progressAccent: "orange",
      taskStatus: "2 van de 5 taken voltooid deze week",
      warning: {
        icon: "emergency_home",
        text: "Geen activiteit in 4 dagen",
        accent: "orange",
      },
      href: "/team/vincent-roeland",
    },
    {
      id: "mentee-marco",
      name: "Marco Fijan",
      roleLabel: "Developer · Week 6",
      initials: "MF",
      avatarColor: "purple",
      progress: 75,
      progressAccent: "purple",
      taskStatus: "4 van de 5 taken voltooid deze week",
      href: "/team/marco-fijan",
    },
  ];
}

export async function getUpcomingCheckInsForMentor(): Promise<UpcomingCheckIn[]> {
  return [
    {
      id: "checkin-vincent",
      when: "Vandaag 14:00",
      whenAccent: "orange",
      title: "Check-In met Vincent Roeland",
      subtitle: "Week 2 check-in · Development rolpad",
      href: "/team/vincent-roeland",
    },
    {
      id: "checkin-marco",
      when: "Vrijdag 10:00",
      whenAccent: "purple",
      title: "Check-In met Marco Fijan",
      subtitle: "Wekelijkse check-in · Development ontwikkeling",
      href: "/team/marco-fijan",
    },
  ];
}

export async function getTeamActivityForMentor(): Promise<TeamActivity[]> {
  // Same feed as the other variants for now; a future Supabase query
  // can scope this to the mentees the current user supervises.
  return getTeamActivityForNewEmployee();
}
