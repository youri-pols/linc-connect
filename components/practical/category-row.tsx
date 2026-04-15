import Link from "next/link";
import { AnimatedArrow } from "@/components/ui/animated-arrow";

interface CategoryRowProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  isLast: boolean;
}

/*
 * Reusable row used by both the praktisch index (one card per
 * top-level category) and the category detail pages (one row per
 * article inside the category). Emoji + title + one-line subtitle
 * on the left, sliding chevron on the right. The parent is marked
 * `group` so `AnimatedArrow` animates on hover. The last row skips
 * the bottom border so the card's rounded corners stay clean.
 */
export function CategoryRow({
  href,
  icon,
  title,
  description,
  isLast,
}: CategoryRowProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between gap-3 px-5 py-4 hover:bg-black/5 transition-colors ${
        isLast ? "" : "border-b border-black/15"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg leading-none shrink-0" aria-hidden>
          {icon}
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-body text-13 font-medium text-black leading-tight">
            {title}
          </p>
          <p className="text-body text-xs text-black/60 leading-snug truncate">
            {description}
          </p>
        </div>
      </div>
      <AnimatedArrow size="sm" className="text-black/60" />
    </Link>
  );
}
