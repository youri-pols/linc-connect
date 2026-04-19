import type { ArticleDetail } from "@/lib/types/article-detail";
import type { KnowledgeArticle } from "@/lib/types/knowledge";

const LOREM = "Lorem ipsum dolor sit amet consectetur. Id malesuada faucibus in elit. Bibendum ullamcorper ut sed urna id magna scelerisque arcu sed. Bibendum quisque tristique sed tortor ultrices fermentum volutpat amet. Lectus ultrices aliquet donec mattis. In cras sit amet pretium. Dictum sed et volutpat egestas mauris cursus ornare. Risus euismod malesuada.";

const SECTION_BODY = "Lorem ipsum dolor sit amet consectetur. Tincidunt non ut ipsum malesuada sit leo. Nulla platea fermentum mi egestas. Eget massa neque interdum viverra ultricies nisi justo faucibus. Quam diam lectus rhoncus nec vel enim in. Amet proin metus ultrices vitae posuere in odio. Vulputate natoque enim morbi sit sagittis. Mus viverra placerat tellus sed.";

const RELATED: KnowledgeArticle[] = [
  {
    id: "related-1",
    slug: "git-branching-strategie-bij-linc",
    title: "Git branching strategie bij LiNC",
    description: "Hoe wij feature branches, hotfixes en releases beheren in onze Git workflows.",
    discipline: "development",
    category: "werkprocessen",
    authorName: "Youri Pols",
    authorPhotoUrl: "/images/youri.webp",
    updatedAtText: "18 februari 2026",
    readingTimeMinutes: 2,
    commentCount: 3,
    openQuestionsCount: 1,
  },
  {
    id: "related-2",
    slug: "code-review-checklist",
    title: "Code review checklist",
    description: "Waar we op letten bij een pull request review: architectuur, tests, naming en documentatie.",
    discipline: "development",
    category: "best-practices",
    authorName: "Youri Pols",
    authorPhotoUrl: "/images/youri.webp",
    updatedAtText: "2 februari 2026",
    readingTimeMinutes: 5,
    commentCount: 4,
  },
];

/*
 * Returns a single article detail. In fase 1 every slug resolves
 * to the same mock article; fase 2 swaps this for a Supabase
 * query on the `articles` table joined with `questions`/`answers`.
 */
export async function getArticleDetail(slug: string): Promise<ArticleDetail | null> {
  return {
    slug,
    title: "Git branching strategie bij LiNC",
    discipline: "development",
    category: "werkprocessen",
    authorName: "Youri Pols",
    authorPhotoUrl: "/images/youri.webp",
    updatedAtText: "18 februari 2026",
    readingTimeMinutes: 2,
    commentCount: 3,
    openQuestionsCount: 1,
    sections: [{ body: LOREM }, { heading: "1. Titel", body: SECTION_BODY }, { heading: "2. Titel", body: SECTION_BODY }, { heading: "3. Titel", body: SECTION_BODY }],
    threads: [
      {
        id: "thread-1",
        authorName: "Youri Pols",
        authorPhotoUrl: "/images/youri.webp",
        title: "Lorem ipsum dolor sit amet consectetur?",
        createdAtText: "3 dagen geleden",
      },
      {
        id: "thread-2",
        authorName: "Youri Pols",
        authorPhotoUrl: "/images/youri.webp",
        title: "Lorem ipsum dolor sit amet consectetur?",
        createdAtText: "3 dagen geleden",
        answer: {
          id: "answer-2",
          authorName: "Youri Pols",
          authorPhotoUrl: "/images/youri.webp",
          body: "Lorem ipsum dolor sit amet consectetur. Tortor metus scelerisque sit nec convallis id elementum. Risus dictum vel nulla vivamus nulla. Vel auctor semper sit diam. In pharetra vel non dui amet. Imperdiet dictum in auctor aliquet.",
          createdAtText: "2 dagen geleden",
          answeredByName: "Joost Bakkers",
          isAccepted: true,
        },
      },
      {
        id: "thread-3",
        authorName: "Youri Pols",
        authorPhotoUrl: "/images/youri.webp",
        title: "Lorem ipsum dolor sit amet consectetur?",
        createdAtText: "3 dagen geleden",
        answer: {
          id: "answer-3",
          authorName: "Youri Pols",
          authorPhotoUrl: "/images/youri.webp",
          body: "Lorem ipsum dolor sit amet consectetur. Tortor metus scelerisque sit nec convallis id elementum. Risus dictum vel nulla vivamus nulla. Vel auctor semper sit diam. In pharetra vel non dui amet. Imperdiet dictum in auctor aliquet.",
          createdAtText: "2 dagen geleden",
          answeredByName: "Joost Bakkers",
          isAccepted: true,
        },
      },
    ],
    relatedArticles: RELATED,
  };
}
