import { useId } from "react";

/**
 * A wax seal: an uneven poured edge, a pressed ring, an embossed rose and the
 * module number. Used only for "done". The emboss is two offset strokes
 * (light up-left, dark down-right), so no SVG filters are needed.
 */

/* Deterministic uneven edge: radius wobbles with a few sine waves. */
function blobPath(cx: number, cy: number, r: number) {
  const n = 64;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const k = r + 2.4 * Math.sin(5 * t + 1.1) + 1.5 * Math.sin(9 * t + 2.3) + 1.1 * Math.sin(17 * t + 0.4);
    pts.push([cx + k * Math.cos(t), cy + k * Math.sin(t)]);
  }
  // Catmull-Rom → cubic Bézier for a smooth poured edge
  let d = `M${pts[0]![0].toFixed(2)} ${pts[0]![1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]!;
    const p1 = pts[i]!;
    const p2 = pts[(i + 1) % n]!;
    const p3 = pts[(i + 2) % n]!;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0]!.toFixed(2)} ${c1[1]!.toFixed(2)} ${c2[0]!.toFixed(2)} ${c2[1]!.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + "Z";
}

const EDGE = blobPath(60, 60, 50);
const PETAL = "M0 -1C-5.4 -2 -10.4 -6.4 -9.5 -11.7C-8.9 -15.3 -5.2 -17.2 -2 -16C-1 -15.6 -.4 -15 0 -14.3C.4 -15 1 -15.6 2 -16C5.2 -17.2 8.9 -15.3 9.5 -11.7C10.4 -6.4 5.4 -2 0 -1Z";

function Rose({ dx, dy, stroke }: { dx: number; dy: number; stroke: string }) {
  return (
    <g transform={`translate(${60 + dx} ${54 + dy})`} fill="none" stroke={stroke} strokeWidth="1.3">
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={PETAL} transform={`rotate(${a})`} />
      ))}
      {[36, 108, 180, 252, 324].map((a) => (
        <path key={a} d={PETAL} transform={`rotate(${a}) scale(.58)`} />
      ))}
      <circle r="3.2" />
    </g>
  );
}

export function WaxSeal({
  size = 96,
  numeral,
  label,
  className,
}: {
  size?: number;
  numeral?: string;
  /** Accessible name, e.g. "Module 3 complete". Omit when the seal sits beside a visible label. */
  label?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const light = "rgb(255 214 196 / .34)";
  const dark = "rgb(40 6 6 / .55)";
  return (
    <svg
      viewBox="0 0 120 124"
      width={size}
      height={(size * 124) / 120}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <radialGradient id={`wax-${id}`} cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="var(--c-wax-light)" />
          <stop offset=".55" stopColor="var(--c-wax)" />
          <stop offset="1" stopColor="var(--c-wax-dark)" />
        </radialGradient>
        <radialGradient id={`pool-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgb(30 10 8 / .32)" />
          <stop offset="1" stopColor="rgb(30 10 8 / 0)" />
        </radialGradient>
      </defs>
      {/* cast shadow (a separate shape, so stamping can scale it on its own) */}
      <ellipse className="seal-shadow" cx="62" cy="66" rx="58" ry="56" fill={`url(#pool-${id})`} />
      <g className="seal-body">
        <path d={EDGE} fill={`url(#wax-${id})`} />
        {/* pressed ring */}
        <circle cx="60.8" cy="60.8" r="38" fill="none" stroke={light} strokeWidth="2.2" />
        <circle cx="59.2" cy="59.2" r="38" fill="none" stroke={dark} strokeWidth="2.2" />
        <circle cx="60" cy="60" r="37" fill="var(--c-wax)" opacity=".55" />
        <circle cx="60" cy="60" r="33" fill="none" stroke={dark} strokeWidth=".8" strokeDasharray="1.2 2.6" />
        {/* embossed rose */}
        <Rose dx={0.8} dy={0.8} stroke={light} />
        <Rose dx={-0.6} dy={-0.6} stroke={dark} />
        {numeral ? (
          <g fontFamily="var(--font-display)" fontSize="15" textAnchor="middle">
            <text x="60.7" y="89.7" fill={light}>
              {numeral}
            </text>
            <text x="60" y="89" fill={dark}>
              {numeral}
            </text>
          </g>
        ) : null}
        {/* sheen */}
        <path d="M30 34C38 24 50 19 62 19" fill="none" stroke="rgb(255 230 215 / .35)" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
