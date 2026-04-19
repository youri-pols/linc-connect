"use client";

/*
 * Confetti burst that renders `public/images/confetti.webp` behind
 * the modal and animates it on mount: a quick scale-and-fade-in
 * gives the impression of a single burst, then a gentle settle
 * that holds the pattern in place while the user reads the card.
 *
 * `burstKey` controls replay — incrementing the key remounts the
 * image and replays the entry animation.
 *
 * Uses a plain `<img>` with `loading="eager"` + high fetch
 * priority instead of `next/image`, because Next's optimisation
 * pipeline was still deferring the asset on production — this
 * modal is click-triggered so we want the bytes in-flight the
 * instant the component mounts.
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/confetti.webp"
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 size-full object-contain object-center"
        />
      </div>
    </div>
  );
}
