import { SidebarNav } from "@/components/layout/sidebar-nav";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name ?? user?.email ?? "";
  const userPhoto = user?.user_metadata?.avatar_url ?? "";

  return (
    <div className="flex min-h-full">
      <SidebarNav userName={userName} userPhoto={userPhoto} />
      <main className="flex-1 ml-71 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
