import { Article, Question, Answer } from "@/lib/types";

export const articles: Article[] = [
  {
    id: "art-1",
    title: "Git workflow bij LiNC",
    content_md: "Bij LiNC werken we met een feature-branch workflow. Elke nieuwe feature of bugfix krijgt een eigen branch...",
    category: "development",
    discipline: "development",
    author_id: "user-4",
    owner_id: "user-4",
    type: "kennisbank",
    is_stale: false,
    view_count: 142,
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2026-02-20T14:30:00Z",
  },
  {
    id: "art-2",
    title: "Design tokens en Figma variabelen",
    content_md: "Dit artikel beschrijft hoe we design tokens gebruiken binnen LiNC en hoe deze zijn opgezet in Figma...",
    category: "design",
    discipline: "design",
    author_id: "user-7",
    owner_id: "user-7",
    type: "kennisbank",
    is_stale: false,
    view_count: 89,
    created_at: "2025-10-01T09:00:00Z",
    updated_at: "2026-01-15T11:00:00Z",
  },
  {
    id: "art-3",
    title: "Hoe schrijf je een goede pitch",
    content_md: "Een sterke pitch begint met het probleem. Beschrijf in maximaal twee zinnen wat het kernprobleem is...",
    category: "account-management",
    discipline: "account",
    author_id: "user-3",
    owner_id: "user-3",
    type: "kennisbank",
    is_stale: false,
    view_count: 67,
    created_at: "2025-11-10T13:00:00Z",
    updated_at: "2025-11-10T13:00:00Z",
  },
  {
    id: "art-4",
    title: "SEO-basics voor marketeers",
    content_md: "Zoekmachineoptimalisatie begint bij het begrijpen van zoekintentie. Er zijn vier typen zoekintentie...",
    category: "marketing",
    discipline: "marketing",
    author_id: "user-4",
    owner_id: "user-4",
    type: "kennisbank",
    is_stale: true,
    view_count: 203,
    created_at: "2024-08-20T10:00:00Z",
    updated_at: "2024-08-20T10:00:00Z",
  },
  {
    id: "art-5",
    title: "Verlof aanvragen",
    content_md: "Verlof aanvragen doe je via het HR-portaal. Log in met je Google account en navigeer naar...",
    category: "hr",
    discipline: "algemeen",
    author_id: "user-3",
    owner_id: "user-3",
    type: "praktisch",
    is_stale: false,
    view_count: 312,
    created_at: "2025-01-05T09:00:00Z",
    updated_at: "2025-06-10T10:00:00Z",
  },
  {
    id: "art-6",
    title: "BHV-procedures en vluchtwegen",
    content_md: "Bij LiNC zijn vier gecertificeerde BHV'ers aanwezig. De BHV-coördinator is bereikbaar via...",
    category: "veiligheid",
    discipline: "algemeen",
    author_id: "user-3",
    owner_id: "user-3",
    type: "praktisch",
    is_stale: false,
    view_count: 178,
    created_at: "2025-03-01T09:00:00Z",
    updated_at: "2026-01-10T09:00:00Z",
  },
];

export const questions: Question[] = [
  {
    id: "q-1",
    article_id: "art-1",
    author_id: "user-1",
    title: "Wanneer gebruik je rebase vs merge?",
    body: "Ik snap het verschil nog niet helemaal. Wanneer kies je voor rebase en wanneer voor merge bij feature branches?",
    is_resolved: true,
    created_at: "2026-03-20T14:00:00Z",
  },
  {
    id: "q-2",
    article_id: "art-2",
    author_id: "user-5",
    title: "Hoe exporteer je tokens vanuit Figma?",
    body: "Ik wil de design tokens gebruiken in code maar weet niet hoe ik ze het beste kan exporteren.",
    is_resolved: false,
    created_at: "2026-04-01T10:30:00Z",
  },
];

export const answers: Answer[] = [
  {
    id: "a-1",
    question_id: "q-1",
    author_id: "user-4",
    body: "Gebruik merge voor feature branches naar main. Rebase gebruik je alleen lokaal om je branch up-to-date te houden met main.",
    is_accepted: true,
    created_at: "2026-03-20T15:30:00Z",
  },
];

export function getArticlesByType(type: Article["type"]): Article[] {
  return articles.filter((a) => a.type === type);
}

export function getArticlesByDiscipline(discipline: string): Article[] {
  return articles.filter((a) => a.discipline === discipline);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(
    (a) => a.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") === slug
  );
}

export function getQuestionsForArticle(articleId: string): Question[] {
  return questions.filter((q) => q.article_id === articleId);
}

export function getAnswersForQuestion(questionId: string): Answer[] {
  return answers.filter((a) => a.question_id === questionId);
}
