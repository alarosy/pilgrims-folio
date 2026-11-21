import { useId, useRef, type ReactNode } from "react";

/**
 * Accessible tabs: roving focus with the arrow keys (mirrored in Arabic),
 * Home/End, and real tab/tabpanel roles.
 */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  children,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  children: ReactNode;
}) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => {
    const n = tabs.length;
    const k = (i + n) % n;
    onChange(tabs[k]!.value);
    refs.current[k]?.focus();
  };
  const at = tabs.findIndex((t) => t.value === value);
  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="tablist"
        onKeyDown={(e) => {
          const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
          if (e.key === "ArrowRight") (e.preventDefault(), move(at + (rtl ? -1 : 1)));
          if (e.key === "ArrowLeft") (e.preventDefault(), move(at + (rtl ? 1 : -1)));
          if (e.key === "Home") (e.preventDefault(), move(0));
          if (e.key === "End") (e.preventDefault(), move(tabs.length - 1));
        }}
      >
        {tabs.map((t, i) => (
          <button
            key={t.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${t.value}`}
            aria-selected={t.value === value}
            aria-controls={`${id}-panel`}
            tabIndex={t.value === value ? 0 : -1}
            className="tab"
            onClick={() => onChange(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${value}`} tabIndex={0} className="pt-8">
        {children}
      </div>
    </div>
  );
}
