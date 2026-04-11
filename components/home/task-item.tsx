import { ArrowLink } from "@/components/ui/arrow-link";
import type { Task } from "@/lib/types/home";

interface TaskItemProps {
  task: Task;
}

/*
 * One row inside the "Mijn taken" list. Renders a rounded checkbox,
 * title + description, an optional "Bekijk" deep-link to a linked
 * article, and a module pill on the right.
 *
 * Layout is responsive: on narrow screens the module pill stacks
 * below the content, on md+ it sits next to it and is vertically
 * centered against the row.
 *
 * The checkbox is purely visual for fase 1; persisting completion
 * lands in fase 2 (Supabase).
 */
export function TaskItem({ task }: TaskItemProps) {
  const { title, description, moduleLabel, completed, current, linkedArticle } = task;

  const checkboxClass = completed
    ? "bg-purple border-purple text-white"
    : current
    ? "border-purple"
    : "border-black/15";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4 px-5 py-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div
          className={`shrink-0 mt-0.5 flex items-center justify-center size-4 rounded-full border ${checkboxClass}`}
        >
          {completed && <span className="icon text-xs text-white">check</span>}
        </div>

        <div className="flex flex-col gap-2.5 min-w-0 flex-1">
          <div className="flex flex-col gap-0.5">
            <p className="text-body text-13">{title}</p>
            <p className="text-body text-xs text-black/60">{description}</p>
          </div>

          {current && linkedArticle && (
            <ArrowLink
              href={linkedArticle.href}
              size="sm"
              className="text-purple font-display font-semibold text-xs"
            >
              Bekijk {linkedArticle.title}
            </ArrowLink>
          )}
        </div>
      </div>

      <div className="shrink-0 self-start md:self-center bg-purple/10 rounded px-2 py-1.5">
        <p className="text-body text-xs leading-none text-purple">{moduleLabel}</p>
      </div>
    </div>
  );
}
