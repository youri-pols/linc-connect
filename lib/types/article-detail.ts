import type { KnowledgeArticle, KnowledgeCategory, KnowledgeDiscipline } from "./knowledge";

export interface QAAnswer {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  body: string;
  createdAtText: string;
  answeredByName: string;
  isAccepted: boolean;
}

export interface QAThread {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  title: string;
  createdAtText: string;
  answer?: QAAnswer;
}

export interface ArticleSection {
  heading?: string;
  body: string;
}

export interface ArticleDetail {
  slug: string;
  title: string;
  discipline: KnowledgeDiscipline;
  category: KnowledgeCategory;
  authorName: string;
  authorPhotoUrl?: string;
  updatedAtText: string;
  readingTimeMinutes: number;
  commentCount: number;
  openQuestionsCount?: number;
  isStale?: boolean;
  sections: ArticleSection[];
  threads: QAThread[];
  relatedArticles: KnowledgeArticle[];
}
