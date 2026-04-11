import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name ?? user?.email ?? "";
  const userPhoto = user?.user_metadata?.avatar_url ?? "";

  return (
    <AppShell userName={userName} userPhoto={userPhoto}>
      {children}
    </AppShell>
  );
}
