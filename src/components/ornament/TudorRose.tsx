/**
 * The Tudor rose: five outer petals, five inner petals turned 36°, barbs
 * between the outer petals, and a seeded centre. Original drawing.
 *
 * variant "colour" — heraldic colours (gules outer, argent inner, or seed, vert barbs)
 * variant "mono"   — one colour (currentColor), for icons, seals and print
 */
const OUTER_PETAL =
  "M0 -1.5C-9 -3 -17 -10.5 -15.6 -19.2C-14.6 -25.2 -8.6 -28.4 -3.2 -26.4C-1.6 -25.8 -0.6 -24.8 0 -23.6C0.6 -24.8 1.6 -25.8 3.2 -26.4C8.6 -28.4 14.6 -25.2 15.6 -19.2C17 -10.5 9 -3 0 -1.5Z";
const BARB = "M-2.4 -21.5C-1.6 -26 -0.8 -29.5 0 -32.5C0.8 -29.5 1.6 -26 2.4 -21.5C1 -22.4 -1 -22.4 -2.4 -21.5Z";

const angles = [0, 72, 144, 216, 288];

export function TudorRose({
  size = 48,
  variant = "colour",
  title,
  className,
}: {
  size?: number;
  variant?: "colour" | "mono";
  title?: string;
  className?: string;
}) {
  const mono = variant === "mono";
  const outerFill = mono ? "currentColor" : "var(--c-oxblood)";
  const innerFill = mono ? "var(--surface)" : "var(--c-parchment)";
  const line = mono ? "currentColor" : "var(--c-ink)";
  return (
    <svg
      viewBox="-34 -34 68 68"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {angles.map((a) => (
        <path
          key={`b${a}`}
          d={BARB}
          transform={`rotate(${a + 36})`}
          fill={mono ? "currentColor" : "var(--c-tudor)"}
        />
      ))}
      {angles.map((a) => (
        <path key={`o${a}`} d={OUTER_PETAL} transform={`rotate(${a})`} fill={outerFill} stroke={line} strokeWidth={0.9} />
      ))}
      {angles.map((a) => (
        <path
          key={`i${a}`}
          d={OUTER_PETAL}
          transform={`rotate(${a + 36}) scale(0.62)`}
          fill={innerFill}
          stroke={line}
          strokeWidth={1.3}
        />
      ))}
      <circle r={5.6} fill={mono ? "currentColor" : "var(--c-gilt)"} stroke={line} strokeWidth={0.8} />
      {angles.map((a) => (
        <circle
          key={`s${a}`}
          r={0.9}
          cx={0}
          cy={-3}
          transform={`rotate(${a + 36})`}
          fill={mono ? "var(--surface)" : "var(--c-ink)"}
        />
      ))}
    </svg>
  );
}
