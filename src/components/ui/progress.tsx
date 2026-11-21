import { useId } from "react";
import { Icon } from "../ornament/Icon";
import { WaxSeal } from "../ornament/WaxSeal";

/** Hours bar: a graduated rule, one tick per hour. */
export function HoursBar({
  done,
  total,
  lang = "en",
}: {
  done: number;
  total: number;
  lang?: "en" | "ar";
}) {
  const pct = Math.max(0, Math.min(1, total ? done / total : 0));
  const label = lang === "ar" ? "الساعات" : "Hours";
  const text = lang === "ar" ? `${done} من ${total} ساعة` : `${done} of ${total} hours`;
  return (
    <div lang={lang}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="label text-ink-muted">{label}</span>
        <span className="nums text-caption">{text}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-valuetext={text}
        className="relative mt-1.5 h-3 overflow-hidden border border-rule bg-surface"
        style={{ ["--n" as string]: total }}
      >
        <div
          className="absolute inset-y-0 start-0 bg-accent"
          style={{ width: `${pct * 100}%` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, transparent 0 calc(100% / var(--n) - 1px), color-mix(in srgb, var(--surface) 70%, transparent) calc(100% / var(--n) - 1px) calc(100% / var(--n)))",
          }}
        />
      </div>
    </div>
  );
}

/** Fourteen segments, one per line of a sonnet; the couplet is gilded. */
export function LineRing({
  known,
  total = 14,
  size = 120,
  caption = "lines",
}: {
  known: number;
  total?: number;
  size?: number;
  caption?: string;
}) {
  const r = 40;
  const gap = 3.2;
  const step = 360 / total;
  const arc = (i: number) => {
    const a0 = ((-90 + i * step + gap / 2) * Math.PI) / 180;
    const a1 = ((-90 + (i + 1) * step - gap / 2) * Math.PI) / 180;
    const p = (a: number) => `${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
    return `M${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}`;
  };
  const couplet = total === 14 ? [12, 13] : [];
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={`${known} of ${total} ${caption} memorized`}
    >
      {Array.from({ length: total }, (_, i) => {
        const filled = i < known;
        const gilt = couplet.includes(i);
        return (
          <path
            key={i}
            d={arc(i)}
            fill="none"
            strokeWidth="8"
            stroke={filled ? (gilt ? "var(--ornament)" : "var(--accent)") : "var(--hairline)"}
          />
        );
      })}
      <text
        x="50"
        y="52"
        textAnchor="middle"
        fontFamily="var(--font-body)"
        fontSize="26"
        fill="var(--text)"
        style={{ fontVariantNumeric: "lining-nums tabular-nums" }}
      >
        {known}
      </text>
      {size >= 100 ? (
        <text x="50" y="66" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9.5" fill="var(--text-muted)">
          / {total}
        </text>
      ) : null}
    </svg>
  );
}

/** A lit candle with a soft glow — the "current" station. */
export function CandleMark({ size = 28 }: { size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id={`g-${id}`}>
          <stop offset="0" stopColor="var(--glow)" />
          <stop offset="1" stopColor="rgb(233 180 90 / 0)" />
        </radialGradient>
      </defs>
      <circle className="candle-glow" cx="16" cy="9" r="11" fill={`url(#g-${id})`} />
      <path d="M16 3.6c2 2.4 2.5 4 2.5 5.1a2.5 2.5 0 0 1-5 0c0-1.1.5-2.7 2.5-5.1Z" fill="var(--c-candle)" stroke="var(--c-gilt-ink)" strokeWidth=".8" />
      <path d="M16 6.6c.8 1 1 1.7 1 2.2a1 1 0 0 1-2 0c0-.5.2-1.2 1-2.2Z" fill="#fff4d6" />
      <path d="M16 11.2v1.6" stroke="var(--text)" strokeWidth="1" />
      <rect x="12.6" y="12.8" width="6.8" height="12.4" rx=".6" fill="var(--surface)" stroke="var(--text)" strokeWidth="1.2" />
      <path d="M9 26.2h14" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export type Status = "locked" | "current" | "done";

const STATUS_WORD: Record<Status, { en: string; ar: string }> = {
  done: { en: "Done", ar: "مكتملة" },
  current: { en: "Now", ar: "الآن" },
  locked: { en: "Locked", ar: "مقفلة" },
};

/** Status is never colour alone: a mark and a word, always together. */
export function StatusMark({ status, lang = "en" }: { status: Status; lang?: "en" | "ar" }) {
  const word = STATUS_WORD[status][lang];
  return (
    <span
      className={`status label ${status === "done" ? "text-success" : status === "current" ? "text-accent" : "text-ink-muted"}`}
      lang={lang}
    >
      {status === "done" && <WaxSeal size={26} />}
      {status === "current" && <CandleMark size={26} />}
      {status === "locked" && <Icon name="lock" size={22} />}
      <span>{word}</span>
    </span>
  );
}
