import { useEffect, useRef } from "react";
import { motionReduced } from "~/lib/motion";

/**
 * The curtain between scenes. Tells the user "you are entering (or leaving)
 * a different world": it plays only when crossing into or out of the
 * Scottish Play (where the whole site turns to candlelight, and the change
 * happens behind it) or the Final Folio. It is on screen in the same frame
 * as the new page, then opens (~0.85 s). Reduced motion: it fades.
 */
export function SceneCurtain({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, motionReduced() ? 600 : 950);
    return () => window.clearTimeout(id);
  }, [onDone]);
  return (
    <div className="scene-curtain" aria-hidden="true">
      <div className="curtain-panel curtain-left" />
      <div className="curtain-panel curtain-right" />
      <div className="curtain-valance" />
    </div>
  );
}

/** Pages whose arrival or departure deserves the curtain. */
export const isStage = (base: string) => base.startsWith("/macbeth") || base.startsWith("/folio");

/**
 * The optional ink trail (Settings; off by default). It tells the user
 * nothing, so by the brief's own rule it is not on unless chosen. Desktop
 * mouse only; a few fading dots of ink on a canvas, idle when the mouse rests.
 */
export function InkTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
    };
    size();
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#2a1f17";
    const pts: { x: number; y: number; t: number }[] = [];
    let raf = 0;
    const LIFE = 600;
    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, c.width, c.height);
      while (pts.length && now - pts[0]!.t > LIFE) pts.shift();
      ctx.strokeStyle = ink;
      ctx.lineCap = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]!;
        const b = pts[i]!;
        const life = 1 - (now - b.t) / LIFE;
        ctx.globalAlpha = Math.max(0, life) * 0.32;
        ctx.lineWidth = (0.6 + life * 2.2) * dpr;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      raf = pts.length > 1 ? requestAnimationFrame(draw) : 0;
      if (!raf) ctx.clearRect(0, 0, c.width, c.height);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pts.push({ x: e.clientX * dpr, y: e.clientY * dpr, t: performance.now() });
      if (pts.length > 48) pts.shift();
      if (!raf) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", size);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", size);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={ref} className="ink-trail" aria-hidden="true" />;
}
