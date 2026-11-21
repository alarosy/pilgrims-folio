import { lazy, Suspense, useEffect, useState } from "react";
import { motionReduced } from "~/lib/motion";
import { readSaved, updateSaved } from "~/lib/storage";
import { WaxSeal } from "./WaxSeal";

/* Motion is fetched only when a seal is actually stamped. */
const SealStampMotion = lazy(() => import("./SealStampMotion"));

/**
 * A wax seal that is stamped the first time it is seen.
 * Tells the user: "this is newly complete". Which seals have been seen is
 * remembered on the device, so it plays once; after that (and with reduced
 * motion) the seal simply sits there. `replay` (style guide) plays it every
 * time the number changes.
 */
export function StampedSeal({
  sealId,
  size = 96,
  numeral,
  label,
  replay,
  className = "",
}: {
  sealId: string;
  size?: number;
  numeral?: string;
  label?: string;
  replay?: number;
  className?: string;
}) {
  const [play, setPlay] = useState(0);

  useEffect(() => {
    if (replay !== undefined) {
      if (replay > 0 && !motionReduced()) setPlay((n) => n + 1);
      return;
    }
    // readSaved, not useSaved: while hydrating, the hook would report no seals seen.
    if (readSaved().seenSeals.includes(sealId)) return;
    if (!motionReduced()) setPlay((n) => n + 1);
    updateSaved((s) => (s.seenSeals.includes(sealId) ? s : { ...s, seenSeals: [...s.seenSeals, sealId] }));
  }, [replay, sealId]);

  const seal = <WaxSeal size={size} numeral={numeral} label={label} />;
  if (!play) return <span className={`inline-block ${className}`}>{seal}</span>;
  return (
    <Suspense fallback={<span className={`invisible inline-block ${className}`}>{seal}</span>}>
      <SealStampMotion key={play} className={className}>
        {seal}
      </SealStampMotion>
    </Suspense>
  );
}
