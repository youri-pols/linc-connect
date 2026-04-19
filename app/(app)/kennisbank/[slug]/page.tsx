import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getArticleDetail } from "@/lib/mock-data/article-detail";
import { ArticleDetailView } from "./article-detail-view";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ArtikelPage({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userPhotoUrl = user?.user_metadata?.avatar_url ?? "";
  const article = await getArticleDetail(slug);

  if (!article) notFound();

  return <ArticleDetailView article={article} userPhotoUrl={userPhotoUrl} />;
}
