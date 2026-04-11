/*
 * Types for the home dashboards. These mirror what a future Supabase
 * response would return so the mock data, page queries and components
 * can all move to real data without changing call sites.
 */

export type PhaseStatus = "completed" | "active" | "upcoming";

export interface Phase {
  id: string;
  title: string;
  statusLabel: string;
  status: PhaseStatus;
  subtitle: string;
  progress: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  moduleLabel: string;
  completed: boolean;
  current: boolean;
  linkedArticle?: {
    title: string;
    href: string;
  };
}

export type ShortcutVariant = "default" | "bhv";

export interface Shortcut {
  id: string;
  label: string;
  emoji: string;
  href: string;
  variant: ShortcutVariant;
}

export interface KnowledgePreview {
  id: string;
  discipline: string;
  title: string;
  author: string;
  timeAgo: string;
  href: string;
}

export type StatAccent = "green" | "orange" | "purple";

export interface HomeStat {
  id: string;
  value: string;
  label: string;
  caption?: string;
  captionAccent?: StatAccent;
  /** Optional Material Symbols icon name rendered before the caption. */
  captionIcon?: string;
}

export interface OpenQuestion {
  id: string;
  title: string;
  discipline: string;
  href: string;
}

export type AvatarColor = "orange" | "purple" | "green" | "red";

export interface Mentee {
  id: string;
  name: string;
  /** e.g. "Junior Developer · Week 2" */
  roleLabel: string;
  photoUrl?: string;
  initials: string;
  avatarColor: AvatarColor;
  progress: number;
  progressAccent: StatAccent;
  /** e.g. "2 van de 5 taken voltooid deze week" */
  taskStatus: string;
  /** Optional flag shown above `taskStatus` when a mentee needs attention. */
  warning?: {
    icon: string;
    text: string;
    accent: StatAccent;
  };
  href: string;
}

export interface UpcomingCheckIn {
  id: string;
  /** e.g. "Vandaag 14:00" / "Vrijdag 10:00" */
  when: string;
  whenAccent: StatAccent;
  title: string;
  subtitle: string;
  href: string;
}

export interface TeamActivity {
  id: string;
  authorName: string;
  authorInitials: string;
  authorPhotoUrl?: string;
  avatarColor: AvatarColor;
  action: string;
  targetTitle: string;
  timeAgo: string;
  href: string;
}
