/**
 * The icon family: woodcut-weight line drawings on a 24px grid, stroke 1.5,
 * round ends. All original. Decorative by default (aria-hidden); pass `title`
 * when an icon stands alone without a visible word.
 */
import type { ReactNode } from "react";

const cog = (() => {
  const teeth = 8;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
    const r1 = i % 2 === 0 ? 9 : 6.9;
    const spread = 0.17;
    pts.push(
      `${(12 + r1 * Math.cos(a - spread)).toFixed(2)} ${(12 + r1 * Math.sin(a - spread)).toFixed(2)}`,
      `${(12 + r1 * Math.cos(a + spread)).toFixed(2)} ${(12 + r1 * Math.sin(a + spread)).toFixed(2)}`,
    );
  }
  return `M${pts.join("L")}Z`;
})();

const rosePetals = [0, 72, 144, 216, 288]
  .map((a) => {
    const t = ((a - 90) * Math.PI) / 180;
    const x = 12 + 5.4 * Math.cos(t);
    const y = 12 + 5.4 * Math.sin(t);
    return `M${x.toFixed(2)} ${y.toFixed(2)}m-3.6 0a3.6 3.6 0 1 0 7.2 0a3.6 3.6 0 1 0-7.2 0`;
  })
  .join("");

export const ICONS = {
  rose: (
    <>
      <path d={rosePetals} />
      <circle cx="12" cy="12" r="2.3" />
    </>
  ),
  quill: (
    <>
      <path d="M20.5 3.2C13.6 3.6 8.8 8.4 7.9 15.6C14.4 15.2 19.4 10.4 20.5 3.2Z" />
      <path d="M3.5 20.5C7.6 16.2 12 11.6 16.8 7.1" />
      <path d="M10.6 12.4l3.4.4M12.6 9.8l3.2.4" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.4C9.8 4.9 6.4 4.5 3 5v13.6c3.4-.5 6.8-.1 9 1.5 2.2-1.6 5.6-2 9-1.5V5c-3.4-.5-6.8-.1-9 1.4Z" />
      <path d="M12 6.4v13.7" />
    </>
  ),
  scroll: (
    <>
      <path d="M7.5 5.5h10.6a1.9 1.9 0 0 1 0 3.8H16.6V17.6a2.4 2.4 0 0 1-2.4 2.4H5.8a1.9 1.9 0 0 1 0-3.8H7.5V7.4a1.9 1.9 0 0 0-3.8 0v.6" />
      <path d="M7.5 7.4a1.9 1.9 0 0 0-1.9-1.9H7.5" />
      <path d="M10.5 11h3.4M10.5 14h3.4" />
    </>
  ),
  map: (
    <>
      <path d="M3 6.2 8.6 4l6.8 2.5L21 4.3v13.5L15.4 20l-6.8-2.5L3 19.7Z" />
      <path d="M8.6 4v13.5M15.4 6.5V20" />
    </>
  ),
  hourglass: (
    <>
      <path d="M6 3.5h12M6 20.5h12" />
      <path d="M7.8 3.5c0 5 3.9 6 3.9 8.5s-3.9 3.5-3.9 8.5M16.2 3.5c0 5-3.9 6-3.9 8.5s3.9 3.5 3.9 8.5" />
      <path d="M9.6 18.6h4.8" />
    </>
  ),
  candle: (
    <>
      <path d="M12 3.2c1.7 2 2.1 3.4 2.1 4.3a2.1 2.1 0 0 1-4.2 0c0-.9.4-2.3 2.1-4.3Z" />
      <path d="M12 9.7V11M9.4 11h5.2v9.5H9.4ZM6.5 20.5h11" />
    </>
  ),
  mask: (
    <>
      <path d="M4.6 5c4.6 1.6 10.2 1.6 14.8 0 .6 7.4-2 13.6-7.4 14.6C6.6 18.6 4 12.4 4.6 5Z" />
      <path d="M7.9 10.1q1.4-1.2 2.8 0M13.3 10.1q1.4-1.2 2.8 0M9.2 14.4q2.8 2.4 5.6 0" />
    </>
  ),
  seal: (
    <>
      <circle cx="12" cy="10" r="6.6" />
      <circle cx="12" cy="10" r="3.6" />
      <path d="M8.4 15.6 7 21l2.4-1.3 1.5 1.8.5-4.9M15.6 15.6 17 21l-2.4-1.3-1.5 1.8-.5-4.9" />
    </>
  ),
  crown: (
    <>
      <path d="M4.2 17.5 3 8.2l5 3.8L12 5l4 7 5-3.8-1.2 9.3Z" />
      <path d="M4.2 20.3h15.6" />
    </>
  ),
  dagger: (
    <>
      <path d="m12 2.6 1.7 11.2h-3.4Z" />
      <path d="M7.2 13.8h9.6M12 13.8v4.6" />
      <circle cx="12" cy="20" r="1.5" />
    </>
  ),
  manicule: (
    <>
      <path d="M2.8 9.6h3.6v7H2.8Z" />
      <path d="M6.4 10.2c1.6-1.1 3.3-1.6 5-1.6h8.4a1.35 1.35 0 0 1 0 2.7h-6.6" />
      <path d="M13.2 11.3h1.6a1.2 1.2 0 0 1 0 2.4h-1.8M13 13.7h1.4a1.15 1.15 0 0 1 0 2.3h-1.8M12.6 16h.8a1.1 1.1 0 0 1 0 2.2H9.6c-1.4 0-2.4-.6-3.2-1.6" />
      <path d="M11.4 8.6c.6-1.1 1.8-1.7 3-1.5" />
    </>
  ),
  lock: (
    <>
      <path d="M6.5 11h11v9h-11Z" />
      <path d="M8.8 11V8.2a3.2 3.2 0 0 1 6.4 0V11M12 14.4v2.2" />
    </>
  ),
  check: <path d="m5 12.6 4.6 4.4L19.2 7" />,
  close: <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />,
  contents: (
    <>
      <path d="M9 7h11M9 12h11M9 17h11" />
      <circle cx="5" cy="7" r=".9" fill="currentColor" />
      <circle cx="5" cy="12" r=".9" fill="currentColor" />
      <circle cx="5" cy="17" r=".9" fill="currentColor" />
    </>
  ),
  settings: (
    <>
      <path d={cog} />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  arrow: <path d="M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5" />,
  play: <path d="M8 5.5v13l10.5-6.5Z" />,
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" />,
  web: (
    <>
      <circle cx="12" cy="5.5" r="2.2" />
      <circle cx="5.5" cy="17" r="2.2" />
      <circle cx="18.5" cy="17" r="2.2" />
      <path d="M11 7.4 6.6 15M13 7.4l4.4 7.6M7.7 17h8.6" />
    </>
  ),
  external: <path d="M14 4.5h5.5V10M19.5 4.5l-8 8M17 14v5.5H4.5V7H10" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

/** Icons that point along the reading direction flip in Arabic. */
const DIRECTIONAL: IconName[] = ["arrow", "manicule", "external"];

export function Icon({
  name,
  size = 22,
  title,
  className = "",
}: {
  name: IconName;
  size?: number;
  title?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${DIRECTIONAL.includes(name) ? "icon-directional" : ""} ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}
