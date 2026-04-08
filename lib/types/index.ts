export type RoleName = "medewerker" | "content_eigenaar" | "begeleider" | "administrator";
export type ExpertiseLevel = "beginner" | "werkkennis" | "expert";
export type ArticleType = "kennisbank" | "praktisch";
export type DashboardVariant = "nieuw" | "ervaren" | "begeleider";

export interface Role {
  id: string;
  name: RoleName;
  description: string;
}

export interface User {
  id: string;
  google_id: string;
  name: string;
  email: string;
  photo_url: string;
  role_id: string;
  created_at: string;
  last_login: string;
}

export interface Article {
  id: string;
  title: string;
  content_md: string;
  category: string;
  discipline: string;
  author_id: string;
  owner_id: string;
  type: ArticleType;
  is_stale: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  article_id: string;
  author_id: string;
  title: string;
  body: string;
  is_resolved: boolean;
  created_at: string;
}

export interface Answer {
  id: string;
  question_id: string;
  author_id: string;
  body: string;
  is_accepted: boolean;
  created_at: string;
}

export interface OnboardingPath {
  id: string;
  role_id: string;
  title: string;
  description: string;
  created_at: string;
}

export interface PathPhase {
  id: string;
  path_id: string;
  title: string;
  week_from: number;
  week_to: number;
  order_index: number;
}

export interface PathTask {
  id: string;
  phase_id: string;
  title: string;
  description: string;
  article_id: string | null;
  order_index: number;
}

export interface UserPathEnrollment {
  id: string;
  user_id: string;
  path_id: string;
  mentor_id: string;
  started_at: string;
}

export interface TaskCompletion {
  id: string;
  user_id: string;
  task_id: string;
  completed_at: string;
}

export interface Expertise {
  id: string;
  name: string;
  discipline: string;
}

export interface UserExpertise {
  id: string;
  user_id: string;
  expertise_id: string;
  level: ExpertiseLevel;
}
