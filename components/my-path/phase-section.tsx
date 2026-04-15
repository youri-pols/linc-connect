import Link from "next/link";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { ModuleRow } from "./module-row";
import type { PathPhase } from "@/lib/types/my-path";

interface PhaseSectionProps {
  phase: PathPhase;
}

/*
 * Card showing one phase with its modules listed inside. The
 * active phase is outlined in purple with a 3px left accent bar;
 * completed phases get a neutral 1px border on all sides.
 *
 * The header pill summarises module progress ("1 van 4 modules
 * afgerond") when active, or "Voltooid" when done.
 */
export function PhaseSection({ phase }: PhaseSectionProps) {
  const isActive = phase.status === "active";
  const isCompleted = phase.status === "completed";

  const completedCount = phase.modules.filter((m) => m.state === "completed").length;
  const totalModules = phase.modules.length;

  const statusPillClass = isCompleted
    ? "bg-green/10 text-green"
    : "bg-purple/10 text-purple";
  const statusPillLabel = isCompleted
    ? "Voltooid"
    : `${completedCount} van ${totalModules} modules afgerond`;

  /*
   * Three gray sides (top/right/bottom) with a 3px coloured accent
   * on the left — purple while active, green once completed.
   */
  const borderClass = isActive
    ? "border-t border-r border-b border-black/15 border-l-3 border-l-purple"
    : isCompleted
    ? "border-t border-r border-b border-black/15 border-l-3 border-l-green"
    : "border border-black/15";

  return (
    <div
      className={`flex flex-col gap-4 bg-white rounded-lg shadow-card px-6 py-5 ${borderClass}`}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="font-display font-medium text-sm">{phase.sectionTitle}</h3>
        <div className="flex items-center gap-2">
          <span
            className={`text-body text-11 leading-none rounded-md px-3 py-2 ${statusPillClass}`}
          >
            {statusPillLabel}
          </span>
          <Link
            href={`/mijn-pad/${phase.id}`}
            className="group inline-flex items-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-1.5 hover:bg-purple transition-colors"
          >
            <span>Bekijk deze fase</span>
            <AnimatedArrow size="xs" className="text-white" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col rounded-lg overflow-hidden">
        {phase.modules.map((module, i) => (
          <ModuleRow
            key={module.id}
            module={module}
            isLast={i === phase.modules.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
