export type AnimatedArrowSize = "md" | "sm" | "xs";
export type AnimatedArrowGlyph = "arrow" | "chevron";

interface AnimatedArrowProps {
  className?: string;
  size?: AnimatedArrowSize;
  glyph?: AnimatedArrowGlyph;
}

/*
 * Two-arrow sliding icon used across the app for any "go to"
 * affordance. Must be rendered inside a parent element with the
 * `group` class — the animation triggers on `group-hover`.
 *
 * Two independent axes:
 *   - `size`: controls the wrapper (and for "sm" also switches the
 *     glyph to the tiny chevron window used for inline links).
 *       "md" → 16×16 wrapper (12×9 arrow or chevron)
 *       "sm" → narrow 6×16 wrapper tuned to sit next to 12px text
 *       "xs" → 10×10 wrapper with a compact 10×10 SVG arrow for
 *              card affordances like "Lees meer"
 *   - `glyph`: which icon to render inside the md wrapper.
 *       "arrow"   → 12×9 custom SVG (Alle taken, Alles bekijken)
 *       "chevron" → Material Symbols chevron_right (Snelkoppelingen)
 *
 * The "sm" size always uses the chevron; the "xs" size always uses
 * the 10×10 arrow.
 *
 * `className` is forwarded to the outer wrapper and is how colour
 * (text-white, text-purple, ...) is passed in; the glyphs inherit
 * it via `currentColor` (SVG) or font colour (Material Symbols).
 */
/*
 * Wrappers are deliberately a few pixels wider than the glyph so
 * there's natural whitespace around the centred arrow. When the
 * wrapper slides by its full width on hover the whitespace becomes
 * the visual gap between the exiting and entering glyphs.
 */
const sizeClass: Record<AnimatedArrowSize, string> = {
  md: "size-5",
  sm: "w-3 h-4",
  xs: "size-4",
};

function ArrowGlyph({
  size,
  glyph,
}: {
  size: AnimatedArrowSize;
  glyph: AnimatedArrowGlyph;
}) {
  if (size === "sm" || glyph === "chevron") {
    return (
      <svg
        viewBox="0 0 6 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-1.5"
      >
        <path
          d="M0.353516 8.52021L4.43685 4.43688L0.353516 0.353546"
          stroke="currentColor"
          strokeMiterlimit="10"
        />
      </svg>
    );
  }

  if (size === "xs") {
    return (
      <svg
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-2.5"
      >
        <path
          d="M5.8335 7.91659L8.75016 4.99992L5.8335 2.08325"
          stroke="currentColor"
          strokeMiterlimit="10"
        />
        <path d="M8.63102 5H0.714355" stroke="currentColor" strokeMiterlimit="10" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 12 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block w-3"
    >
      <path
        d="M7.16699 8.52018L11.2503 4.43685L7.16699 0.353516"
        stroke="currentColor"
        strokeMiterlimit="10"
      />
      <path d="M11.0833 4.43677H0" stroke="currentColor" strokeMiterlimit="10" />
    </svg>
  );
}

export function AnimatedArrow({
  className = "",
  size = "md",
  glyph = "arrow",
}: AnimatedArrowProps) {
  return (
    <span
      aria-hidden
      className={`relative block overflow-hidden shrink-0 ${sizeClass[size]} ${className}`}
    >
      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover:translate-x-full">
        <ArrowGlyph size={size} glyph={glyph} />
      </span>
      <span className="absolute inset-0 flex items-center justify-center -translate-x-full transition-transform duration-200 ease-out group-hover:translate-x-0">
        <ArrowGlyph size={size} glyph={glyph} />
      </span>
    </span>
  );
}
