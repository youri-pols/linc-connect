import Link from "next/link";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import type { Shortcut } from "@/lib/types/home";

interface ShortcutItemProps {
  shortcut: Shortcut;
}

/*
 * Rendered inside the "Snelkoppelingen" panel on the right.
 *
 * The "bhv" variant stays subtle at rest (light red tint, red-ish
 * border) and snaps to a solid red fill with white label on hover
 * to flag it as a safety shortcut. The default variant is a neutral
 * bordered row with the usual soft hover background.
 *
 * The parent is marked with `group` so the trailing `AnimatedArrow`
 * can slide on hover, matching the ArrowLink pattern.
 */
export function ShortcutItem({ shortcut }: ShortcutItemProps) {
  const { label, emoji, href, variant } = shortcut;
  const isBhv = variant === "bhv";

  const containerClass = isBhv
    ? "bg-red/5 border-red/20 hover:bg-red hover:border-red"
    : "bg-white border-black/10 hover:bg-black/5";

  const labelClass = isBhv
    ? "text-black group-hover:text-white"
    : "text-black";

  const arrowClass = isBhv
    ? "text-black/60 group-hover:text-white"
    : "text-black/60";

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between gap-2 border rounded-md p-3 transition-colors ${containerClass}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="shrink-0 text-sm">{emoji}</span>
        <span className={`text-body text-xs font-medium leading-normal truncate transition-colors ${labelClass}`}>
          {label}
        </span>
      </div>
      <AnimatedArrow glyph="chevron" className={`transition-colors ${arrowClass}`} />
    </Link>
  );
}
