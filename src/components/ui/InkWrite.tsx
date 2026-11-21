import { createElement, useEffect, useRef, useState, type ElementType } from "react";

/**
 * Words that write themselves in ink: each letter (or word) arrives with a
 * small settle, one after another, like a pen moving along the line.
 *
 * - Pure CSS (opacity + transform), so it starts with the first paint and
 *   never waits for JavaScript. With reduced motion the text is simply there.
 * - The real text stays in the page for screen readers and search; the
 *   animated copy is hidden from assistive technology.
 * - Arabic is written word by word: splitting Arabic into letters would
 *   break the joins between them.
 * - `onView` waits until the heading scrolls into view (only when JavaScript
 *   is running; without it, the text is shown at once).
 * - `afterCurtain` waits for the Prologue's curtain on a first visit.
 * - Letter mode returns to plain text when done, so the font's kerning comes back.
 */
export function InkWrite({
  as = "h1",
  text,
  by = "word",
  step,
  onView = false,
  afterCurtain = false,
  className = "",
  id,
}: {
  as?: ElementType;
  text: string;
  by?: "letter" | "word";
  /** Milliseconds between units (letters 34, words 70 by default). */
  step?: number;
  onView?: boolean;
  afterCurtain?: boolean;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const arabic = /[؀-ۿ]/.test(text);
  const mode = arabic ? "word" : by;
  const ms = step ?? (mode === "letter" ? 34 : 70);
  const [waiting, setWaiting] = useState(onView);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!onView || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setWaiting(false);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [onView]);

  const words = text.split(" ");
  let i = 0;
  const units = words.map((w, wi) => (
    <span key={wi}>
      {wi ? " " : null}
      <span className="ink-word">
        {mode === "letter"
          ? Array.from(w).map((ch, ci) => (
              <span key={ci} className="ink-unit" style={{ ["--i" as string]: i++ }}>
                {ch}
              </span>
            ))
          : (
              <span className="ink-unit" style={{ ["--i" as string]: i++ }}>
                {w}
              </span>
            )}
      </span>
    </span>
  ));
  const count = i;

  return createElement(
    as,
    {
      ref,
      id,
      className: `ink-write ${afterCurtain ? "ink-after-curtain" : ""} ${className}`,
      "data-wait": waiting ? "" : undefined,
      style: { ["--ink-step" as string]: `${ms}ms` },
      onAnimationEnd: (e: React.AnimationEvent) => {
        if (mode === "letter" && (e.target as HTMLElement).style.getPropertyValue("--i") === String(count - 1)) setDone(true);
      },
    },
    <>
      <span className="sr-only">{text}</span>
      {done ? <span aria-hidden="true">{text}</span> : <span aria-hidden="true">{units}</span>}
    </>,
  );
}
