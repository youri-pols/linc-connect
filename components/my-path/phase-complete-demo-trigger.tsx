"use client";

import { useState } from "react";
import { PhaseCompleteModal, type PhaseCompleteModalProps } from "./phase-complete-modal";

type TriggerProps = Omit<PhaseCompleteModalProps, "open" | "onClose">;

/*
 * Small client-side wrapper so the otherwise-static phase detail
 * page can preview the "Fase voltooid" celebration without wiring
 * up real task state. The trigger lives inline with the back
 * button and is labelled explicitly as a demo.
 */
export function PhaseCompleteDemoTrigger(props: TriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="self-start cursor-pointer flex items-center gap-1.5 bg-purple text-white text-xs rounded-md px-3 py-1.5 hover:opacity-90 transition-opacity">
        <span className="icon h-4">celebration</span>
        Demo: fase voltooien
      </button>
      <PhaseCompleteModal {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
