import { useId } from "react";
import { TudorRose } from "./TudorRose";
import { Hedera } from "./Fleuron";

/**
 * A printer's head-piece: an ivy vine between thick–thin rules, broken at the
 * centre by a rose roundel. On narrow screens it collapses to a single fleuron
 * so the ornament never crowds the text.
 */

/* An ivy leaf with its base at 0,0 and its tip at 0,-10. */
const LEAF =
  "M0 0C-4.6-1.4-6.2-5.4-4-8.2-2.9-9.6-1.2-9.4 0-10.6 1.2-9.4 2.9-9.6 4-8.2 6.2-5.4 4.6-1.4 0 0ZM0-1.6C-.3-4.4-.2-6.6 0-8.6.2-6.6.3-4.4 0-1.6Z";

export function HeadPiece({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`text-ornament-ink ${className}`} role="presentation">
      <div className="flex justify-center sm:hidden">
        <Hedera size={30} />
      </div>
      <svg className="hidden h-11 w-full sm:block" aria-hidden="true">
        <defs>
          <pattern id={`vine-${id}`} width="60" height="30" patternUnits="userSpaceOnUse" y="7">
            <path d="M0 15C10 5 20 5 30 15S50 25 60 15" fill="none" stroke="currentColor" strokeWidth="1.3" />
            {/* leaves on short stalks, alternating above and below the stem */}
            <path d="M15 7.6l2.4-2.4" stroke="currentColor" strokeWidth="1" />
            <path d={LEAF} transform="translate(17.4 5.4) rotate(40) scale(.82)" fill="currentColor" fillRule="evenodd" />
            <path d="M45 22.4l-2.4 2.4" stroke="currentColor" strokeWidth="1" />
            <path d={LEAF} transform="translate(42.6 24.6) rotate(220) scale(.82)" fill="currentColor" fillRule="evenodd" />
            {/* tendrils */}
            <path d="M24.5 9.6c1.4-3.2 4.6-3.8 5.6-1.8.6 1.2-.4 2.4-1.6 1.9" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
            <path d="M54.5 20.4c1.4 3.2 4.6 3.8 5.6 1.8.6-1.2-.4-2.4-1.6-1.9" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
            {/* berry clusters */}
            <g fill="currentColor">
              <circle cx="6.2" cy="20.8" r="1.25" />
              <circle cx="8.6" cy="22.6" r="1.25" />
              <circle cx="5.6" cy="23.6" r="1.25" />
              <circle cx="36.2" cy="9.2" r="1.25" />
              <circle cx="38.6" cy="7.4" r="1.25" />
              <circle cx="35.6" cy="6.4" r="1.25" />
            </g>
          </pattern>
        </defs>
        <line x1="0" x2="100%" y1="2" y2="2" stroke="currentColor" strokeWidth="2" />
        <line x1="0" x2="100%" y1="5" y2="5" stroke="currentColor" strokeWidth=".7" />
        <rect x="0" y="7" width="100%" height="30" fill={`url(#vine-${id})`} />
        <line x1="0" x2="100%" y1="39" y2="39" stroke="currentColor" strokeWidth=".7" />
        <line x1="0" x2="100%" y1="42" y2="42" stroke="currentColor" strokeWidth="2" />
        <svg x="50%" y="22" overflow="visible">
          <rect x="-40" y="-15.4" width="80" height="30.8" fill="var(--surface)" />
          <circle r="21" fill="var(--surface)" stroke="currentColor" strokeWidth="1.3" />
          <circle r="18" fill="none" stroke="currentColor" strokeWidth=".6" />
          <svg x="-15" y="-15" width="30" height="30" overflow="visible">
            <TudorRose size={30} variant="mono" />
          </svg>
          <g transform="translate(-38.5 -8)">
            <svg width="16" height="16" overflow="visible">
              <g transform="rotate(180 8 8)">
                <Hedera size={16} turned />
              </g>
            </svg>
          </g>
          <g transform="translate(22.5 -8)">
            <svg width="16" height="16" overflow="visible">
              <Hedera size={16} turned />
            </svg>
          </g>
        </svg>
      </svg>
    </div>
  );
}
