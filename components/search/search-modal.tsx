"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

/*
 * Global command-palette-style search modal. Demo only — results
 * are a hard-coded list (kennisbank articles + team members +
 * praktische info) with a lower-case `includes` filter on top, so
 * it showcases the keyboard-navigable UX without touching a real
 * search index yet.
 *
 * Keyboard:
 *   - Type      → filters results live
 *   - ↓ / ↑     → move the active highlight; the active row is
 *                 scrolled into view so it never disappears below
 *                 the fold.
 *   - Enter     → navigate to the active result
 *   - Escape    → close the modal
 *
 * Clicking a result also navigates; hovering updates the active
 * index so mouse + keyboard stay in sync.
 */

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface Result {
  id: string;
  title: string;
  href: string;
  group: string;
}

const DEMO_RESULTS: Result[] = [
  {
    id: "kb-1",
    title: "Git branching strategie bij LiNC",
    href: "/kennisbank/git-branching-strategie-bij-linc",
    group: "Kennisbank",
  },
  {
    id: "kb-2",
    title: "Build errors oplossen in Next.js",
    href: "/kennisbank/build-errors-oplossen-in-next-js",
    group: "Kennisbank",
  },
  {
    id: "kb-3",
    title: "Code review checklist",
    href: "/kennisbank/code-review-checklist",
    group: "Kennisbank",
  },
  {
    id: "kb-4",
    title: "Design tokens in Figma en code",
    href: "/kennisbank/design-tokens-in-figma-en-code",
    group: "Kennisbank",
  },
  {
    id: "kb-5",
    title: "Google Ads AI Max campagnes",
    href: "/kennisbank/google-ads-ai-max-campagnes",
    group: "Kennisbank",
  },
  {
    id: "team-joost",
    title: "Joost Bakkers",
    href: "/team/joost-bakkers",
    group: "Team",
  },
  {
    id: "team-roy",
    title: "Roy van Kasteren",
    href: "/team/roy-van-kasteren",
    group: "Team",
  },
  {
    id: "praktisch-bhv",
    title: "Veiligheid & BHV",
    href: "/praktische-info/veiligheid-bhv",
    group: "Praktische info",
  },
  {
    id: "praktisch-verlof",
    title: "Verlof aanvragen",
    href: "/praktische-info/verlof-afwezigheid/verlof-aanvragen",
    group: "Praktische info",
  },
  { id: "mijn-pad", title: "Mijn pad", href: "/mijn-pad", group: "Navigatie" },
  { id: "home", title: "Home", href: "/home", group: "Navigatie" },
];

function ResultArrow({ active }: { active: boolean }) {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke={active ? "#ffffff" : "rgba(0,0,0,0.6)"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EnterKeyIcon() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 5L2 7.5L4.5 10" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 2V5.5C10 6.03043 9.78929 6.53914 9.41421 6.91421C9.03914 7.28929 8.53043 7.5 8 7.5H2" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset when opened; focus the input so typing works immediately.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(t);
  }, [open]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return DEMO_RESULTS;
    return DEMO_RESULTS.filter((r) => r.title.toLowerCase().includes(needle));
  }, [query]);

  // Clamp active index whenever the visible list shrinks.
  useEffect(() => {
    if (activeIndex >= filtered.length && filtered.length > 0) {
      setActiveIndex(0);
    }
  }, [filtered.length, activeIndex]);

  // Scroll the active row into view so arrow navigation never
  // pushes the highlight below the visible area.
  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // Keyboard navigation.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const target = filtered[activeIndex];
        if (target) {
          onClose();
          router.push(target.href);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIndex, onClose, router]);

  if (!open) return null;

  // Group results in source order for the rendered sections while
  // keeping a flat index → filtered[i] mapping for the active state.
  const groups = new Map<string, { result: Result; index: number }[]>();
  filtered.forEach((r, i) => {
    const bucket = groups.get(r.group) ?? [];
    bucket.push({ result: r, index: i });
    groups.set(r.group, bucket);
  });

  return (
    <div role="dialog" aria-modal="true" aria-label="Zoeken in LiNC Connect" className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
      {/* Full-width dim sits *under* the sidebar + top-bar
          (which are raised to z-60) so the navigation chrome
          stays visible while search is open. */}
      <button type="button" aria-label="Sluiten" onClick={onClose} className="absolute inset-0 bg-black/50" />

      <div className="relative z-70 bg-white rounded-2xl border-4 border-black/20 shadow-modal w-full max-w-xl flex flex-col overflow-hidden">
        {/* Search input — matches Figma Overlay+Border token:
            13px padding, 8px gap, 8px border-radius, 14px Roboto. */}
        <div className="p-2">
          <label className="flex items-center gap-2 bg-white border border-black/10 rounded-lg p-3 transition-colors focus-within:border-purple">
            <span className="sr-only">Zoek in LiNC Connect</span>
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <circle cx="7" cy="7" r="5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" />
              <path d="M13.5 13.5L10.5 10.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type om te zoeken..." className="flex-1 min-w-0 text-body text-sm text-black placeholder:text-black/50 outline-none" />
          </label>
        </div>

        {/* Result list — outer px-2 so rows never touch the modal
            edges and can render their own black background with
            rounded corners when active. */}
        <div className="px-2 pb-2 max-h-[50vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-4 text-body text-sm text-black/60">Geen resultaten voor &ldquo;{query}&rdquo;.</p>
          ) : (
            [...groups.entries()].map(([group, items]) => (
              <div key={group} className="flex flex-col pt-3 pb-1">
                <p className="font-display text-xs text-black/60 leading-none px-3 pb-2">{group}</p>
                <ul className="flex flex-col">
                  {items.map(({ result, index }) => {
                    const isActive = index === activeIndex;
                    return (
                      <li key={result.id}>
                        <button
                          ref={(el) => {
                            itemRefs.current[index] = el;
                          }}
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => {
                            onClose();
                            router.push(result.href);
                          }}
                          className={`group w-full flex items-center gap-2 rounded-lg px-3.5 py-2 text-left cursor-pointer transition-colors ${isActive ? "bg-black" : "bg-transparent hover:bg-black/5"}`}
                        >
                          <ResultArrow active={isActive} />
                          <span className={`truncate text-body text-sm font-medium leading-5 ${isActive ? "text-white" : "text-black"}`}>{result.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-black/10 bg-black/5">
          <kbd className="inline-flex items-center justify-center size-5 rounded border border-black/15 bg-white">
            <EnterKeyIcon />
          </kbd>
          <span className="text-body text-xs text-black/60">Ga naar pagina</span>
        </div>
      </div>
    </div>
  );
}
