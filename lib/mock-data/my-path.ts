import type { OnboardingPath, PathModule, PathTask } from "@/lib/types/my-path";

/*
 * 35% progress mock so the UI shows all three module states in the
 * active phase: one completed, one active, two locked. The first
 * phase is fully completed (4/4 modules) and the last two are
 * upcoming placeholders.
 */

const MODULE_DESCRIPTION =
  "Lorem ipsum dolor sit amet consectetur. Risus vestibulum integer leo sollicitudin viverra.";
const PHASE_DESCRIPTION =
  "Lorem ipsum dolor sit amet consectetur. Id malesuada faucibus in elit. Bibendum ullamcorper ut sed urna id magna scelerisque eros sed. Bibendum quisque tristique sed tortor ultrices fermentum volutpat amet. Lectus ultrices aliquet donec mattis. In cras sit sit pretium. Dictum sed et volutpat egestas mauris cursus ornare. Risus euismod malesuada.";

/*
 * Task list used on the active module detail page. The first two
 * are completed out-of-the-box so the user sees the "2 of 5 done"
 * starting state; the remaining three are interactive in the demo.
 */
const DEMO_TASKS: PathTask[] = [
  {
    id: "task-1",
    title: "Lorem ipsum dolor sit amet",
    description: MODULE_DESCRIPTION,
    state: "completed",
    href: "#",
    linkLabel: "Bekijk Lorem ipsum dolor sit amet",
  },
  {
    id: "task-2",
    title: "Lorem ipsum dolor sit amet",
    description: MODULE_DESCRIPTION,
    state: "completed",
    href: "#",
    linkLabel: "Bekijk Lorem ipsum dolor sit amet",
  },
  {
    id: "task-3",
    title: "Lorem ipsum dolor sit amet",
    description: MODULE_DESCRIPTION,
    state: "active",
    href: "#",
    linkLabel: "Bekijk Lorem ipsum dolor sit amet",
  },
  {
    id: "task-4",
    title: "Lorem ipsum dolor sit amet",
    description: MODULE_DESCRIPTION,
    state: "todo",
  },
  {
    id: "task-5",
    title: "Lorem ipsum dolor sit amet",
    description: MODULE_DESCRIPTION,
    state: "todo",
  },
];

const placeholderModules: PathModule[] = [
  {
    id: "mod-a",
    title: "Lorem ipsum dolor sit amet",
    description: MODULE_DESCRIPTION,
    xpReward: 150,
    state: "locked",
  },
  {
    id: "mod-b",
    title: "Lorem ipsum dolor sit amet",
    description: MODULE_DESCRIPTION,
    xpReward: 50,
    state: "locked",
  },
  {
    id: "mod-c",
    title: "Lorem ipsum dolor sit amet",
    description: MODULE_DESCRIPTION,
    xpReward: 50,
    state: "locked",
  },
  {
    id: "mod-d",
    title: "Lorem ipsum dolor sit amet",
    description: MODULE_DESCRIPTION,
    xpReward: 50,
    state: "locked",
  },
];

export const onboardingPath: OnboardingPath = {
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
        description: PHASE_DESCRIPTION,
        status: "completed",
        statusLabel: "Afgerond",
        progress: 100,
        modules: [
          {
            id: "1-1",
            title: "Lorem ipsum dolor sit amet",
            description: MODULE_DESCRIPTION,
            xpReward: 150,
            state: "completed",
          },
          {
            id: "1-2",
            title: "Lorem ipsum dolor sit amet",
            description: MODULE_DESCRIPTION,
            xpReward: 50,
            state: "completed",
          },
          {
            id: "1-3",
            title: "Lorem ipsum dolor sit amet",
            description: MODULE_DESCRIPTION,
            xpReward: 50,
            state: "completed",
          },
          {
            id: "1-4",
            title: "Lorem ipsum dolor sit amet",
            description: MODULE_DESCRIPTION,
            xpReward: 50,
            state: "completed",
          },
        ],
      },
      {
        id: "phase-2",
        title: "Fase 2",
        subtitle: "Week 2-4 · Rolspecifiek",
        sectionTitle: "Week 2-4 - Rolspecifieke basis",
        description: PHASE_DESCRIPTION,
        status: "active",
        statusLabel: "Nu actief",
        progress: 35,
        modules: [
          {
            id: "2-1",
            title: "Lorem ipsum dolor sit amet",
            description: MODULE_DESCRIPTION,
            xpReward: 150,
            state: "completed",
          },
          {
            id: "2-2",
            title: "Lorem ipsum dolor sit amet",
            description: MODULE_DESCRIPTION,
            xpReward: 50,
            state: "active",
            href: "/mijn-pad/phase-2/2-2",
            tasks: DEMO_TASKS,
          },
          {
            id: "2-3",
            title: "Lorem ipsum dolor sit amet",
            description: MODULE_DESCRIPTION,
            xpReward: 50,
            state: "locked",
            unlockingModule: "Lorem ipsum dolor sit amet",
          },
          {
            id: "2-4",
            title: "Lorem ipsum dolor sit amet",
            description: MODULE_DESCRIPTION,
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
        description: PHASE_DESCRIPTION,
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
        description: PHASE_DESCRIPTION,
        status: "upcoming",
        statusLabel: "Binnenkort",
        progress: 0,
        modules: placeholderModules,
      },
  ],
};

export async function getOnboardingPath(): Promise<OnboardingPath> {
  return onboardingPath;
}
