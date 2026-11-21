import { useEffect, useId, useRef, useState } from "react";
import { loadGsap, motionReduced } from "~/lib/motion";
import { Link } from "react-router";
import { CandleMark } from "~/components/ui/progress";
import { Icon } from "~/components/ornament/Icon";
import { StampedSeal } from "~/components/ornament/StampedSeal";
import { moduleLabel, moduleSpans, progress } from "~/data";
import { useT } from "~/i18n/strings";
import { dayInfo, formatRange, useToday, weekSpans } from "~/lib/dates";
import { roman, useHref, useLang } from "~/lib/lang";
import {
  MAP_H,
  MAP_W,
  MARGIN,
  pctX,
  pctY,
  ROAD_END,
  ROAD_TOP,
  roadAngle,
  roadPath,
  roadX,
  roadY,
} from "~/lib/road";

/**
 * The Pilgrim's Map: an aged scroll with the road of one hundred hours.
 * The picture is an SVG (hidden from screen readers); the stations are real
 * links in an ordered list, laid over the picture at their place on the road.
 * Phase 5 draws the road on scroll and sends the quill along it.
 */

const FULL_ROAD = roadPath(0, 100);

/* Small woodcut landmarks, set on the outer side of each bend. */
const LANDMARKS = [2, 9, 20, 29.5, 35, 50, 53.5, 64, 67.5, 79, 87, 94].map((h, i) => {
  const x = roadX(h);
  const outer = x > MAP_W / 2 ? Math.min(x + 46, MAP_W - MARGIN - 14) : Math.max(x - 46, MARGIN + 14);
  const kinds = ["tree", "hill", "trees", "tower"] as const;
  return { x: outer, y: roadY(h), kind: kinds[i % 4] ?? "tree" };
});

function Landmark({ x, y, kind }: { x: number; y: number; kind: "tree" | "hill" | "trees" | "tower" }) {
  const ink = "var(--text)";
  if (kind === "hill")
    return (
      <g transform={`translate(${x} ${y})`} fill="none" stroke={ink} strokeWidth="1.1" opacity=".55">
        <path d="M-22 8C-14-6-6-10 0-10S12-4 22 8" />
        <path d="M-8-6l-4 10M-2-9l-3 14M4-8l-2 13M10-4l-2 9" strokeWidth=".7" />
      </g>
    );
  if (kind === "tower")
    return (
      <g transform={`translate(${x} ${y})`} fill="none" stroke={ink} strokeWidth="1.1" opacity=".55">
        <path d="M-6 10V-10H6V10M-8 10H8M-6-10V-14H-3V-11H-1V-14H1V-11H3V-14H6V-10" />
        <path d="M-1.5 -4h3v5h-3Z" strokeWidth=".8" />
      </g>
    );
  const tree = (dx: number, s: number) => (
    <g transform={`translate(${dx} 0) scale(${s})`}>
      <path d="M0 10V2" />
      <path d="M0 2C-9 2-10-8-4-10C-3-15 4-15 5-10C11-8 9 2 0 2Z" />
      <path d="M-3-4l3 3 3-3" strokeWidth=".7" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={ink} strokeWidth="1.1" opacity=".55">
      {kind === "trees" ? (
        <>
          {tree(-8, 0.9)}
          {tree(7, 1.1)}
        </>
      ) : (
        tree(0, 1.2)
      )}
    </g>
  );
}

const quillAt = (h: number) =>
  `translate(${roadX(h).toFixed(1)} ${roadY(h).toFixed(1)}) rotate(${roadAngle(h).toFixed(1)})`;

function Quill({ h, ref }: { h: number; ref?: React.Ref<SVGGElement> }) {
  return (
    <g ref={ref} className="map-quill" transform={quillAt(h)}>
      <ellipse cx="-22" cy="7" rx="22" ry="3" fill="#000" opacity=".15" />
      <path d="M0 0L-9-2.8L-9 2.8Z" fill="var(--text)" />
      <path d="M-9 0H-50" stroke="var(--text)" strokeWidth="1.4" />
      <path d="M-13 0C-21-10-39-12-54-6C-41-3-27-1-13 0Z" fill="var(--ornament)" stroke="var(--text)" strokeWidth=".8" />
      <path d="M-13 0C-23 6-37 8-51 5C-39 2-25 1-13 0Z" fill="var(--ornament)" stroke="var(--text)" strokeWidth=".8" opacity=".85" />
    </g>
  );
}

function Compass({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="var(--text)" strokeWidth=".9" opacity=".75">
      <circle r="24" fill="none" />
      <circle r="20" fill="none" strokeWidth=".5" />
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M0-26L4.5 0L0 0Z" transform={`rotate(${a})`} fill="var(--text)" />
      ))}
      {[0, 90, 180, 270].map((a) => (
        <path key={`b${a}`} d="M0-26L-4.5 0L0 0Z" transform={`rotate(${a})`} fill="var(--surface-raised)" />
      ))}
      {[45, 135, 225, 315].map((a) => (
        <path key={a} d="M0-16L3 0L-3 0Z" transform={`rotate(${a})`} fill="var(--ornament)" />
      ))}
      <text y="-30" textAnchor="middle" fontFamily="var(--font-display)" fontSize="13" fill="var(--text)" stroke="none">
        N
      </text>
    </g>
  );
}

export function PilgrimMap() {
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const id = useId().replace(/:/g, "");
  const today = useToday();
  const p = progress();
  const spans = moduleSpans();
  const weeks = weekSpans();
  const info = today ? dayInfo(today) : null;
  const travelled = roadPath(0, p.completedHours);
  const stripX = lang === "ar" ? MAP_W - 18 : 18;
  const figRef = useRef<HTMLElement>(null);
  const rollRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<SVGGElement>(null);
  const [unroll, setUnroll] = useState(false);
  const done = p.completedHours;

  // The scroll unrolls as you read down: the lower roller moves down the page,
  // revealing the road, and the quill travels with it up to the hours done.
  // Transform-only; without JavaScript or with reduced motion the map is simply open.
  useEffect(() => {
    const fig = figRef.current;
    const roll = rollRef.current;
    if (!fig || !roll || motionReduced()) return;
    setUnroll(true);
    let undo: (() => void) | undefined;
    let cancelled = false;
    const openAll = () => {
      fig.classList.add("is-open");
      quillRef.current?.setAttribute("transform", quillAt(done));
    };
    fig.addEventListener("focusin", openAll);
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          roll,
          { yPercent: 0 },
          {
            yPercent: 100,
            ease: "none",
            scrollTrigger: {
              trigger: fig,
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.4,
              onUpdate: (self) => {
                const revealY = self.progress * MAP_H;
                const revealH = Math.max(0, Math.min(100, (revealY - ROAD_TOP) / 15));
                quillRef.current?.setAttribute("transform", quillAt(Math.min(done, revealH)));
              },
            },
          },
        );
      }, fig);
      undo = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      fig.removeEventListener("focusin", openAll);
      undo?.();
    };
  }, [done]);

  return (
    <figure
      ref={figRef}
      className={`pilgrim-map relative mx-auto w-full max-w-[30rem] ${unroll ? "is-unrolling" : ""}`}
      style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
    >
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
        style={{ direction: "ltr" }}
      >
        <defs>
          <linearGradient id={`roll-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--surface-raised)" />
            <stop offset=".45" stopColor="var(--surface)" />
            <stop offset="1" stopColor="var(--surface-raised)" />
          </linearGradient>
        </defs>

        {/* the scroll */}
        <rect x="6" y="18" width={MAP_W - 12} height={MAP_H - 36} fill="var(--surface-raised)" />
        <rect x="14" y="30" width={MAP_W - 28} height={MAP_H - 60} fill="none" stroke="var(--rule)" strokeWidth="1.2" />
        <rect x="18" y="34" width={MAP_W - 36} height={MAP_H - 68} fill="none" stroke="var(--rule)" strokeWidth=".5" />
        {[0, MAP_H - 30].map((y) => (
          <g key={y}>
            <rect x="0" y={y} width={MAP_W} height="30" rx="15" fill={`url(#roll-${id})`} stroke="var(--rule)" strokeWidth="1" />
            <ellipse cx="8" cy={y + 15} rx="5" ry="14" fill="var(--surface-raised)" stroke="var(--rule)" strokeWidth="1" />
            <ellipse cx={MAP_W - 8} cy={y + 15} rx="5" ry="14" fill="var(--surface-raised)" stroke="var(--rule)" strokeWidth="1" />
          </g>
        ))}

        {/* the six weeks as regions */}
        {weeks.map((w, i) => {
          const y0 = roadY(w.from);
          const y1 = roadY(w.to);
          return (
            <g key={w.week.id}>
              {i % 2 === 0 ? <rect x="19" y={y0} width={MAP_W - 38} height={y1 - y0} fill="var(--text)" opacity=".035" /> : null}
              {i > 0 ? (
                <path d={`M19 ${y0}H${MAP_W - 19}`} stroke="var(--rule)" strokeWidth=".7" strokeDasharray="2 4" />
              ) : null}
              <text
                transform={`translate(${stripX} ${(y0 + y1) / 2}) rotate(${lang === "ar" ? 90 : -90})`}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily={lang === "ar" ? "var(--font-arabic)" : "var(--font-body)"}
                fontSize="10.5"
                letterSpacing={lang === "ar" ? 0 : 1.6}
                fill="var(--text-muted)"
              >
                {lang === "ar"
                  ? `${t.weekN(w.index)} · ${formatRange(w.week.start, w.week.end, lang)}`
                  : `WEEK ${roman(w.index)} · ${formatRange(w.week.start, w.week.end, lang).toUpperCase()}`}
              </text>
            </g>
          );
        })}

        {/* title banner and compass */}
        <g transform="translate(176 104)">
          <path d="M-128-16H128L118 0L128 16H-128L-118 0Z" fill="var(--surface)" stroke="var(--rule)" strokeWidth="1" />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily={lang === "ar" ? "var(--font-arabic)" : "var(--font-display)"}
            fontSize={lang === "ar" ? 17 : 17}
            fontWeight={lang === "ar" ? 700 : 400}
            fontStyle={lang === "ar" ? "normal" : "italic"}
            fill="var(--text)"
          >
            {t.map.banner}
          </text>
        </g>
        <Compass x={MAP_W - 70} y={106} />

        {/* landmarks */}
        {LANDMARKS.map((l, i) => (
          <Landmark key={i} {...l} />
        ))}

        {/* the road: a worn bed, the planned way dotted, the travelled way in ink */}
        <path d={FULL_ROAD} fill="none" stroke="var(--surface)" strokeWidth="13" strokeLinecap="round" />
        <path d={FULL_ROAD} fill="none" stroke="var(--rule)" strokeWidth="1" strokeLinecap="round" opacity=".5" transform="translate(-6.5 0)" />
        <path d={FULL_ROAD} fill="none" stroke="var(--rule)" strokeWidth="1" strokeLinecap="round" opacity=".5" transform="translate(6.5 0)" />
        <path d={FULL_ROAD} fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
        {travelled ? (
          <path className="map-travelled" d={travelled} fill="none" stroke="var(--accent)" strokeWidth="3.2" strokeLinecap="round" />
        ) : null}

        {/* milestones where one station's stretch ends and the next begins */}
        {spans.slice(1).map(({ from, module }) => {
          const x = roadX(from);
          const y = roadY(from);
          return (
            <g key={module.id} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <path d="M-9 0H9" stroke="var(--text)" strokeWidth="2" />
              <circle r="2.4" fill="var(--text)" />
            </g>
          );
        })}

        {/* start and finish */}
        <g transform={`translate(${roadX(0).toFixed(1)} ${ROAD_TOP})`} stroke="var(--text)" fill="none" strokeWidth="1.3">
          <path d="M-14 6V-10A14 12 0 0 1 14-10V6" />
          <path d="M-18 6H18" />
        </g>
        <text
          x={roadX(0) - 24}
          y={ROAD_TOP - 6}
          textAnchor="end"
          fontFamily={lang === "ar" ? "var(--font-arabic)" : "var(--font-display)"}
          fontStyle={lang === "ar" ? "normal" : "italic"}
          fontSize="13"
          fill="var(--text-muted)"
        >
          {t.map.start}
        </text>
        <text
          x={roadX(100)}
          y={ROAD_END + 62}
          textAnchor="middle"
          fontFamily="var(--font-black)"
          fontSize="30"
          fill="var(--text)"
        >
          Finis
        </text>

        {/* where an even pace would be today */}
        {info?.phase === "during" ? (
          <g transform={`translate(${roadX(info.plannedHours).toFixed(1)} ${roadY(info.plannedHours).toFixed(1)})`}>
            {Array.from({ length: 8 }, (_, i) => (
              <path key={i} d="M0-9.5V-13" transform={`rotate(${i * 45})`} stroke="var(--c-candle)" strokeWidth="1.6" />
            ))}
            <circle r="6.5" fill="var(--c-candle)" stroke="var(--c-gilt-ink)" strokeWidth="1" />
          </g>
        ) : null}

      </svg>

      {/* The quill has its own small layer, so moving it repaints only the quill. */}
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <Quill h={p.completedHours} ref={quillRef} />
      </svg>

      {/* The stations: real links, placed at their place on the road. */}
      <ol aria-label={t.map.stations} className="absolute inset-0">
        {spans.map(({ module: m, mid }) => {
          const x = roadX(mid);
          const y = roadY(mid);
          const right = x < MAP_W / 2; // label on the right of the road
          const title = lang === "ar" ? (m.titleAr ?? m.title) : m.title;
          const status = m.status === "done" ? (lang === "ar" ? "مكتملة" : "Done") : m.status === "current" ? (lang === "ar" ? "الآن" : "Now") : lang === "ar" ? "مقفلة" : "Locked";
          return (
            <li key={m.id} className={`station station-${m.status}`}>
              <Link
                to={href(`/modules/${m.id}`)}
                tabIndex={-1}
                aria-hidden="true"
                className="station-marker"
                style={{ left: pctX(x), top: pctY(y) }}
              >
                {m.status === "done" ? (
                  <StampedSeal sealId={`module-${m.id}`} size={46} numeral={String(m.id.slice(1))} />
                ) : m.status === "current" ? (
                  <span className="station-disc">
                    <CandleMark size={34} />
                  </span>
                ) : (
                  <span className="station-disc station-disc-locked">
                    <Icon name="lock" size={18} />
                  </span>
                )}
              </Link>
              <Link
                to={href(`/modules/${m.id}`)}
                className="station-label"
                dir={lang === "ar" ? "rtl" : "ltr"}
                lang={lang}
                style={
                  right
                    ? { left: pctX(x + 30), width: pctX(MAP_W - MARGIN - x - 30), top: pctY(y), textAlign: "left" }
                    : { right: pctX(MAP_W - x + 30), width: pctX(x - 30 - MARGIN), top: pctY(y), textAlign: "right" }
                }
              >
                <span className="station-meta">
                  {moduleLabel(m.id)} · {lang === "ar" ? `${m.hoursDone}/${m.hours} س` : `${m.hoursDone}/${m.hours} h`}
                </span>
                <span className="station-title">{title}</span>
                <span className="station-status">{status}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      {/* The still-rolled part of the scroll, with its roller on top. */}
      <div ref={rollRef} className="map-unroll" aria-hidden="true">
        <div className="map-roller" />
      </div>
    </figure>
  );
}
