import {
  OnboardingPath,
  PathPhase,
  PathTask,
  UserPathEnrollment,
  TaskCompletion,
} from "@/lib/types";

export const onboardingPaths: OnboardingPath[] = [
  {
    id: "path-1",
    role_id: "role-1",
    title: "Development Onboarding",
    description: "Onboarding pad voor nieuwe developers bij LiNC",
    created_at: "2025-01-01T09:00:00Z",
  },
  {
    id: "path-2",
    role_id: "role-1",
    title: "Design Onboarding",
    description: "Onboarding pad voor nieuwe designers bij LiNC",
    created_at: "2025-01-01T09:00:00Z",
  },
  {
    id: "path-3",
    role_id: "role-1",
    title: "Marketing Onboarding",
    description: "Onboarding pad voor nieuwe marketeers bij LiNC",
    created_at: "2025-01-01T09:00:00Z",
  },
  {
    id: "path-4",
    role_id: "role-1",
    title: "Account / PM Onboarding",
    description: "Onboarding pad voor nieuwe account managers en project managers",
    created_at: "2025-01-01T09:00:00Z",
  },
];

export const pathPhases: PathPhase[] = [
  // Development path phases
  { id: "phase-1", path_id: "path-1", title: "Week 1", week_from: 1, week_to: 1, order_index: 0 },
  { id: "phase-2", path_id: "path-1", title: "Week 2-4", week_from: 2, week_to: 4, order_index: 1 },
  { id: "phase-3", path_id: "path-1", title: "Week 5-12", week_from: 5, week_to: 12, order_index: 2 },
  { id: "phase-4", path_id: "path-1", title: "Week 13-24", week_from: 13, week_to: 24, order_index: 3 },
];

export const pathTasks: PathTask[] = [
  // Phase 1: Week 1
  {
    id: "task-1",
    phase_id: "phase-1",
    title: "Werkplek inrichten",
    description: "Laptop instellen, accounts aanmaken, ontwikkelomgeving opzetten",
    article_id: null,
    order_index: 0,
  },
  {
    id: "task-2",
    phase_id: "phase-1",
    title: "Kennismaken met het team",
    description: "Introductieronde langs alle teamleden",
    article_id: null,
    order_index: 1,
  },
  {
    id: "task-3",
    phase_id: "phase-1",
    title: "Git workflow lezen",
    description: "Lees het artikel over de Git workflow bij LiNC",
    article_id: "art-1",
    order_index: 2,
  },
  {
    id: "task-4",
    phase_id: "phase-1",
    title: "BHV-procedures doorlezen",
    description: "Maak jezelf bekend met de veiligheids- en BHV-procedures",
    article_id: "art-6",
    order_index: 3,
  },
  // Phase 2: Week 2-4
  {
    id: "task-5",
    phase_id: "phase-2",
    title: "Eerste feature branch aanmaken",
    description: "Maak een feature branch aan voor je eerste taak",
    article_id: "art-1",
    order_index: 0,
  },
  {
    id: "task-6",
    phase_id: "phase-2",
    title: "Code review proces doorlopen",
    description: "Dien je eerste pull request in en doorloop het review proces",
    article_id: null,
    order_index: 1,
  },
  {
    id: "task-7",
    phase_id: "phase-2",
    title: "Design tokens begrijpen",
    description: "Leer hoe design tokens worden gebruikt in de codebase",
    article_id: "art-2",
    order_index: 2,
  },
  // Phase 3: Week 5-12
  {
    id: "task-8",
    phase_id: "phase-3",
    title: "Zelfstandig features ontwikkelen",
    description: "Werk zelfstandig aan toegewezen features met minimale begeleiding",
    article_id: null,
    order_index: 0,
  },
  {
    id: "task-9",
    phase_id: "phase-3",
    title: "Kennisbank artikel schrijven",
    description: "Schrijf je eerste artikel voor de kennisbank over een onderwerp dat je hebt geleerd",
    article_id: null,
    order_index: 1,
  },
  // Phase 4: Week 13-24
  {
    id: "task-10",
    phase_id: "phase-4",
    title: "Junior collega begeleiden",
    description: "Help een nieuwere collega bij hun onboarding",
    article_id: null,
    order_index: 0,
  },
];

export const userPathEnrollments: UserPathEnrollment[] = [
  {
    id: "enroll-1",
    user_id: "user-1", // Sophie - nieuwe medewerker
    path_id: "path-1",
    mentor_id: "user-3", // Joost - begeleider
    started_at: "2026-03-15T09:00:00Z",
  },
  {
    id: "enroll-2",
    user_id: "user-6", // Emma
    path_id: "path-2",
    mentor_id: "user-3",
    started_at: "2026-02-01T09:00:00Z",
  },
];

export const taskCompletions: TaskCompletion[] = [
  // Sophie heeft de eerste 2 taken afgerond
  { id: "tc-1", user_id: "user-1", task_id: "task-1", completed_at: "2026-03-16T12:00:00Z" },
  { id: "tc-2", user_id: "user-1", task_id: "task-2", completed_at: "2026-03-17T10:00:00Z" },
  // Emma heeft fase 1 helemaal af
  { id: "tc-3", user_id: "user-6", task_id: "task-1", completed_at: "2026-02-03T11:00:00Z" },
  { id: "tc-4", user_id: "user-6", task_id: "task-2", completed_at: "2026-02-03T14:00:00Z" },
  { id: "tc-5", user_id: "user-6", task_id: "task-3", completed_at: "2026-02-04T10:00:00Z" },
  { id: "tc-6", user_id: "user-6", task_id: "task-4", completed_at: "2026-02-04T15:00:00Z" },
];

export function getPhasesForPath(pathId: string): PathPhase[] {
  return pathPhases.filter((p) => p.path_id === pathId).sort((a, b) => a.order_index - b.order_index);
}

export function getTasksForPhase(phaseId: string): PathTask[] {
  return pathTasks.filter((t) => t.phase_id === phaseId).sort((a, b) => a.order_index - b.order_index);
}

export function isTaskCompleted(userId: string, taskId: string): boolean {
  return taskCompletions.some((tc) => tc.user_id === userId && tc.task_id === taskId);
}

export function getCompletionPercentage(userId: string, phaseId: string): number {
  const tasks = getTasksForPhase(phaseId);
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => isTaskCompleted(userId, t.id)).length;
  return Math.round((completed / tasks.length) * 100);
}

export function getEnrollmentForUser(userId: string): UserPathEnrollment | undefined {
  return userPathEnrollments.find((e) => e.user_id === userId);
}
