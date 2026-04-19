"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLink } from "@/components/ui/arrow-link";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { MiniConfettiBurst } from "./mini-confetti-burst";
import type { PathTask } from "@/lib/types/my-path";

interface ModuleTaskChecklistProps {
  initialTasks: PathTask[];
  /** XP that will be awarded when the user claims the module. */
  xpReward: number;
}

/*
 * Interactive task checklist for the module detail page. Tasks that
 * aren't already completed can be toggled by clicking their circle —
 * state lives only in React so a page reload resets the demo back
 * to the initial 2-of-5 progress (no database yet).
 *
 * Once every task is ticked the bottom "Claim je XP" button enables
 * itself; clicking it triggers a full-screen confetti burst around
 * the button.
 */
export function ModuleTaskChecklist({ initialTasks, xpReward }: ModuleTaskChecklistProps) {
  const [tasks, setTasks] = useState<PathTask[]>(initialTasks);
  const [claimBurst, setClaimBurst] = useState(0);

  const remaining = useMemo(() => tasks.filter((t) => t.state !== "completed").length, [tasks]);
  const allDone = remaining === 0;

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        // Tasks are auto-marked done by clicking their circle.
        // Toggling back to "active"/"todo" lets the demo replay.
        if (t.state === "completed") {
          return { ...t, state: t.linkLabel ? "active" : "todo" };
        }
        return { ...t, state: "completed" };
      }),
    );
  };

  const handleClaim = () => {
    if (!allDone) return;
    setClaimBurst((k) => k + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Task list card */}
      <div className="flex flex-col bg-white border border-black/15 rounded-lg shadow-card overflow-hidden">
        {tasks.map((task, i) => (
          <TaskRow key={task.id} task={task} isLast={i === tasks.length - 1} onToggle={() => toggleTask(task.id)} />
        ))}
      </div>

      {/* Completion prompt */}
      <div className="relative bg-white border border-black/15 rounded-lg shadow-card px-5 py-6 flex flex-col gap-3 items-center text-center">
        <div className="xp-pill-gradient-bg rounded-sm px-1.5 py-1 flex items-center justify-center">
          <span className="xp-pill-gradient-text text-body text-2xs leading-pill">+{xpReward} XP te verdienen</span>
        </div>
        <div className="flex flex-col gap-0.5 max-w-md">
          <p className="text-body text-13 text-black">Klaar met deze module?</p>
          <p className="text-body text-xs text-black/60 leading-relaxed">
            Rond alle {tasks.length} taken af en verdien {xpReward} XP. Je begeleider ontvangt een melding.
          </p>
        </div>

        <div className="relative">
          <button type="button" onClick={handleClaim} disabled={!allDone} className={`relative z-10 flex items-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-1.5 transition-opacity ${allDone ? "opacity-100 cursor-pointer hover:bg-purple" : "opacity-20 cursor-not-allowed"}`}>
            <span className="icon">editor_choice</span>
            <span>{allDone ? "Claim je XP" : `${remaining} taken te gaan`}</span>
          </button>

          {/*
           * Mini confetti explosion anchored to the button centre —
           * particles shoot up and out from here, pause briefly at
           * the apex, then fall under gravity while fading out.
           */}
          {claimBurst > 0 && <MiniConfettiBurst burstKey={claimBurst} />}
        </div>
      </div>
    </div>
  );
}

interface TaskRowProps {
  task: PathTask;
  isLast: boolean;
  onToggle: () => void;
}

/*
 * Single task row. Mirrors `PhaseModuleRow` visually but the circle
 * is a real button that toggles completion, and the deep-link text
 * is "Bekijk …" rather than "Bekijk module …".
 */
function TaskRow({ task, isLast, onToggle }: TaskRowProps) {
  const { state, title, description, href, linkLabel } = task;

  return (
    <div className={`flex items-start gap-3 px-5 py-4 ${isLast ? "" : "border-b border-black/15"}`}>
      <button type="button" aria-pressed={state === "completed"} aria-label={state === "completed" ? "Markeer als nog niet gedaan" : "Markeer als gedaan"} onClick={onToggle} className="shrink-0 mt-0.5 cursor-pointer">
        {state === "completed" ? (
          <span className="size-4.25 rounded-full bg-green flex items-center justify-center">
            <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
              <path d="M3 7.05L0 4.05L1.05 3L3 4.95L7.95 0L9 1.05L3 7.05Z" fill="white" />
            </svg>
          </span>
        ) : state === "active" ? (
          <span className="block size-4.25 rounded-full border border-purple" />
        ) : (
          <span className="block size-4.25 rounded-full border border-black/15 hover:border-black/40 transition-colors" />
        )}
      </button>

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <p className={`text-body text-13 leading-tight ${state === "completed" ? "line-through text-black" : "text-black"}`}>{title}</p>
        <p className="text-body text-xs text-black/60 leading-relaxed">{description}</p>
        {state === "active" && href && linkLabel && (
          <ArrowLink href={href} size="sm" className="mt-2 text-purple font-display font-semibold text-xs self-start">
            {linkLabel}
          </ArrowLink>
        )}
      </div>

      {state === "completed" && href && (
        <Link href={href} className="group inline-flex items-center my-auto gap-1.5 shrink-0 rounded-md px-3 py-1.5 text-body text-xs text-black/50 hover:text-black transition-colors">
          <span>Bekijk</span>
          <AnimatedArrow size="xs" />
        </Link>
      )}
    </div>
  );
}
