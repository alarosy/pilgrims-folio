import { useSyncExternalStore } from "react";
import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

/**
 * True when motion should be reduced: either the system asks for it, or the
 * site's own setting does (<html data-motion="reduced">). `data-motion="full"`
 * lets someone opt back in on a system that reduces motion.
 */
export function motionReduced(): boolean {
  const attr = document.documentElement.dataset.motion;
  if (attr === "reduced") return true;
  if (attr === "full") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => {
    mq.removeEventListener("change", cb);
    mo.disconnect();
  };
}

export function useReducedMotion(): boolean {
  // Prerendered HTML assumes reduced motion, so nothing moves before the client knows.
  return useSyncExternalStore(subscribe, motionReduced, () => true);
}

/* ---------- Smooth scrolling (desktop) ---------- */

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/* ---------- GSAP, loaded only by the pages that tell a story on scroll ---------- */

type Gsap = { gsap: typeof GSAP; ScrollTrigger: typeof ST };
let gsapReady: Promise<Gsap> | null = null;

export function loadGsap(): Promise<Gsap> {
  gsapReady ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
    g.gsap.registerPlugin(s.ScrollTrigger);
    // Keep ScrollTrigger in step with Lenis when smooth scrolling is on.
    window.__lenis?.on("scroll", s.ScrollTrigger.update);
    return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
  });
  return gsapReady;
}

/* ---------- Motion (Framer Motion) features, loaded on demand ---------- */

export const motionFeatures = () => import("./motion-features").then((m) => m.default);

/* ---------- Small helpers ---------- */

/** Run once per visit (sessionStorage), e.g. the hourglass filling. */
export function oncePerVisit(key: string): boolean {
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, "1");
  } catch {
    /* storage blocked: play it */
  }
  return true;
}
