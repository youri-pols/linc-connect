"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { navItems } from "./nav-items";
import { UserMenu } from "./user-menu";

interface SidebarNavProps {
  userName: string;
  userPhoto: string;
  open: boolean;
}

export function SidebarNav({ userName, userPhoto, open }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-screen w-71 bg-white border-r border-black/15 flex-col justify-between py-6 z-40 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Top: logo + nav */}
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="px-6 py-4 text-black">
          <Logo />
        </div>

        {/* Separator */}
        <div className="h-px bg-black/15" />

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
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
      </div>

      {/* Bottom: user */}
      <div className="px-3">
        <UserMenu userName={userName} userPhoto={userPhoto} direction="up" />
      </div>
    </aside>
  );
}
