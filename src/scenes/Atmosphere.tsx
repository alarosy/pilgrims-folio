import { useEffect, useState } from "react";

/**
 * The Scottish Play's air: fog drifting low across the page and a candle's
 * light flickering from above. Tells the user "you are inside the play now".
 * Fog is three soft gradient banks moved with transforms (no filters, no
 * canvas); the candle is one glow whose opacity and scale waver. Both pause
 * when the tab is hidden; fog is skipped when the device asks to save data;
 * with reduced motion both are still.
 */
export function Atmosphere() {
  const [fog, setFog] = useState(false);
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setFog(!conn?.saveData);
    const d = document.documentElement;
    const onVis = () => d.toggleAttribute("data-hidden", document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      d.removeAttribute("data-hidden");
    };
  }, []);
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="candle-air" />
      {fog ? (
        <>
          <div className="fog fog-a" />
          <div className="fog fog-b" />
          <div className="fog fog-c" />
        </>
      ) : null}
    </div>
  );
}
