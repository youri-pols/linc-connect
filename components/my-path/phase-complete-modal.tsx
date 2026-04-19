"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { Confetti } from "./confetti";

export interface PhaseCompleteModalProps {
  open: boolean;
  onClose: () => void;
  /** Body-copy name shown after "Gefeliciteerd,". */
  userName: string;
  /** Display name for the badge, e.g. "Rolspecifieke basis". */
  phaseLabel: string;
  /** Integer used in the "Je hebt fase X voltooid" subtitle. */
  phaseNumber: number;
  /** Next phase number for the primary CTA. Omit to hide the CTA. */
  nextPhaseNumber?: number;
  /** Next phase id used for the continue link (e.g. "phase-3"). */
  nextPhaseId?: string;
  /** XP earned for this phase — shown in the pill + the "added" note. */
  xpEarned: number;
  /** New running XP total after this phase. */
  xpTotal: number;
  /** Target XP for the full path. */
  xpTarget: number;
  /** Absolute path to the badge image (in /public). */
  badgeImageSrc: string;
  /** Destination of the "Bekijk profiel" secondary CTA. */
  profileHref: string;
}

export function PhaseCompleteModal({ open, onClose, userName, phaseLabel, phaseNumber, nextPhaseNumber, nextPhaseId, xpEarned, xpTotal, xpTarget, badgeImageSrc, profileHref }: PhaseCompleteModalProps) {
  const [progressPct, setProgressPct] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const targetPct = Math.min(100, (xpTotal / xpTarget) * 100);

  /*
   * Progress-bar fill animates after the modal has finished its
   * entry animation so the user actually sees the bar fill up.
   * Confetti bursts once on open; remounting the Confetti component
   * via `burstKey` would trigger a replay if needed.
   */
  useEffect(() => {
    if (!open) {
      setProgressPct(0);
      return;
    }
    setBurstKey((k) => k + 1);
    const t = window.setTimeout(() => setProgressPct(targetPct), 600);
    return () => window.clearTimeout(t);
  }, [open, targetPct]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div role="dialog" aria-modal="true" aria-labelledby="phase-complete-title" className="fixed inset-0 z-70 flex items-center justify-center p-4">
        {/*
         * Backdrop dim — plain black at 50% alpha. Clicking it
         * closes the modal.
         */}
        <button type="button" onClick={onClose} aria-label="Sluiten" className="phase-modal-backdrop absolute inset-0 bg-black/50" />
        {/*
         * Gradient aura behind the card. A 900px circle with a
         * purple-to-orange gradient layered over rgba(0,0,0,0.5)
         * and blurred to 200px so it reads as a soft glow around
         * the modal. Non-interactive — pointer events pass to the
         * backdrop behind it.
         */}
        <div
          aria-hidden
          className="phase-modal-backdrop pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-225 rounded-full"
          style={{
            backgroundImage: "linear-gradient(241deg, rgba(113, 97, 239, 0.10) 28.43%, rgba(236, 115, 87, 0.10) 71.57%), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))",
            filter: "blur(200px)",
          }}
        />
        {/* Confetti image sits between the backdrop/aura and the card */}
        <Confetti burstKey={burstKey} />
        <div className="phase-modal-card relative bg-white rounded-3xl shadow-modal-lift p-10 w-full max-w-md flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-3 items-center text-center">
            <h2 id="phase-complete-title" className="font-display font-medium text-2xl text-black leading-none">
              Nieuwe badge ontgrendeld
            </h2>
            <p className="text-body text-sm text-black/80">
              Gefeliciteerd, {userName}! Je hebt fase {phaseNumber} voltooid.
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {/* Badge with gradient glow */}
            <div className="relative flex items-center justify-center">
              <span
                aria-hidden
                className="absolute size-56 rounded-full blur-3xl opacity-20"
                style={{
                  backgroundImage: "linear-gradient(240.7deg, #7161ef 28.4%, #ec7357 71.6%)",
                }}
              />
              <div className="phase-modal-badge relative drop-shadow-badge">
                <Image src={badgeImageSrc} alt={`${phaseLabel} Badge`} width={120} height={120} className="block size-28" priority />
              </div>
            </div>

            {/* Badge label + XP pill */}
            <div className="flex flex-col gap-2 items-center">
              <p className="font-display font-medium text-xl text-black leading-none">{phaseLabel} Badge</p>
              <p className="text-body text-sm text-black/80">Voltooid</p>
              <div className="xp-pill-gradient-bg rounded-sm px-1.5 py-1 flex items-center justify-center mt-1">
                <span className="xp-pill-gradient-text text-body text-2xs leading-pill">+{xpEarned} XP</span>
              </div>
            </div>

            {/* XP progress */}
            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex items-center justify-between w-full">
                <p className="text-body text-xs text-black/60 leading-pill">XP Voortgang</p>
                <p className="text-body text-xs text-black font-medium leading-pill">
                  {xpTotal} / {xpTarget} XP
                </p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    backgroundImage: "linear-gradient(214deg, #7161ef 28%, #ec7357 72%)",
                  }}
                />
              </div>
              <p className="phase-modal-xp-added self-end text-11 text-purple leading-pill">+ {xpEarned} XP toegevoegd</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            {nextPhaseNumber && nextPhaseId && (
              <Link href={`/mijn-pad/${nextPhaseId}`} onClick={onClose} className="group flex items-center justify-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-2 hover:bg-purple transition-colors">
                <span>Doorgaan naar Fase {nextPhaseNumber}</span>
                <AnimatedArrow size="xs" className="text-white" />
              </Link>
            )}
            <Link href={profileHref} onClick={onClose} className="flex items-center justify-center gap-1.5 border border-black/10 text-black text-xs rounded-md px-3 py-2 cursor-pointer hover:bg-black hover:text-white hover:border-black transition-colors">
              Bekijk profiel
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
