"use client";

import Image from "next/image";

/*
 * Confetti burst that renders `public/images/confetti.webp` behind
 * the modal and animates it on mount: a quick scale-and-fade-in
 * gives the impression of a single burst, then a gentle settle
 * that holds the pattern in place while the user reads the card.
 *
 * `burstKey` controls replay — incrementing the key remounts the
 * image and replays the entry animation.
 */
interface ConfettiProps {
  burstKey?: number;
}

export function Confetti({ burstKey = 0 }: ConfettiProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        key={burstKey}
        className="confetti-burst absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/images/confetti.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-contain object-center"
          priority
        />
      </div>
    </div>
  );
}
