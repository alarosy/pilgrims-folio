import { useEffect, useId, useRef, useState } from "react";
import { motionReduced, oncePerVisit } from "~/lib/motion";

/**
 * The hourglass: completed hours out of the total, as sand.
 * Both piles are drawn full and sized with scaleY, so the fill animation is
 * transform-only: the upper pile sinks toward the neck while the lower one
 * rises from the base, with a thin stream falling only while it moves.
 * `fill` plays it once per visit when the glass scrolls into view
 * (or every time `replay` changes, for the style guide).
 */
const GLASS =
  "M31 20C31 58 55 82 57.4 100C55 118 31 142 31 180H89C89 142 65 118 62.6 100C65 82 89 58 89 20Z";
const TOP_Y = 28;
const NECK = 100;
const BASE = 180;
const LOW_TOP = 112;

export function Hourglass({
  done,
  total,
  size = 150,
  fill = false,
  replay,
}: {
  done: number;
  total: number;
  size?: number;
  fill?: boolean;
  replay?: number;
}) {
  const id = useId().replace(/:/g, "");
  const p = Math.max(0, Math.min(1, total ? done / total : 0));
  const svg = useRef<SVGSVGElement>(null);
  const [flowing, setFlowing] = useState(false);

  useEffect(() => {
    const el = svg.current;
    if (!el || (!fill && replay === undefined) || p === 0 || motionReduced()) return;
    const play = () => {
      const upper = el.querySelector<SVGGElement>(".sand-upper");
      const lower = el.querySelector<SVGGElement>(".sand-lower");
      if (!upper || !lower) return;
      const opts: KeyframeAnimationOptions = { duration: 1300, easing: "cubic-bezier(0.45, 0.05, 0.55, 0.95)" };
      setFlowing(true);
      upper.animate([{ transform: "scaleY(1)" }, { transform: `scaleY(${1 - p})` }], opts);
      const a = lower.animate([{ transform: "scaleY(0)" }, { transform: `scaleY(${p})` }], opts);
      a.onfinish = () => setFlowing(false);
    };
    if (replay !== undefined) {
      play();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        if (oncePerVisit("pf:hourglass")) play();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fill, replay, p]);

  return (
    <svg
      ref={svg}
      viewBox="0 0 120 200"
      width={(size * 120) / 200}
      height={size}
      role="img"
      aria-label={`${done} of ${total} hours completed`}
    >
      <defs>
        <clipPath id={`glass-${id}`}>
          <path d={GLASS} />
        </clipPath>
        <linearGradient id={`sand-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="var(--c-gilt-ink)" />
          <stop offset=".45" stopColor="var(--c-gilt)" />
          <stop offset="1" stopColor="var(--c-gilt-ink)" />
        </linearGradient>
      </defs>

      <path d={GLASS} fill="var(--surface-raised)" opacity=".55" />

      <g clipPath={`url(#glass-${id})`}>
        <g
          className="sand-upper"
          style={{ transform: `scaleY(${1 - p})`, transformOrigin: `60px ${NECK}px`, transformBox: "view-box" }}
        >
          <rect x="20" y={TOP_Y} width="80" height={NECK - TOP_Y} fill={`url(#sand-${id})`} />
        </g>
        <g
          className="sand-lower"
          style={{ transform: `scaleY(${p})`, transformOrigin: `60px ${BASE}px`, transformBox: "view-box" }}
        >
          <path d={`M20 ${LOW_TOP + 6}Q60 ${LOW_TOP - 7} 100 ${LOW_TOP + 6}V${BASE}H20Z`} fill={`url(#sand-${id})`} />
        </g>
        {flowing ? (
          <line className="sand-stream" x1="60" x2="60" y1={NECK - 2} y2={BASE - 4} stroke="var(--c-gilt)" strokeWidth="1.2" strokeDasharray="2 2" />
        ) : null}
      </g>

      <path d={GLASS} fill="none" stroke="var(--text)" strokeWidth="1.3" />
      <path d="M38 30C39 52 48 70 53 84" fill="none" stroke="var(--surface)" strokeWidth="2" strokeLinecap="round" opacity=".8" />

      {[16, 104].map((x) => (
        <g key={x} fill="var(--text)">
          <rect x={x - 2.4} y="16" width="4.8" height="168" rx="1.6" />
          {[40, 100, 160].map((y) => (
            <ellipse key={y} cx={x} cy={y} rx="4.6" ry="3.4" />
          ))}
        </g>
      ))}
      <rect x="6" y="6" width="108" height="11" rx="2" fill="var(--text)" />
      <rect x="10" y="17" width="100" height="3" fill="var(--text)" opacity=".7" />
      <rect x="10" y="180" width="100" height="3" fill="var(--text)" opacity=".7" />
      <rect x="6" y="183" width="108" height="11" rx="2" fill="var(--text)" />
    </svg>
  );
}
