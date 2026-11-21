/**
 * An illuminated initial: a gilt frame with corner curls and a faint vine,
 * the letter in Fell English. The letter stays in the text flow, so screen
 * readers read the whole word ("W" + "hen" = "When"); only the frame is hidden.
 * Latin text only: Arabic letters join, so Arabic paragraphs never take one.
 */
const CORNER = "M9.5 27C9.5 17 17 9.5 27 9.5";

export function DropCap({ letter }: { letter: string }) {
  return (
    <span className="dropcap">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <rect x="1.5" y="1.5" width="97" height="97" fill="var(--surface-raised)" stroke="var(--ornament)" strokeWidth="3" />
        <rect x="6.5" y="6.5" width="87" height="87" fill="none" stroke="var(--text)" strokeWidth=".8" opacity=".55" />
        <g opacity=".42" fill="none" stroke="var(--ornament)" strokeWidth="1.3" strokeLinecap="round">
          <path d="M14 86C30 78 34 60 50 52S76 30 86 14" />
          <path d="M33 66C27 64 24 59 26 54" />
          <path d="M67 38C73 40 76 45 74 50" />
        </g>
        <g opacity=".42" fill="var(--ornament)">
          <path d="M25 53.5C21 50 22 45 26.5 45C28.5 48.5 28 51.6 25 53.5Z" />
          <path d="M75 50.5C79 54 78 59 73.5 59C71.5 55.5 72 52.4 75 50.5Z" />
        </g>
        {[0, 90, 180, 270].map((r) => (
          <g key={r} transform={`rotate(${r} 50 50)`}>
            <path d={CORNER} fill="none" stroke="var(--ornament)" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="15" cy="15" r="2.4" fill="var(--ornament)" />
            <path d="M50 0.5L53.4 4L50 7.5L46.6 4Z" fill="var(--ornament)" />
          </g>
        ))}
      </svg>
      <span className="dropcap-letter">{letter}</span>
    </span>
  );
}

/** A paragraph that opens with an illuminated initial. */
export function DropCapParagraph({ children, className = "" }: { children: string; className?: string }) {
  const [first = "", ...rest] = Array.from(children);
  return (
    <p className={`flow-root ${className}`}>
      <DropCap letter={first} />
      {rest.join("")}
    </p>
  );
}
