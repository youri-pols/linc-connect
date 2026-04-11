"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

const pageTitles: Record<string, string> = {
  "/home": "Home",
  "/kennisbank": "Kennisbank",
  "/mijn-pad": "Mijn pad",
  "/praktisch": "Praktische info",
  "/team": "Team",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  const match = Object.keys(pageTitles).find((key) => pathname.startsWith(key + "/"));
  return match ? pageTitles[match] : "";
}

interface TopBarProps {
  onToggleSidebar: () => void;
  onToggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
  showWriteArticle: boolean;
}

export function TopBar({ onToggleSidebar, onToggleMobileMenu, mobileMenuOpen, showWriteArticle }: TopBarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-black/15 flex items-stretch h-14">
      {/* Desktop layout */}
      <div className="hidden lg:flex items-stretch flex-1">
        <button onClick={onToggleSidebar} className="cursor-pointer flex items-center justify-center px-5 text-black hover:bg-black/5 transition-colors" aria-label="Toggle sidebar">
          <span className="icon">left_panel_close</span>
        </button>

        <div className="w-px bg-black/15" />

        <div className="flex-1 flex items-center justify-between px-6">
          <p className="text-nav">{title}</p>

          <div className="flex items-center gap-3">
            <button className="cursor-pointer flex items-center gap-1.5 bg-white border border-black/10 rounded-md pl-3 pr-14 py-1.5 hover:border-black/20 transition-colors">
              <span className="icon text-black/50">search</span>
              <span className="text-xs text-black/50">Type om te zoeken...</span>
            </button>

            {showWriteArticle && (
              <Link href="/kennisbank/nieuw" className="cursor-pointer flex items-center gap-1.5 bg-black border border-black rounded-md px-3 py-1.5 hover:bg-black/75 transition-colors">
                <span className="icon text-white">add_2</span>
                <span className="text-xs text-white">Schrijf een artikel</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex-1 flex items-center justify-between px-4">
        <Link href="/home" className="flex items-center text-black">
          <Logo />
        </Link>
        <button onClick={onToggleMobileMenu} className="cursor-pointer flex items-center justify-center size-10 rounded-lg text-black hover:bg-black/5 transition-colors" aria-label="Toggle menu">
          <span className="icon">{mobileMenuOpen ? "close" : "menu"}</span>
        </button>
      </div>
    </header>
  );
}
