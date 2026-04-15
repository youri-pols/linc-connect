import { ArrowLink } from "@/components/ui/arrow-link";
import Link from "next/link";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import type { PathModule } from "@/lib/types/my-path";

interface ModuleRowProps {
  module: PathModule;
  isLast: boolean;
}

/*
 * Row in a phase section showing one module in one of three states.
 *
 *   - completed: green check_small glyph + strikethrough title,
 *     green XP pill and a subtle "Bekijk" link.
 *   - active:    purple-outline circle, black title, inline purple
 *     "Bekijk module [name]" link beneath, gradient XP pill.
 *   - locked:    neutral empty circle, faded (opacity-20) title,
 *     descriptive "Deze module is beschikbaar…" subtitle, gradient
 *     XP pill, no deep link.
 *
 * Checkboxes aren't togglable — the module is only auto-marked done
 * when all of its tasks are completed (fase 2 Supabase logic).
 */
export function ModuleRow({ module, isLast }: ModuleRowProps) {
  const { title, xpReward, state, href, unlockingModule } = module;

  const dividerClass = state === "locked" ? "border-black/5" : "border-black/15";
  /*
   * Completed rows are always single-line → vertically centre the
   * bullet, title, XP pill and "Bekijk" link. Active/locked rows
   * may wrap to two lines, so the bullet aligns with the first
   * line's cap height (items-start, no manual offset).
   */
  const rowAlign = state === "completed" ? "items-center" : "items-start";

  return (
    <div
      className={`flex ${rowAlign} justify-between gap-4 py-3 border-b ${dividerClass}`}
    >
      <div className={`flex ${rowAlign} gap-3 flex-1 min-w-0`}>
        {state === "completed" ? (
          <div className="shrink-0 size-4 rounded-full bg-green flex items-center justify-center">
            <svg
              width="9"
              height="8"
              viewBox="0 0 9 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="block"
            >
              <path d="M3 7.05L0 4.05L1.05 3L3 4.95L7.95 0L9 1.05L3 7.05Z" fill="white" />
            </svg>
          </div>
        ) : state === "active" ? (
          <div className="shrink-0 size-4 rounded-full border border-purple" />
        ) : (
          <div className="shrink-0 size-4 rounded-full border border-black/15" />
        )}

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p
            className={`text-body text-13 leading-none ${
              state === "completed"
                ? "line-through text-black"
                : state === "locked"
                ? "text-black opacity-20"
                : "text-black"
            }`}
          >
            {title}
          </p>

          {state === "active" && href && (
            <ArrowLink
              href={href}
              size="sm"
              className="text-purple font-display font-semibold text-xs self-start"
            >
              Bekijk module {title}
            </ArrowLink>
          )}

          {state === "locked" && unlockingModule && (
            <p className="text-body text-xs text-black/60 leading-relaxed">
              Deze module is beschikbaar na afronding van de module {unlockingModule}.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 my-auto">
        {/* XP reward pill — green for completed, gradient for others */}
        {state === "completed" ? (
          <div className="bg-green/10 rounded-sm px-1.5 py-1 flex items-center justify-center">
            <span className="text-body text-2xs text-green leading-[1.1]">
              +{xpReward} XP
            </span>
          </div>
        ) : (
          <div className="xp-pill-gradient-bg rounded-sm px-1.5 py-1 flex items-center justify-center">
            <span className="xp-pill-gradient-text text-body text-2xs leading-[1.1]">
              +{xpReward} XP
            </span>
          </div>
        )}

        {state === "completed" && (
          <Link
            href="#"
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-body text-xs text-black/50 hover:text-black transition-colors"
          >
            <span>Bekijk</span>
            <AnimatedArrow size="xs" />
          </Link>
        )}
      </div>
    </div>
  );
}
