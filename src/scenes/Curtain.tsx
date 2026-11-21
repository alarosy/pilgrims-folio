import { useEffect, useState } from "react";
import { useT } from "~/i18n/strings";

/**
 * The theatre curtain on the Prologue, once per visit.
 *
 * It is plain HTML/CSS in the prerendered page, so it paints before any
 * JavaScript and doubles as the loading screen; its playbill title is the
 * first large text on screen. CSS opens it on a timer even without
 * JavaScript; a tap or any key opens it at once. When it has risen, it leaves
 * the page entirely, and the visit remembers it (sessionStorage), so going
 * back to the Prologue later does not replay it.
 *
 * It is decorative and hidden from screen readers: the page behind it is
 * already readable, and any key opens it.
 */
const SEEN = "pf:curtain";

export function Curtain() {
  const t = useT();
  const [state, setState] = useState<"closed" | "opening" | "gone">("closed");

  // Remember the curtain only once it has actually risen (not on mount), so a
  // repeated effect run (React's development checks) cannot skip it.
  const finish = () => {
    setState("gone");
    document.documentElement.dataset.curtain = "seen";
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      /* storage blocked: it plays again next time */
    }
  };

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {
      /* storage blocked: the curtain simply plays */
    }
    if (seen || document.documentElement.dataset.curtain === "seen") {
      setState("gone");
      return;
    }
    const open = () => setState((s) => (s === "closed" ? "opening" : s));
    window.addEventListener("keydown", open, { once: true });
    const done = window.setTimeout(finish, 2700);
    return () => {
      window.removeEventListener("keydown", open);
      window.clearTimeout(done);
    };
  }, []);

  useEffect(() => {
    if (state !== "opening") return;
    const id = window.setTimeout(finish, 1250);
    return () => window.clearTimeout(id);
  }, [state]);

  if (state === "gone") return null;

  return (
    <div
      className={`curtain ${state === "opening" ? "is-open" : ""}`}
      aria-hidden="true"
      onClick={() => setState("opening")}
    >
      <div className="curtain-panel curtain-left" />
      <div className="curtain-panel curtain-right" />
      <div className="curtain-valance" />
      <div className="curtain-bill">
        <p className="curtain-bill-title">{t.siteTitle}</p>
        <p className="curtain-bill-sub">{t.prologue.curtainSub}</p>
        <div className="curtain-bill-rule" />
        <p className="curtain-bill-dates">{t.prologue.curtainDates}</p>
        <p className="curtain-bill-hint">{t.prologue.curtainHint}</p>
      </div>
    </div>
  );
}
