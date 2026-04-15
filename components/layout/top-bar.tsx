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

interface Breadcrumb {
  label: string;
  href?: string;
}

/*
 * Derive breadcrumb segments from the current pathname. Article
 * detail pages produce two segments (parent + article title derived
 * from slug); everything else is a single segment.
 */
function getBreadcrumbs(pathname: string): Breadcrumb[] {
  if (pathname === "/kennisbank/nieuw") {
    return [{ label: "Kennisbank", href: "/kennisbank" }, { label: "Nieuw artikel" }];
  }
  const articleMatch = pathname.match(/^\/kennisbank\/artikel\/(.+)/);
  if (articleMatch) {
    const slug = articleMatch[1];
    const title = slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
    return [
      { label: "Kennisbank", href: "/kennisbank" },
      { label: title },
    ];
  }
  if (pageTitles[pathname]) return [{ label: pageTitles[pathname] }];
  const match = Object.keys(pageTitles).find((key) => pathname.startsWith(key + "/"));
  return match ? [{ label: pageTitles[match] }] : [];
}

interface TopBarProps {
  onToggleSidebar: () => void;
  onToggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
  showWriteArticle: boolean;
}

export function TopBar({ onToggleSidebar, onToggleMobileMenu, mobileMenuOpen, showWriteArticle }: TopBarProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const isCreateArticle = pathname === "/kennisbank/nieuw";

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-black/15 flex items-stretch h-14">
      {/* Desktop layout */}
      <div className="hidden lg:flex items-stretch flex-1">
        <button onClick={onToggleSidebar} className="cursor-pointer flex items-center justify-center px-5 text-black hover:bg-black/5 transition-colors" aria-label="Toggle sidebar">
          <span className="icon">left_panel_close</span>
        </button>

        <div className="w-px bg-black/15" />

        <div className="flex-1 flex items-center justify-between ps-4 pr-6">
          <div className="flex items-center gap-1.5 text-nav min-w-0">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && (
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <path d="M1.625 7.91683L4.6875 5.00016L1.625 2.0835" stroke="black" strokeOpacity="0.4" strokeMiterlimit="10" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-black/60 hover:text-black transition-colors shrink-0">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="cursor-pointer flex items-center gap-1.5 bg-white border border-black/10 rounded-md pl-3 pr-14 py-1.5 hover:bg-black/10 transition-colors">
              <span className="icon text-black/50">search</span>
              <span className="text-xs text-black/50">Type om te zoeken...</span>
            </button>

            {showWriteArticle &&
              (isCreateArticle ? (
                <button
                  type="button"
                  className="cursor-pointer flex items-center gap-1.5 bg-black border border-black rounded-md px-3 py-1.5 hover:bg-purple hover:border-purple transition-colors"
                >
                  <span className="icon text-white">arrow_upload_ready</span>
                  <span className="text-xs text-white">Publiceren</span>
                </button>
              ) : (
                <Link
                  href="/kennisbank/nieuw"
                  className="cursor-pointer flex items-center gap-1.5 bg-black border border-black rounded-md px-3 py-1.5 hover:bg-purple hover:border-purple transition-colors"
                >
                  <span className="icon text-white">add_2</span>
                  <span className="text-xs text-white">Schrijf een artikel</span>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex-1 flex items-center justify-between px-4">
        <Link href="/home" className="flex items-center text-black">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {isCreateArticle && showWriteArticle && (
            <button
              type="button"
              className="cursor-pointer flex items-center gap-1.5 bg-black border border-black rounded-md px-3 py-1.5 hover:bg-purple hover:border-purple transition-colors"
            >
              <span className="icon text-white">arrow_upload_ready</span>
              <span className="text-xs text-white">Publiceren</span>
            </button>
          )}
          <button
            onClick={onToggleMobileMenu}
            className="cursor-pointer flex items-center justify-center size-10 rounded-lg text-black hover:bg-black/5 transition-colors"
            aria-label="Toggle menu"
          >
            <span className="icon">{mobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
