"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";
import { TopBar } from "./top-bar";
import { MobileMenu } from "./mobile-menu";
import { RoleProvider, canWriteArticles, type Role } from "./role-context";

interface AppShellProps {
  userName: string;
  userPhoto: string;
  children: React.ReactNode;
}

/*
 * Wraps every authenticated page with the sidebar, topbar and mobile menu.
 *
 * The "active role" is a fase 1 placeholder: we detect it from the last
 * visited /home/[variant] URL and persist it in localStorage so the
 * "Schrijf een artikel" button stays visible while the user navigates
 * elsewhere. When the real role system lands (fase 2, Supabase) this
 * can be replaced by reading the role from the user record.
 */
export function AppShell({ userName, userPhoto, children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<Role>("nieuw");

  useEffect(() => {
    const stored = localStorage.getItem("activeRole") as Role | null;
    if (stored === "nieuw" || stored === "ervaren" || stored === "begeleider") {
      setRole(stored);
    }
  }, []);

  useEffect(() => {
    const match = pathname.match(/^\/home\/(nieuw|ervaren|begeleider)/);
    if (match) {
      const newRole = match[1] as Role;
      setRole(newRole);
      localStorage.setItem("activeRole", newRole);
    }
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const showWriteArticle = canWriteArticles(role);

  /*
   * The shell owns the viewport height. `<main>` is `overflow-hidden`
   * so each page can place its own scroll container(s) inside — the
   * home dashboard, for example, wants to scroll the main column
   * while keeping the right panel static.
   */
  return (
    <RoleProvider role={role}>
      <div className="flex h-screen">
        <SidebarNav userName={userName} userPhoto={userPhoto} open={sidebarOpen} />
        <div
          className={`flex-1 flex flex-col min-w-0 min-h-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "lg:ml-71" : "lg:ml-0"
          }`}
        >
          <TopBar
            onToggleSidebar={() => setSidebarOpen((o) => !o)}
            onToggleMobileMenu={() => setMobileMenuOpen((o) => !o)}
            mobileMenuOpen={mobileMenuOpen}
            showWriteArticle={showWriteArticle}
          />
          {mobileMenuOpen && (
            <MobileMenu
              userName={userName}
              userPhoto={userPhoto}
              showWriteArticle={showWriteArticle}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          )}
          <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
        </div>
      </div>
    </RoleProvider>
  );
}
