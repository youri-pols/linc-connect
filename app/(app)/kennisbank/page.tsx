import { createClient } from "@/lib/supabase/server";
import { getKnowledgeArticles } from "@/lib/mock-data/knowledge";
import { KennisbankView } from "./kennisbank-view";

export default async function KennisbankPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userPhotoUrl = user?.user_metadata?.avatar_url ?? "";
  const articles = await getKnowledgeArticles();

  return <KennisbankView articles={articles} currentUserPhotoUrl={userPhotoUrl} />;
}
