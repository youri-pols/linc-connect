/*
 * Types and display config for the kennisbank. Matches what a
 * future Supabase query will return so the mock data + page can
 * swap to real queries without changing call sites.
 */

export type KnowledgeDiscipline =
  | "marketing"
  | "account"
  | "design"
  | "algemeen"
  | "development";

export type KnowledgeCategory =
  | "werkprocessen"
  | "best-practices"
  | "tools-setup"
  | "troubleshooting"
  | "templates";

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  discipline: KnowledgeDiscipline;
  category: KnowledgeCategory;
  authorName: string;
  authorPhotoUrl?: string;
  /** Pre-formatted Dutch date, e.g. "18 februari 2026". */
  updatedAtText: string;
  readingTimeMinutes: number;
  commentCount: number;
  /** Populated when an article has unanswered Q&A threads. */
  openQuestionsCount?: number;
  /** Marks the article as potentially outdated. */
  isStale?: boolean;
}

export const KNOWLEDGE_DISCIPLINES: Array<{
  id: KnowledgeDiscipline;
  label: string;
}> = [
  { id: "marketing", label: "Marketing" },
  { id: "account", label: "Account / PM" },
  { id: "design", label: "Design" },
  { id: "algemeen", label: "Algemeen" },
  { id: "development", label: "Development" },
];

export const KNOWLEDGE_CATEGORIES: Array<{
  id: KnowledgeCategory;
  label: string;
}> = [
  { id: "werkprocessen", label: "Werkprocessen" },
  { id: "best-practices", label: "Best practices" },
  { id: "tools-setup", label: "Tools & Setup" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "templates", label: "Templates" },
];
