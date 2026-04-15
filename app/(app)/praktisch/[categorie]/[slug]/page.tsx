import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPracticalArticle, getPracticalCategory } from "@/lib/mock-data/practical";
import { createClient } from "@/lib/supabase/server";

interface ArticlePageProps {
  params: Promise<{ categorie: string; slug: string }>;
}

/*
 * Praktisch article detail page. Visually mirrors the kennisbank
 * article layout — small label path, H1, author meta row, body
 * sections, and an author card + "Markeer als verouderd" action
 * at the bottom. Praktisch articles don't have a Q&A section, so
 * that block is omitted.
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { categorie, slug } = await params;
  const category = getPracticalCategory(categorie);
  const article = getPracticalArticle(categorie, slug);
  if (!category || !article) notFound();

  /*
   * Pull the logged-in user's Google avatar from Supabase and use
   * it as the author photo — in this mock the default author is
   * always "Youri Pols", i.e. the signed-in user himself.
   */
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const authorPhotoUrl = article.authorPhotoUrl ?? (user?.user_metadata?.avatar_url as string | undefined);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 lg:p-8 flex flex-col gap-10">
        <Link href={`/praktisch/${category.slug}`} className="w-fit flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors">
          <span className="icon h-4">arrow_back</span>
          Terug naar {category.title}
        </Link>

        {/* Article header */}
        <div className="flex flex-col gap-4">
          <p className="text-body text-xs text-black/50 leading-normal">{article.labelPath ?? category.title}</p>

          <h1 className="font-display font-medium text-h2">{article.title}</h1>

          <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-black/15">
            <div className="flex items-center gap-2">
              {authorPhotoUrl ? <Image src={authorPhotoUrl} alt={article.authorName ?? "Auteur"} width={24} height={24} className="size-6 rounded-full object-cover shrink-0" /> : <div className="size-6 rounded-full bg-purple shrink-0" />}
              <div className="flex items-center gap-3">
                <p className="text-body text-xs text-black/80">{article.authorName ?? "Auteur"}</p>
                {article.updatedAt && (
                  <>
                    <div className="size-1 rounded-full bg-black/60 shrink-0" />
                    <p className="text-body text-xs text-black/60">Bijgewerkt {article.updatedAt}</p>
                  </>
                )}
              </div>
            </div>
            {article.readingMinutes && <p className="text-body text-xs text-black/60">{article.readingMinutes} min</p>}
          </div>
        </div>

        {/* Body */}
        {article.sections && article.sections.length > 0 && (
          <div className="flex flex-col gap-8">
            {article.sections.map((section, i) => (
              <div key={i} className="flex flex-col gap-3">
                {section.heading && <h2 className="font-display font-medium text-base">{section.heading}</h2>}
                <p className="text-body text-sm text-black leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Author card + "Markeer als verouderd" */}
        <div className="flex gap-2 items-stretch border-t border-black/15 pt-6">
          <div className="flex-1 flex items-center gap-3 bg-white border border-black/15 rounded-lg px-4 py-3">
            {authorPhotoUrl ? <Image src={authorPhotoUrl} alt={article.authorName ?? "Auteur"} width={40} height={40} className="size-10 rounded-full object-cover shrink-0" /> : <div className="size-10 rounded-full bg-purple shrink-0" />}
            <div className="flex flex-col gap-0.5">
              <p className="text-body text-xs text-black/50">Auteur</p>
              <p className="text-nav-user">{article.authorName ?? "Auteur"}</p>
            </div>
          </div>
          <button type="button" className="flex items-center gap-2 bg-white border border-black/15 rounded-md px-5 py-3 text-body text-xs font-medium text-black hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer shrink-0">
            <span className="icon">hourglass_disabled</span>
            Markeer als verouderd
          </button>
        </div>
      </div>
    </div>
  );
}
