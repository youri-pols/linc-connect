import Link from "next/link";
import { AnimatedArrow, type AnimatedArrowSize } from "./animated-arrow";

interface ArrowLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  size?: AnimatedArrowSize;
}

/*
 * Text link with the shared `AnimatedArrow` affordance on the right.
 * Used for secondary navigation ("Alle taken", "Alles bekijken",
 * "Bekijk [artikel]"). The parent sets `group` so the arrow animates
 * on hover.
 *
 * The `size` prop controls both the gap between text and arrow and
 * the arrow window: "md" (default, 8px gap, 16×16 window) for the
 * big section headers, "sm" (4px gap, narrow 6×12 window) for the
 * compact inline link inside a task row.
 */
const gapClass: Record<AnimatedArrowSize, string> = {
  md: "gap-2",
  sm: "gap-1",
  xs: "gap-1.5",
};

export function ArrowLink({ href, className, children, size = "md" }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center ${gapClass[size]} ${className ?? ""}`}
    >
      <span>{children}</span>
      <AnimatedArrow size={size} />
    </Link>
  );
}
