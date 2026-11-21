import { LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { motionFeatures } from "~/lib/motion";

/**
 * The stamping itself (loaded only when a seal is about to be stamped).
 * The seal drops from above: scale 1.6 → 0.94 impact → 1.03 → 1, with a
 * small wobble; a soft shadow settles under it; a ring of wax spreads once.
 */
export default function SealStampMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <LazyMotion features={motionFeatures} strict>
      <span className={`stamped-seal relative inline-block ${className}`}>
        <m.span
          className="seal-pool"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 1.4 }}
          animate={{ opacity: 0.45, scale: 1 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        />
        <m.span
          className="relative inline-block"
          initial={{ scale: 1.6, opacity: 0, rotate: -9, y: -18 }}
          animate={{ scale: [1.6, 0.94, 1.03, 1], opacity: [0, 1, 1, 1], rotate: [-9, 2, -1, 0], y: [-18, 0, 0, 0] }}
          transition={{ duration: 0.5, times: [0, 0.45, 0.72, 1], ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </m.span>
        <m.span
          className="seal-ring"
          aria-hidden="true"
          initial={{ opacity: 0.55, scale: 0.75 }}
          animate={{ opacity: 0, scale: 1.65 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        />
      </span>
    </LazyMotion>
  );
}
