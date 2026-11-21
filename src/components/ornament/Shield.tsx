import { useId } from "react";

/**
 * Heater shields. The four comparison labels in "Two Traditions" are told
 * apart by shape as well as colour, and each shape says something about the
 * claim's strength:
 *   historical-influence                 — a bend: a line of transmission crossing the field
 *   shared-heritage                      — per pale: one shield split into two halves
 *   comparative-interpretation           — a chevron: two arms brought to meet
 *   similarity-without-proven-connection — an empty field, dotted edge: no proven link
 */
export type ComparisonLabel =
  | "historical-influence"
  | "shared-heritage"
  | "comparative-interpretation"
  | "similarity-without-proven-connection";

export const SHIELD_PATH = "M3 3H41V20C41 33.5 32 41.5 22 45.5C12 41.5 3 33.5 3 20Z";

export function Shield({
  division = "plain",
  size = 22,
  tincture = "currentColor",
  className,
}: {
  division?: "plain" | "bend" | "per-pale" | "chevron" | "empty";
  size?: number;
  tincture?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 44 48" width={size} height={(size * 48) / 44} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`sh-${id}`}>
          <path d={SHIELD_PATH} />
        </clipPath>
      </defs>
      {division === "plain" && <path d={SHIELD_PATH} fill={tincture} />}
      {division === "bend" && (
        <g clipPath={`url(#sh-${id})`}>
          <path d={SHIELD_PATH} fill={tincture} />
          <path d="M-4 6L8 -6L52 38L40 50Z" fill="var(--surface)" />
          <path d="M-4 6L8 -6L52 38L40 50Z" fill="none" stroke={tincture} strokeWidth="1.2" />
        </g>
      )}
      {division === "per-pale" && (
        <g clipPath={`url(#sh-${id})`}>
          <rect x="0" y="0" width="22" height="48" fill={tincture} />
        </g>
      )}
      {division === "chevron" && (
        <g clipPath={`url(#sh-${id})`}>
          <path d="M-2 40L22 14L46 40L46 50L22 24L-2 50Z" fill={tincture} />
        </g>
      )}
      <path
        d={SHIELD_PATH}
        fill="none"
        stroke={tincture}
        strokeWidth={division === "empty" ? 1.6 : 1.8}
        strokeDasharray={division === "empty" ? "2.2 2.6" : undefined}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const COMPARISON_LABELS: Record<
  ComparisonLabel,
  { en: string; ar: string; meaning: string; division: "bend" | "per-pale" | "chevron" | "empty"; tincture: string }
> = {
  "historical-influence": {
    en: "Historical influence",
    ar: "تأثير تاريخي",
    meaning: "A documented link: one tradition is shown to have shaped the other.",
    division: "bend",
    tincture: "var(--accent)",
  },
  "shared-heritage": {
    en: "Shared heritage",
    ar: "تراث مشترك",
    meaning: "Both grew from a common, older source.",
    division: "per-pale",
    tincture: "var(--success)",
  },
  "comparative-interpretation": {
    en: "Comparative interpretation",
    ar: "قراءة مقارنة",
    meaning: "A reading that sets the two side by side to light up each; no influence is claimed.",
    division: "chevron",
    tincture: "var(--ornament-text)",
  },
  "similarity-without-proven-connection": {
    en: "Similarity without proven connection",
    ar: "تشابه دون صلة مثبتة",
    meaning: "They resemble each other, but no link has been shown, and the card says so plainly.",
    division: "empty",
    tincture: "var(--text-muted)",
  },
};

export function LabelBadge({ label, lang = "en" }: { label: ComparisonLabel; lang?: "en" | "ar" }) {
  const l = COMPARISON_LABELS[label];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-sm border border-hairline bg-surface py-1 ps-2 pe-3"
      lang={lang}
    >
      <Shield division={l.division} tincture={l.tincture} size={18} />
      <span className="label text-ink">{lang === "ar" ? l.ar : l.en}</span>
    </span>
  );
}
