/*
 * Types for the Mijn Pad (onboarding path) page. A path has 4
 * phases, each with 4 modules. Modules (not individual tasks) are
 * the unit of display on this page — individual tasks live one
 * level deeper and are rendered on the module detail page.
 */

export type PhaseStatus = "completed" | "active" | "upcoming";
export type ModuleState = "completed" | "active" | "locked";
export type TaskState = "completed" | "active" | "todo";

export interface PathTask {
  id: string;
  title: string;
  description: string;
  state: TaskState;
  /** Optional deep link to e.g. a knowledge base article. */
  href?: string;
  /** Display label for the active-task inline link ("Bekijk …"). */
  linkLabel?: string;
}

export interface PathModule {
  id: string;
  title: string;
  xpReward: number;
  state: ModuleState;
  /**
   * Longer description shown underneath the title on the phase
   * detail page. Optional — not rendered on the phase overview.
   */
  description?: string;
  /** Present for active modules — deep link to open the module. */
  href?: string;
  /** Present for locked modules — name of the blocking predecessor. */
  unlockingModule?: string;
  /** Task list — populated for the module detail page. */
  tasks?: PathTask[];
}

export interface PathPhase {
  id: string;
  /** Short card title shown at the top of the page, e.g. "Fase 1". */
  title: string;
  /** Short subtitle on the top card, e.g. "Week 1 · Oriëntatie". */
  subtitle: string;
  /** Long title shown on the expanded section card. */
  sectionTitle: string;
  /** Paragraph shown under the heading on the phase detail page. */
  description: string;
  status: PhaseStatus;
  /** "Afgerond" / "Nu actief" / "Binnenkort". */
  statusLabel: string;
  /** 0–100. */
  progress: number;
  modules: PathModule[];
}

export interface OnboardingPath {
  /** e.g. "Development rolpad". */
  roleName: string;
  currentWeek: number;
  totalWeeks: number;
  /** 0–100 overall progress. */
  progress: number;
  mentorName: string;
  phases: PathPhase[];
}
