import { useId, type ReactNode } from "react";

/**
 * A card with two faces. The flip is a single rotateY (Phase 5 tunes it);
 * with reduced motion the faces simply swap. Both faces stay in the DOM,
 * the hidden one is inert, and a real button turns the card, so it works
 * with keyboard and screen reader as well as touch.
 */
export function FlipCard({
  flipped,
  onFlip,
  front,
  back,
  frontLabel,
  backLabel,
  className = "",
}: {
  flipped: boolean;
  onFlip: () => void;
  front: ReactNode;
  back: ReactNode;
  /** Button text while the front shows, e.g. "Show meaning". */
  frontLabel: string;
  backLabel: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`flip ${flipped ? "is-flipped" : ""} ${className}`}>
      <div className="flip-inner">
        <div className="flip-face flip-front card" inert={flipped} aria-hidden={flipped} onClick={onFlip}>
          {front}
        </div>
        <div className="flip-face flip-back card" id={id} inert={!flipped} aria-hidden={!flipped} onClick={onFlip}>
          {back}
        </div>
      </div>
      <button type="button" className="flip-toggle" aria-expanded={flipped} aria-controls={id} onClick={onFlip}>
        {flipped ? backLabel : frontLabel}
      </button>
    </div>
  );
}
