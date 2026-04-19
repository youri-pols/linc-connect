import Link from "next/link";
import Image from "next/image";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import type { KnowledgeArticle, KnowledgeCategory } from "@/lib/types/knowledge";

interface KnowledgeCardProps {
  article: KnowledgeArticle;
  fallbackPhotoUrl?: string;
}

/*
 * Category display config: the human label shown on the card pill
 * and its purple / red / green accent. Kept as a single map so
 * adding a new category is a one-line change.
 */
const CATEGORY_CONFIG: Record<
  KnowledgeCategory,
  { label: string; pillBg: string; pillText: string }
> = {
  werkprocessen: { label: "Werkproces", pillBg: "bg-purple/10", pillText: "text-purple" },
  "best-practices": { label: "Best practice", pillBg: "bg-green/10", pillText: "text-green" },
  "tools-setup": { label: "Tools & Setup", pillBg: "bg-purple/10", pillText: "text-purple" },
  troubleshooting: { label: "Troubleshooting", pillBg: "bg-red/10", pillText: "text-red" },
  templates: { label: "Template", pillBg: "bg-purple/10", pillText: "text-purple" },
};

export function KnowledgeCard({ article, fallbackPhotoUrl }: KnowledgeCardProps) {
  const {
    title,
    description,
    slug,
    category,
    authorName,
    authorPhotoUrl,
    updatedAtText,
    readingTimeMinutes,
    commentCount,
    openQuestionsCount,
    isStale,
  } = article;
  const cat = CATEGORY_CONFIG[category];
  const photoUrl = authorPhotoUrl || fallbackPhotoUrl;

  return (
    <Link
      href={`/kennisbank/${slug}`}
      className="group flex flex-col gap-6 bg-white border border-black/10 rounded-md p-5 transition-colors hover:bg-black/5"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 shrink-0">
            {isStale && (
              <div className="bg-red rounded px-2 py-1.5">
                <p className="text-body text-11 text-white leading-none">Verouderd?</p>
              </div>
            )}
            <div className={`${cat.pillBg} rounded px-2 py-1.5`}>
              <p className={`text-body text-11 ${cat.pillText} leading-none`}>
                {cat.label}
              </p>
            </div>
          </div>
          <p className="text-body text-2xs font-medium text-black/60 text-right">
            {readingTimeMinutes} min · {commentCount} reacties
            {openQuestionsCount !== undefined && (
              <>
                {" "}
                ·{" "}
                <span className="text-purple font-medium">
                  {openQuestionsCount} openstaande vraag
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-3 pr-14">
          <h3 className="font-display font-medium text-base leading-none">{title}</h3>
          <p className="text-body text-13 text-black/60">{description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={authorName}
              width={24}
              height={24}
              className="size-6 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="size-6 rounded-full bg-purple shrink-0" />
          )}
          <p className="text-body text-2xs truncate">
            <span className="text-black/80">{authorName}</span>
            <span className="text-black/60"> · Bijgewerkt {updatedAtText}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-body text-11">Lees meer</span>
          <AnimatedArrow size="xs" />
        </div>
      </div>
    </Link>
  );
}
