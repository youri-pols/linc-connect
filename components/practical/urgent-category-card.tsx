import Link from "next/link";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import type { PracticalCategory } from "@/lib/mock-data/practical";

interface UrgentCategoryCardProps {
  category: PracticalCategory;
}

/*
 * Stand-alone "emergency" card for Veiligheid & BHV. At rest it's
 * a soft red tint with a red border; on hover it snaps to a solid
 * red fill with white text, matching the BHV shortcut variant in
 * the home sidebar.
 */
export function UrgentCategoryCard({ category }: UrgentCategoryCardProps) {
  return (
    <Link
      href={`/praktische-info/${category.slug}`}
      className="group flex items-center justify-between gap-3 rounded-md bg-red/5 border border-red/20 px-5 py-4 shadow-urgent hover:bg-red hover:border-red transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg leading-none shrink-0" aria-hidden>
          {category.icon}
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-body text-13 font-medium text-red group-hover:text-white transition-colors leading-tight">
            {category.title}
          </p>
          <p className="text-body text-xs text-black/60 group-hover:text-white/80 transition-colors leading-snug truncate">
            {category.description}
          </p>
        </div>
      </div>
      <AnimatedArrow
        size="sm"
        className="text-red group-hover:text-white transition-colors"
      />
    </Link>
  );
}
