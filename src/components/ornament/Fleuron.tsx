/**
 * Printer's fleurons, drawn as SVG so they look the same on every device
 * (the Unicode glyphs ❦ ❧ vary wildly between fonts). Original drawings.
 */

/* Ivy leaf with its vein cut out (even-odd), pointing down, notch at the top. */
const LEAF =
  "M20 37C11.5 31.5 4.6 25 5.6 16.6C6.4 10.2 12.6 7.4 17.2 10.6C18.6 11.6 19.5 13 20 14.6C20.5 13 21.4 11.6 22.8 10.6C27.4 7.4 33.6 10.2 34.4 16.6C35.4 25 28.5 31.5 20 37Z" +
  "M20 16.8C19 22.5 19.2 28.5 20 33.2C20.8 28.5 21 22.5 20 16.8Z" +
  "M19.4 23.4C16.6 21.6 13 20.9 10.4 21.3C13.2 21.8 16.4 23 19.3 25Z" +
  "M20.6 23.4C23.4 21.6 27 20.9 29.6 21.3C26.8 21.8 23.6 23 20.7 25Z";
const STEM = "M20 14.8C19.4 8.6 22.4 4.2 27.4 3.6C31.4 3.1 33.6 6.6 31.4 8.8C30 10.1 28.2 9.3 28.6 7.7";

export function Hedera({
  size = 28,
  turned = false,
  className,
}: {
  size?: number;
  /** true = ❧ (rotated floral heart, used as a pointer / bullet) */
  turned?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden="true">
      <g transform={turned ? "rotate(-90 20 20)" : "rotate(-24 20 20)"}>
        <path d={LEAF} fill="currentColor" fillRule="evenodd" />
        <path d={STEM} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A small printer's flower (four heart-shaped petals), for separators and list bullets. */
export function Floret({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="-10 -10 20 20" width={size} height={size} className={className} aria-hidden="true">
      {[0, 90, 180, 270].map((a) => (
        <path
          key={a}
          d="M0-1.4C-3.4-2.6-5.2-5.8-3.4-8.2-2.2-9.6-.6-9.2 0-8C.6-9.2 2.2-9.6 3.4-8.2 5.2-5.8 3.4-2.6 0-1.4Z"
          transform={`rotate(${a})`}
          fill="currentColor"
        />
      ))}
      <circle r={1.6} fill="var(--surface)" stroke="currentColor" strokeWidth={0.9} />
    </svg>
  );
}

/** Thick–thin rule with an optional centred ornament. */
export function OrnamentRule({
  ornament = "hedera",
  className = "",
}: {
  ornament?: "hedera" | "floret" | "none";
  className?: string;
}) {
  if (ornament === "none") return <div className={`rule-double ${className}`} role="separator" />;
  return (
    <div className={`flex items-center gap-3 text-ornament ${className}`} role="separator">
      <div className="rule-double flex-1" />
      {ornament === "hedera" ? <Hedera size={26} className="text-ornament-ink" /> : <Floret className="text-ornament-ink" />}
      <div className="rule-double flex-1 -scale-y-100" />
    </div>
  );
}
