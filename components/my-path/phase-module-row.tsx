import { ArrowLink } from "@/components/ui/arrow-link";
import Link from "next/link";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import type { PathModule } from "@/lib/types/my-path";

interface PhaseModuleRowProps {
  module: PathModule;
  isLast: boolean;
}

/*
 * Wider module row used on the phase detail page. Differs from the
 * compact `ModuleRow` on the overview: each row carries a one-line
 * description under the title and there is no XP pill. Only the
 * completed row has a right-side "Bekijk" link; the active row has
 * the "Bekijk module" link directly under its description.
 */
export function PhaseModuleRow({ module, isLast }: PhaseModuleRowProps) {
  const { title, description, state, href, unlockingModule } = module;

  /*
   * Completed rows keep two lines (title + description) so the
   * title is centred next to the check icon by aligning the row at
   * `items-start` — same as the other states. The bullet/check is
   * rendered with a tiny top offset so it sits on the title's cap
   * height rather than the overall row.
   */
  return (
    <div className={`flex items-start gap-3 px-5 py-4 ${isLast ? "" : "border-b border-black/15"}`}>
      {state === "completed" ? (
        <div className="shrink-0 size-4.25 rounded-full bg-green flex items-center justify-center">
          <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
            <path d="M3 7.05L0 4.05L1.05 3L3 4.95L7.95 0L9 1.05L3 7.05Z" fill="white" />
          </svg>
        </div>
      ) : state === "active" ? (
        <div className="shrink-0 size-4.25 rounded-full border border-purple" />
      ) : (
        <div className="shrink-0 size-4.25 rounded-full border border-black/15" />
      )}

      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p className={`text-body text-13 leading-tight ${state === "completed" ? "line-through text-black" : state === "locked" ? "text-black opacity-20" : "text-black"}`}>{title}</p>

        {state === "locked" && unlockingModule ? <p className="text-body text-xs text-black/60 leading-relaxed">Deze module is beschikbaar na afronding van de module {unlockingModule}.</p> : description ? <p className={`text-body text-xs text-black/60 leading-relaxed ${state === "locked" ? "opacity-60" : ""}`}>{description}</p> : null}

        {state === "active" && href && (
          <ArrowLink href={href} size="sm" className="mt-2 text-purple font-display font-semibold text-xs self-start">
            Bekijk module {title}
          </ArrowLink>
        )}
      </div>

      {state === "completed" && (
        <Link href="#" className="group inline-flex items-center my-auto gap-1.5 shrink-0 rounded-md px-3 py-1.5 text-body text-xs text-black/50 hover:text-black transition-colors">
          <span>Bekijk</span>
          <AnimatedArrow size="xs" />
        </Link>
      )}
    </div>
  );
}
