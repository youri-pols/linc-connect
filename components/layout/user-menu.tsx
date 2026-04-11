"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface UserMenuProps {
  userName: string;
  userPhoto: string;
  direction?: "up" | "down";
}


export function UserMenu({ userName, userPhoto, direction = "up" }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-black/5 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          {userPhoto ? <Image src={userPhoto} alt={userName} width={40} height={40} className="size-10 rounded-lg object-cover shrink-0" /> : <div className="size-10 rounded-lg bg-orange flex items-center justify-center text-white text-nav-user shrink-0">{initials}</div>}
          <span className="text-nav-user truncate">{userName}</span>
        </div>
        <span className="icon text-black/60 shrink-0">more_vert</span>
      </button>

      {open && (
        <div className={`absolute left-0 right-0 bg-white border border-black/15 rounded-lg shadow-lg p-1 z-50 ${direction === "up" ? "bottom-full mb-2" : "top-full mt-2"}`}>
          <form action="/auth/logout" method="post">
            <button type="submit" className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-black/5 transition-colors cursor-pointer text-left">
              <span className="icon text-black/60">logout</span>
              <span className="text-xs">Uitloggen</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
