"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";
import { UserMenu } from "./user-menu";

interface MobileMenuProps {
  userName: string;
  userPhoto: string;
  showWriteArticle: boolean;
  onNavigate: () => void;
}

export function MobileMenu({ userName, userPhoto, showWriteArticle, onNavigate }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <div className="lg:hidden bg-white border-b border-black/15 flex flex-col gap-4 p-4">
      {/* Nav items */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-nav transition-colors ${
                isActive ? "bg-black text-white" : "text-black hover:bg-black/5"
              }`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="h-px bg-black/15" />

      {/* Search */}
      <button
        type="button"
        aria-label="Zoeken in LiNC Connect"
        className="cursor-pointer flex items-center gap-1.5 bg-white border border-black/10 rounded-md px-3 py-2 hover:bg-black/10 transition-colors"
      >
        <span aria-hidden className="icon text-black/50">search</span>
        <span className="text-xs text-black/50">Type om te zoeken...</span>
      </button>

      {/* Write article */}
      {showWriteArticle && (
        <Link
          href="/kennisbank/nieuw"
          onClick={onNavigate}
          className="cursor-pointer flex items-center justify-center gap-1.5 bg-black border border-black rounded-md px-3 py-2 hover:bg-purple hover:border-purple transition-colors"
        >
          <span className="icon text-white">add_2</span>
          <span className="text-xs text-white">Schrijf een artikel</span>
        </Link>
      )}

      <div className="h-px bg-black/15" />

      {/* Account */}
      <UserMenu userName={userName} userPhoto={userPhoto} direction="down" />
    </div>
  );
}
