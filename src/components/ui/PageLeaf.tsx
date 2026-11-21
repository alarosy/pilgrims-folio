import { AnimatePresence, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { motionFeatures } from "~/lib/motion";

/**
 * The page turn. Tells the reader "you have turned a page, and which way".
 * A blank leaf lifts from the forward side and swings over the spine
 * (rotateY, transform-only), its shading deepening mid-turn, while the new
 * page is already waiting underneath. Mirrored in Arabic, where books open
 * the other way. With reduced motion there is no leaf; the page just fades.
 */
export default function PageLeaf({
  turn,
  wide,
  rtl,
  onDone,
}: {
  turn: { key: number; dir: 1 | -1 } | null;
  wide: boolean;
  rtl: boolean;
  onDone: () => void;
}) {
  // Which side the leaf starts on, in screen terms.
  const forward = turn?.dir === 1;
  const startsRight = forward !== rtl;
  // Desktop: the leaf is one page of the spread and turns about the spine (the centre).
  // Phone: the leaf is the whole page and turns about its binding edge.
  const style: React.CSSProperties = wide
    ? { left: startsRight ? "50%" : 0, width: "50%", transformOrigin: startsRight ? "0% 50%" : "100% 50%" }
    : { left: 0, width: "100%", transformOrigin: rtl ? "100% 50%" : "0% 50%" };
  const to = wide ? (startsRight ? -180 : 180) : rtl ? (forward ? 120 : -120) : forward ? -120 : 120;
  return (
    <LazyMotion features={motionFeatures} strict>
      <AnimatePresence>
        {turn ? (
          <m.div
            key={turn.key}
            className="page-leaf"
            style={style}
            aria-hidden="true"
            initial={{ rotateY: 0, opacity: 1 }}
            animate={{ rotateY: to, opacity: [1, 1, 0.9, 0] }}
            transition={{ duration: 0.62, ease: [0.65, 0, 0.35, 1], opacity: { duration: 0.62, times: [0, 0.6, 0.85, 1] } }}
            onAnimationComplete={onDone}
          >
            <m.span
              className="page-leaf-shade"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.45, 0.1] }}
              transition={{ duration: 0.62, times: [0, 0.5, 1] }}
            />
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}

