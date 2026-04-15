import type { OnboardingPath, PathModule } from "@/lib/types/my-path";

/*
 * 35% progress mock so the UI shows all three module states in the
 * active phase: one completed, one active, two locked. The first
 * phase is fully completed (4/4 modules) and the last two are
 * upcoming placeholders.
 */

const placeholderModules: PathModule[] = [
  { id: "mod-a", title: "Lorem ipsum dolor sit amet", xpReward: 150, state: "locked" },
  { id: "mod-b", title: "Lorem ipsum dolor sit amet", xpReward: 50, state: "locked" },
  { id: "mod-c", title: "Lorem ipsum dolor sit amet", xpReward: 50, state: "locked" },
  { id: "mod-d", title: "Lorem ipsum dolor sit amet", xpReward: 50, state: "locked" },
];

export async function getOnboardingPath(): Promise<OnboardingPath> {
  return {
    roleName: "Development rolpad",
    currentWeek: 2,
    totalWeeks: 26,
    progress: 35,
    mentorName: "Youri Pols",
    phases: [
      {
        id: "phase-1",
        title: "Fase 1",
        subtitle: "Week 1 · Oriëntatie",
        sectionTitle: "Week 1 - Oriëntatie",
        status: "completed",
        statusLabel: "Afgerond",
        progress: 100,
        modules: [
          { id: "1-1", title: "Lorem ipsum dolor sit amet", xpReward: 150, state: "completed" },
          { id: "1-2", title: "Lorem ipsum dolor sit amet", xpReward: 50, state: "completed" },
          { id: "1-3", title: "Lorem ipsum dolor sit amet", xpReward: 50, state: "completed" },
          { id: "1-4", title: "Lorem ipsum dolor sit amet", xpReward: 50, state: "completed" },
        ],
      },
      {
        id: "phase-2",
        title: "Fase 2",
        subtitle: "Week 2-4 · Rolspecifiek",
        sectionTitle: "Week 2-4 - Rolspecifieke basis",
        status: "active",
        statusLabel: "Nu actief",
        progress: 35,
        modules: [
          { id: "2-1", title: "Lorem ipsum dolor sit amet", xpReward: 150, state: "completed" },
          {
            id: "2-2",
            title: "Lorem ipsum dolor sit amet",
            xpReward: 50,
            state: "active",
            href: "/mijn-pad/fase-2/module-2-2",
          },
          {
            id: "2-3",
            title: "Lorem ipsum dolor sit amet",
            xpReward: 50,
            state: "locked",
            unlockingModule: "Lorem ipsum dolor sit amet",
          },
          {
            id: "2-4",
            title: "Lorem ipsum dolor sit amet",
            xpReward: 50,
            state: "locked",
            unlockingModule: "Lorem ipsum dolor sit amet",
          },
        ],
      },
      {
        id: "phase-3",
        title: "Fase 3",
        subtitle: "Week 8-12 · Zelfstandig werken",
        sectionTitle: "Week 8-12 - Zelfstandig werken",
        status: "upcoming",
        statusLabel: "Binnenkort",
        progress: 0,
        modules: placeholderModules,
      },
      {
        id: "phase-4",
        title: "Fase 4",
        subtitle: "Week 16-26 · Bijdragen & aan de slag",
        sectionTitle: "Week 16-26 - Bijdragen & aan de slag",
        status: "upcoming",
        statusLabel: "Binnenkort",
        progress: 0,
        modules: placeholderModules,
      },
    ],
  };
}
