"use client";

import Link from "next/link";
import Image from "next/image";
import { canWriteArticles, useRole } from "@/components/layout/role-context";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { ArrowLink } from "@/components/ui/arrow-link";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import type { ArticleDetail, QAThread } from "@/lib/types/article-detail";
import type { KnowledgeCategory } from "@/lib/types/knowledge";

interface ArticleDetailViewProps {
  article: ArticleDetail;
  userPhotoUrl: string;
}

/*
 * Category label config (text-only, matches Figma — no coloured
 * pill on the detail page, unlike the index cards).
 */
const CATEGORY_LABEL: Record<KnowledgeCategory, string> = {
  werkprocessen: "Werkproces",
  "best-practices": "Best practice",
  "tools-setup": "Tools & Setup",
  troubleshooting: "Troubleshooting",
  templates: "Template",
};

/* ── Sub-components ───────────────────────────────────────── */

function Avatar({ src, alt, size = 24 }: { src?: string; alt: string; size?: 24 | 32 | 40 }) {
  const sizeClass = size === 40 ? "size-10" : size === 32 ? "size-8" : "size-6";
  // Demo fallback: every author in the mock is Youri — use his
  // photo when the caller doesn't pass a `src`.
  const resolved = src || "/images/youri.webp";
  return <Image src={resolved} alt={alt} width={size} height={size} className={`${sizeClass} rounded-full object-cover shrink-0`} />;
}

/*
 * Small static 10×10 arrow SVG. Used for inline "go to" links
 * where the sliding animation isn't needed (e.g. the "Beantwoord
 * deze vraag" link, the "1 openstaande vraag" anchor rotated 90°).
 */
function StaticArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={`block w-2.5 h-2.5 shrink-0 ${className}`}>
      <path d="M5.8335 7.91659L8.75016 4.99992L5.8335 2.08325" stroke="currentColor" strokeMiterlimit="10" />
      <path d="M8.63102 5H0.714355" stroke="currentColor" strokeMiterlimit="10" />
    </svg>
  );
}

/*
 * Single thread row rendered INSIDE the shared Q&A card.
 *
 * The owner variant (unanswered threads) wraps the author row, the
 * purple "Beantwoord deze vraag" link, the "Beantwoord de vraag op
 * je artikel" label + textarea + submit button in ONE dashed card —
 * matching the Figma where the entire answer compose flow lives in
 * the same dashed container.
 */
function ThreadRow({ thread, isOwner, photoUrl }: { thread: QAThread; isOwner: boolean; photoUrl: string }) {
  const photo = thread.authorPhotoUrl || photoUrl;

  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {/* Question header — ALWAYS outside the dashed card */}
      <div className="flex items-center gap-3">
        <Avatar src={photo} alt={thread.authorName} size={40} />
        <div className="flex flex-col gap-2.5 min-w-0">
          <div className="flex flex-col gap-1">
            <p className="text-body text-13 font-bold leading-none">{thread.title}</p>
            <p className="text-body text-xs text-black/60">
              {thread.authorName} · {thread.createdAtText}
            </p>
          </div>
          {isOwner && !thread.answer && (
            <ArrowLink href="#qa-form" size="sm" className="text-purple font-display font-semibold text-xs">
              Beantwoord deze vraag
            </ArrowLink>
          )}
        </div>
      </div>

      {/* Owner: answer compose form — only the label/input/submit in the dashed card */}
      {isOwner && !thread.answer && (
        <div id="qa-form" className="bg-white border border-dashed border-black/15 rounded-lg shadow-card p-4 flex flex-col gap-2 scroll-mt-20">
          <p className="text-body text-13 font-medium">Beantwoord de vraag op je artikel</p>
          <textarea aria-label="Typ je antwoord op de vraag" placeholder="Typ je antwoord" className="text-body text-xs border border-black/10 rounded-md px-3 pt-3 pb-14 resize-none placeholder:text-black/50 bg-white focus:border-purple outline-none transition-colors" />
          <button type="button" className="self-start flex items-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-1.5 hover:bg-purple transition-colors cursor-pointer">
            <span className="icon">add_2</span>
            Antwoord plaatsen
          </button>
        </div>
      )}

      {/* Accepted answer */}
      {thread.answer && (
        <div className="bg-green/5 rounded-md flex flex-col gap-4 pl-4 pr-14 py-4">
          <p className="text-body text-13 text-black leading-relaxed">{thread.answer.body}</p>
          <p className="text-body text-xs text-green">
            Beantwoord door {thread.answer.answeredByName}
            {thread.answer.isAccepted && " · Geaccepteerde oplossing"}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Main view ────────────────────────────────────────────── */

export function ArticleDetailView({ article, userPhotoUrl }: ArticleDetailViewProps) {
  const role = useRole();
  const isOwner = canWriteArticles(role);

  const totalQA = article.threads.reduce((sum, t) => sum + (t.answer ? 2 : 1), 0);
  // Prefer the article's declared author photo, fall back to the
  // signed-in user's Google photo so the header avatar still renders
  // even when the mock / DB entry doesn't carry a photo yet.
  const articleAuthorPhoto = article.authorPhotoUrl ?? userPhotoUrl;

  return (
    <div className="h-full overflow-y-auto scroll-smooth">
      <div className="max-w-2xl mx-auto p-4 lg:p-8 flex flex-col gap-10">
        {/* Back button */}
        <Link href="/kennisbank" className="self-start flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors">
          <span className="icon">arrow_back</span>
          Terug naar Kennisbank
        </Link>

        {/* Article header */}
        <div className="flex flex-col gap-4">
          {/* Category + discipline label — plain text, dot separator */}
          <p className="text-body text-xs text-black/50 leading-normal capitalize">
            {CATEGORY_LABEL[article.category]} · {article.discipline}
          </p>

          <h1 className="font-display font-medium text-h2">{article.title}</h1>

          <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-black/15">
            <div className="flex items-center gap-2">
              <Avatar src={articleAuthorPhoto} alt={article.authorName} size={24} />
              <div className="flex items-center gap-3">
                <p className="text-body text-xs text-black/80">{article.authorName}</p>
                <div className="size-1 rounded-full bg-black/60 shrink-0" />
                <p className="text-body text-xs text-black/60">Bijgewerkt {article.updatedAtText}</p>
              </div>
            </div>
            {/*
             * "nieuw" role: "X reacties" + a down arrow that
             * scrolls to the Q&A section. "ervaren" / "begeleider"
             * also see the "X openstaande vraag" hint next to it
             * so they can jump in and answer an open thread.
             */}
            <p className="text-body text-xs text-black/60 flex items-center gap-1">
              {article.readingTimeMinutes} min ·{" "}
              <a href="#qa-section" className="flex items-center gap-1 hover:text-black transition-colors">
                {article.commentCount} reacties
                <StaticArrow className="rotate-90" />
              </a>
              {role !== "nieuw" && article.openQuestionsCount !== undefined && (
                <>
                  <span> · </span>
                  <a href="#qa-section" className="flex items-center gap-1 text-purple hover:text-black transition-colors">
                    {article.openQuestionsCount} openstaande vraag
                    <StaticArrow className="rotate-90" />
                  </a>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Article body — section headings in Safiro */}
        <div className="flex flex-col gap-8">
          {article.sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-3">
              {section.heading && <h2 className="font-display font-medium text-base">{section.heading}</h2>}
              <p className="text-body text-sm text-black leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Author card + action button — two separate boxes */}
        <div className="flex gap-2 items-stretch border-t border-black/15 pt-6">
          <div className="flex-1 flex items-center gap-3 bg-white border border-black/15 rounded-lg px-4 py-3">
            <Avatar src={articleAuthorPhoto} alt={article.authorName} size={40} />
            <div className="flex flex-col gap-0.5">
              <p className="text-body text-xs text-black/50">Auteur</p>
              <p className="text-nav-user">{article.authorName}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white border border-black/15 rounded-md px-5 py-3 text-body text-xs font-medium text-black hover:bg-black/5 transition-colors cursor-pointer shrink-0">
            {isOwner ? (
              <>
                <span className="icon">edit</span>
                Artikel bewerken
              </>
            ) : (
              <>
                <span className="icon">hourglass_disabled</span>
                Markeer als verouderd
              </>
            )}
          </button>
        </div>

        {/* Q&A section */}
        <div id="qa-section" className="flex flex-col gap-4 border-t border-black/15 pt-6 scroll-mt-20">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display font-medium text-sm">Vragen & antwoorden ({totalQA})</h2>
            {!isOwner && (
              <button className="flex items-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-1.5 hover:bg-purple transition-colors cursor-pointer">
                <span className="icon">add_2</span>
                Stel een vraag
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {/* Threads in one shared card */}
            <div className="bg-white border border-black/15 rounded-lg shadow-card overflow-hidden divide-y divide-black/15">
              {article.threads.map((thread) => (
                <ThreadRow key={thread.id} thread={thread} isOwner={isOwner} photoUrl={userPhotoUrl} />
              ))}
            </div>

            {/* Reader: ask question form — separate dashed-border card */}
            {!isOwner && (
              <div id="qa-form" className="bg-white border border-dashed border-black/15 rounded-lg shadow-card p-4 flex flex-col gap-2 scroll-mt-20">
                <p className="text-body text-13 font-medium">Stel een vraag over dit artikel</p>
                <textarea aria-label="Typ je vraag over dit artikel" placeholder="Typ je vraag" className="text-body text-xs border border-black/10 rounded-md px-3 pt-3 pb-14 resize-none placeholder:text-black/50 bg-white focus:border-purple outline-none transition-colors" />
                <button type="button" className="self-start flex items-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-1.5 hover:bg-purple transition-colors cursor-pointer">
                  <span className="icon">add_2</span>
                  Vraag plaatsen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related articles */}
        <div className="flex flex-col gap-4 border-t border-black/15 pt-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display font-medium text-sm">Gerelateerde artikelen</h2>
            <Link href="/kennisbank" className="group flex items-center gap-2 bg-black text-white text-xs rounded-md px-3 py-1.5 hover:bg-purple transition-colors">
              Bekijk kennisbank
              <AnimatedArrow size="xs" className="text-white" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {article.relatedArticles.map((related) => (
              <KnowledgeCard key={related.id} article={related} fallbackPhotoUrl={userPhotoUrl} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
