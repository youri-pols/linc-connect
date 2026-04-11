"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/kennisbank", label: "Kennisbank", icon: "book_4" },
  { href: "/mijn-pad", label: "Mijn pad", icon: "clock_loader_60" },
  { href: "/praktisch", label: "Praktische info", icon: "error" },
  { href: "/team", label: "Team", icon: "group" },
];

interface SidebarNavProps {
  userName: string;
  userPhoto: string;
}

export function SidebarNav({ userName, userPhoto }: SidebarNavProps) {
  const pathname = usePathname();

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="fixed left-0 top-0 h-screen w-71 bg-white border-r border-black/15 flex flex-col justify-between py-6 z-40">
      {/* Top: logo + nav */}
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="px-6 py-4">
          <svg width="81" height="24" viewBox="0 0 81 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.3074 23.9957V8.40283H26.982L26.9775 23.9957H21.3096H21.3074Z" fill="black"/>
            <path d="M21.3074 5.67459V0H26.982L26.9775 5.67459H21.3096H21.3074Z" fill="black"/>
            <path d="M48.0333 23.9955V10.0074C47.835 6.84473 46.6983 5.67236 43.8364 5.67236H35.1307V23.9933H29.436V0H45.3766C50.5742 0 52.8565 1.74963 53.5162 6.24071C53.6566 7.25037 53.7235 8.28232 53.7146 9.30312V16.1233L53.728 23.9911H48.0311L48.0333 23.9955Z" fill="black"/>
            <path d="M56.1863 23.9955V8.05275C56.1863 2.99777 57.878 0.869242 62.427 0.202823C63.3966 0.0690936 64.3706 0 65.3223 0H80.1551V5.66791H66.1848C63.0823 5.86404 61.8765 7.06761 61.8765 9.96285V18.2741H80.1551V23.9933H56.1819L56.1863 23.9955Z" fill="black"/>
            <path d="M8.05273 24C7.02079 24 5.98661 23.8863 4.97919 23.6568C1.35067 22.7652 0 20.4205 0 15.0045V0L5.69464 0.00445733V14.3336C5.90192 17.6835 7.25036 18.2942 9.8291 18.2942H18.8536V23.9978H8.05273V24Z" fill="black"/>
          </svg>
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
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          {userPhoto ? (
            <Image
              src={userPhoto}
              alt={userName}
              width={40}
              height={40}
              className="size-10 rounded-lg object-cover"
            />
          ) : (
            <div className="size-10 rounded-lg bg-orange flex items-center justify-center text-white text-nav-user">
              {initials}
            </div>
          )}
          <span className="text-nav-user">{userName}</span>
        </div>
        <button className="text-black/60 hover:text-black transition-colors">
          <span className="icon">more_vert</span>
        </button>
      </div>
    </aside>
  );
}
