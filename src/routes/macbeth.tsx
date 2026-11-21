import { useEffect, useMemo, useState } from "react";
import { InkWrite } from "~/components/ui/InkWrite";
import { Atmosphere } from "~/scenes/Atmosphere";
import type { Route } from "./+types/macbeth";
import { Icon } from "~/components/ornament/Icon";
import { RunningHead, SpecimenStamp } from "~/components/ui/print";
import { Tabs } from "~/components/ui/Tabs";
import { data } from "~/data";
import type { Theme } from "~/data/types";
import { ROOMS, useRoomT } from "~/i18n/rooms";
import { STRINGS, useT } from "~/i18n/strings";
import { langOf, textAttrs, useLang } from "~/lib/lang";

export const meta: Route.MetaFunction = ({ location }) => {
  const lang = langOf(location.pathname);
  return [{ title: `${ROOMS[lang].macbeth.title} · ${STRINGS[lang].siteTitle}` }];
};

type Tab = "scenes" | "characters" | "threads" | "thouyou";
const M = data.macbeth;

export default function ScottishPlay() {
  const t = useT();
  const r = useRoomT().macbeth;
  const [tab, setTab] = useState<Tab>("scenes");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("tab");
    if (q === "characters" || q === "threads" || q === "thouyou") setTab(q);
  }, []);
  const choose = (v: Tab) => {
    setTab(v);
    const u = new URL(window.location.href);
    if (v === "scenes") u.searchParams.delete("tab");
    else u.searchParams.set("tab", v);
    window.history.replaceState(window.history.state, "", u);
  };

  return (
    <div className="macbeth-room mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
      <Atmosphere />
      <RunningHead left={r.title} right={t.siteTitle} />
      <header className="mt-10 max-w-3xl">
        <Icon name="dagger" size={40} className="text-ornament-ink" />
        <InkWrite as="h1" text={r.title} className="mt-4" />
        <p className="mt-4 text-lead text-ink-muted">{r.intro}</p>
      </header>
      <div className="mt-10">
        <Tabs
          label={r.title}
          value={tab}
          onChange={choose}
          tabs={[
            { value: "scenes", label: r.tabs.scenes },
            { value: "characters", label: r.tabs.characters },
            { value: "threads", label: r.tabs.threads },
            { value: "thouyou", label: r.tabs.thouyou },
          ]}
        >
          {tab === "scenes" ? <Scenes /> : tab === "characters" ? <CharacterWeb /> : tab === "threads" ? <Threads /> : <ThouYou />}
        </Tabs>
      </div>
    </div>
  );
}

/* ------------------------------ Acts & scenes ------------------------------ */

function Scenes() {
  const r = useRoomT().macbeth;
  const acts = [1, 2, 3, 4, 5];
  const studied = M.scenes.filter((s) => s.status === "studied").length;
  return (
    <div>
      <p className="nums font-heading text-h4">{r.studiedOf(studied, M.scenes.length)}</p>
      <p className="mt-1 text-caption text-ink-muted">{r.sceneNotes}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {acts.map((a) => (
          <section key={a} aria-labelledby={`act-${a}`} className="card p-4">
            <h2 id={`act-${a}`} className="font-heading text-h4">
              {r.act(a)}
            </h2>
            <ol className="mt-3 space-y-2">
              {M.scenes
                .filter((s) => s.act === a)
                .map((s) => (
                  <li key={`${s.act}.${s.scene}`} className={`scene scene-${s.status}`}>
                    <span className="nums scene-ref" lang="en">
                      {r.scene(s.act, s.scene)}
                    </span>
                    <span className="min-w-0">
                      <span className="block leading-snug" lang="en">
                        {s.note}
                      </span>
                      <span className="scene-status">
                        {s.status === "studied" ? <Icon name="check" size={14} /> : null}
                        {r.status[s.status]}
                      </span>
                    </span>
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Character web ------------------------------ */

/* Hand-placed so families sit together; anyone added later joins a ring at the edge. */
const POS: Record<string, [number, number]> = {
  witches: [130, 70],
  hecate: [50, 150],
  macbeth: [320, 180],
  "lady-macbeth": [320, 300],
  duncan: [510, 60],
  donalbain: [600, 140],
  malcolm: [520, 210],
  banquo: [130, 250],
  fleance: [70, 335],
  macduff: [480, 325],
  "lady-macduff": [585, 400],
  "macduff-son": [430, 420],
  siward: [610, 270],
  "young-siward": [600, 345],
  ross: [230, 410],
  lennox: [110, 420],
};
const W = 660;
const H = 460;

const kindOf = (k: string) =>
  /murder|kill/.test(k) ? "violence" : /married|father|son/.test(k) ? "family" : "other";

function CharacterWeb() {
  const r = useRoomT().macbeth;
  const lang = useLang();
  const [sel, setSel] = useState<string | null>(null);
  const pos = useMemo(() => {
    const out = { ...POS };
    const extra = M.characters.filter((c) => !out[c.id]);
    extra.forEach((c, i) => {
      const a = (i / Math.max(1, extra.length)) * Math.PI * 2;
      out[c.id] = [W / 2 + Math.cos(a) * 290, H / 2 + Math.sin(a) * 200];
    });
    return out;
  }, []);
  const name = (id: string) => M.characters.find((c) => c.id === id)?.name ?? id;
  const ties = M.relations.filter((x) => !sel || x.from === sel || x.to === sel);

  return (
    <div>
      <p className="text-ink-muted">{r.webHelp}</p>
      <div className="web relative mx-auto mt-6 w-full max-w-3xl" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true" style={{ direction: "ltr" }}>
          {M.relations.map((x, i) => {
            const a = pos[x.from];
            const b = pos[x.to];
            if (!a || !b) return null;
            const k = kindOf(x.kind);
            const on = !sel || x.from === sel || x.to === sel;
            const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.12;
            const my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.12;
            return (
              <path
                key={i}
                d={`M${a[0]} ${a[1]}Q${mx} ${my} ${b[0]} ${b[1]}`}
                fill="none"
                stroke={k === "violence" ? "var(--danger)" : k === "family" ? "var(--text)" : "var(--ornament)"}
                strokeWidth={on && sel ? 2.4 : 1.4}
                strokeDasharray={k === "violence" ? "6 4" : k === "other" ? "1.5 4" : undefined}
                strokeLinecap="round"
                opacity={on ? 0.9 : 0.12}
              />
            );
          })}
        </svg>
        {M.characters.map((c) => {
          const p = pos[c.id];
          if (!p) return null;
          const active = sel === c.id;
          const linked = sel ? M.relations.some((x) => (x.from === sel && x.to === c.id) || (x.to === sel && x.from === c.id)) : true;
          return (
            <button
              key={c.id}
              type="button"
              className={`web-node ${active ? "is-active" : ""} ${linked || active ? "" : "is-dim"}`}
              style={{ left: `${(p[0] / W) * 100}%`, top: `${(p[1] / H) * 100}%` }}
              aria-pressed={active}
              onClick={() => setSel(active ? null : c.id)}
              lang="en"
            >
              <span className="web-dot" aria-hidden="true" />
              <span className="web-name">{c.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-caption text-ink-muted" aria-hidden="true">
        <span className="flex items-center gap-2">
          <svg width="28" height="6"><path d="M0 3H28" stroke="var(--text)" strokeWidth="1.6" /></svg>
          {lang === "ar" ? "قرابة" : "family"}
        </span>
        <span className="flex items-center gap-2">
          <svg width="28" height="6"><path d="M0 3H28" stroke="var(--danger)" strokeWidth="1.6" strokeDasharray="6 4" /></svg>
          {lang === "ar" ? "عنف" : "violence"}
        </span>
        <span className="flex items-center gap-2">
          <svg width="28" height="6"><path d="M0 3H28" stroke="var(--ornament)" strokeWidth="1.6" strokeDasharray="1.5 4" strokeLinecap="round" /></svg>
          {lang === "ar" ? "روابط أخرى" : "other ties"}
        </span>
      </div>

      <section aria-live="polite" className="mt-8">
        <h2 className="text-h4">{sel ? r.tiesOf(name(sel)) : r.allTies}</h2>
        <ul className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2" lang="en" dir="ltr">
          {ties.map((x, i) => (
            <li key={i} className="border-b border-hairline py-1.5">
              <strong className="font-semibold">{name(x.from)}</strong> {x.kind} <strong className="font-semibold">{name(x.to)}</strong>
              {x.act ? <span className="text-caption text-ink-muted"> · Act {x.act}</span> : null}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-caption text-ink-muted" lang="en" dir="ltr">
          Cast as listed in the Folger edition’s “Characters in the Play”.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------ Threads ------------------------------ */

const THEME_COLOR: Record<Theme, string> = {
  blood: "var(--danger)",
  sleep: "var(--text-muted)",
  darkness: "var(--text)",
  fate: "var(--ornament-text)",
};
const SCENES_IN_ACT = [7, 4, 6, 3, 8];

/** Where a reference like "2.2" falls along the five acts, from 0 to 1. */
function position(ref: string) {
  const [a, s] = ref.split(".").map(Number) as [number, number];
  const n = SCENES_IN_ACT[a - 1] ?? 1;
  return (a - 1 + (Math.max(1, Math.min(s || 1, n)) - 0.5) / n) / 5;
}

function Threads() {
  const r = useRoomT().macbeth;
  const lang = useLang();
  return (
    <div>
      <p className="measure text-ink-muted">{r.threadsIntro}</p>
      <div className="mt-8 hidden grid-cols-5 text-center sm:grid" dir="ltr">
        {[1, 2, 3, 4, 5].map((a) => (
          <span key={a} className="label text-ink-muted">
            {r.act(a)}
          </span>
        ))}
      </div>
      <div className="mt-2 space-y-10">
        {M.threads.map((th) => (
          <section key={th.theme} aria-labelledby={`th-${th.theme}`}>
            <h2 id={`th-${th.theme}`} className="text-h4" style={{ color: THEME_COLOR[th.theme] }}>
              {r.themes[th.theme]}
            </h2>
            <svg viewBox="0 0 500 24" className="mt-2 block h-6 w-full" preserveAspectRatio="none" aria-hidden="true" style={{ direction: "ltr" }}>
              {[100, 200, 300, 400].map((x) => (
                <path key={x} d={`M${x} 2V22`} stroke="var(--hairline)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              ))}
              <path d="M0 12C60 6 120 18 180 12S300 6 360 12S460 18 500 12" fill="none" stroke={THEME_COLOR[th.theme]} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="relative h-0" aria-hidden="true">
              {th.refs.map((x, i) => (
                <span
                  key={i}
                  className="thread-knot"
                  style={{ left: `${position(x.ref) * 100}%`, background: THEME_COLOR[th.theme] }}
                />
              ))}
            </div>
            {th.refs.length ? (
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {th.refs.map((x, i) => (
                  <li key={i} className="card p-4" lang="en" dir="ltr">
                    <div className="flex items-start justify-between gap-3">
                      <span className="label nums text-ornament-ink">{x.ref}</span>
                      {x.placeholder ? <SpecimenStamp lang={lang} /> : null}
                    </div>
                    <p className="mt-2 font-heading italic leading-snug">“{x.quote}”</p>
                    {x.note ? <p className="mt-2 text-caption text-ink-muted">{x.note}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 italic text-ink-muted">{r.noRefs}</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Thou & you ------------------------------ */

function ThouYou() {
  const r = useRoomT().macbeth;
  const lang = useLang();
  const name = (id: string) => M.characters.find((c) => c.id === id)?.name ?? id;
  const log = M.thouYouLog;
  const pairs = useMemo(() => {
    const m = new Map<string, { thou: number; you: number }>();
    for (const e of log) {
      const k = `${name(e.speaker)} → ${name(e.addressee)}`;
      const v = m.get(k) ?? { thou: 0, you: 0 };
      v[e.form]++;
      m.set(k, v);
    }
    return [...m.entries()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log]);

  return (
    <div>
      <p className="measure text-ink-muted">{r.thouIntro}</p>
      {log.length === 0 ? (
        <div className="card mt-8 p-6">
          <p className="italic text-ink-muted">{r.thouEmpty}</p>
        </div>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-start" lang="en" dir="ltr">
              <thead>
                <tr className="border-b border-rule">
                  {(["ref", "speaker", "addressee", "form", "note"] as const).map((c) => (
                    <th key={c} scope="col" className="label py-2 pe-4 text-start font-medium text-ink-muted" lang={lang}>
                      {r.cols[c]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {log.map((e, i) => (
                  <tr key={i} className="border-b border-hairline align-top">
                    <td className="nums py-2 pe-4">{e.ref}</td>
                    <td className="py-2 pe-4">{name(e.speaker)}</td>
                    <td className="py-2 pe-4">{name(e.addressee)}</td>
                    <td className={`py-2 pe-4 font-heading italic ${e.form === "thou" ? "text-danger" : "text-accent"}`}>{e.form}</td>
                    <td className="py-2 text-caption">
                      {e.quote ? (
                        <span className="block italic" lang="en">
                          “{e.quote}”
                        </span>
                      ) : null}
                      {e.note ? <span {...textAttrs(e.note)}>{e.note}</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="mt-10 text-h4">{r.pairs}</h2>
          <ul className="mt-3 space-y-2" lang="en" dir="ltr">
            {pairs.map(([k, v]) => (
              <li key={k} className="flex flex-wrap items-center gap-3">
                <span className="min-w-[14rem]">{k}</span>
                <span className="nums text-caption">
                  thou {v.thou} · you {v.you}
                </span>
                <span className="flex h-2 w-40 overflow-hidden rounded-full bg-hairline" aria-hidden="true">
                  <span style={{ width: `${(v.thou / (v.thou + v.you)) * 100}%`, background: "var(--danger)" }} />
                  <span style={{ width: `${(v.you / (v.thou + v.you)) * 100}%`, background: "var(--accent)" }} />
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
