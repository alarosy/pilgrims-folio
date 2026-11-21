import { describe, expect, it } from "vitest";
import { checkImport, DEFAULT_SAVED, exportText, normalize } from "./storage";

const card = { due: "2026-11-26", interval: 1, ease: 2.5, reps: 1, lapses: 0 };
const run = { date: "2026-11-25", known: 10, total: 14 };

describe("normalize: what the site accepts as its saved record", () => {
  it("rejects anything that is not a version-1 record", () => {
    for (const x of [null, 3, "text", [], {}, { version: 2 }]) expect(normalize(x)).toBeNull();
  });

  it("fills what is missing with defaults", () => {
    expect(normalize({ version: 1 })).toEqual({ ...DEFAULT_SAVED, settings: { ...DEFAULT_SAVED.settings, lang: undefined } });
  });

  it("keeps only settings it recognises", () => {
    const s = normalize({ version: 1, settings: { candlelight: "yes", motion: "fast", inkTrail: true, lang: "fr", extra: 1 } })!;
    expect(s.settings).toEqual({ candlelight: false, motion: "system", inkTrail: true, lang: undefined });
  });

  it("keeps seals that are strings", () => {
    expect(normalize({ version: 1, seenSeals: ["module-m0", 4, null, "work-1"] })!.seenSeals).toEqual(["module-m0", "work-1"]);
  });

  it("keeps good review cards and drops damaged ones", () => {
    const srs = {
      good: card,
      noDue: { ...card, due: undefined },
      badDate: { ...card, due: "next week" },
      textEase: { ...card, ease: "2.5" },
      notACard: "hello",
      list: [1, 2],
    };
    expect(normalize({ version: 1, srs })!.srs).toEqual({ good: card });
  });

  it("keeps good recite runs and drops damaged ones", () => {
    const recite = {
      s18: [run, { date: "yesterday", known: 1, total: 2 }, { ...run, known: "10" }, null],
      s29: "not a list",
      s73: { 0: run },
    };
    expect(normalize({ version: 1, recite })!.recite).toEqual({ s18: [run] });
  });
});

describe("checkImport", () => {
  const file = (data: unknown, extra = {}) => JSON.stringify({ app: "pilgrims-folio", exportedAt: "2026-11-25T10:00:00.000Z", data, ...extra });

  it("accepts the site’s own export", () => {
    const c = checkImport(exportText());
    expect(c.ok).toBe(true);
  });

  it("counts the words and recite runs it will restore", () => {
    const c = checkImport(file({ version: 1, srs: { a: card, b: card }, recite: { s18: [run, run], s29: [run] } }));
    expect(c).toMatchObject({ ok: true, words: 2, runs: 3, exportedAt: "2026-11-25T10:00:00.000Z" });
  });

  it("refuses a file that is not JSON, not ours, or a different version", () => {
    expect(checkImport("not json {")).toEqual({ ok: false });
    expect(checkImport(JSON.stringify({ app: "something-else", data: { version: 1 } }))).toEqual({ ok: false });
    expect(checkImport(file({ version: 2 }))).toEqual({ ok: false });
    expect(checkImport(JSON.stringify([1, 2]))).toEqual({ ok: false });
  });

  it("ignores an export date it cannot read (it is only shown, never needed)", () => {
    const c = checkImport(file({ version: 1 }, { exportedAt: "last Tuesday" }));
    expect(c).toMatchObject({ ok: true, exportedAt: undefined });
  });

  it("restores a damaged backup without its damaged parts", () => {
    const c = checkImport(file({ version: 1, srs: { a: card, b: "broken" } }));
    expect(c).toMatchObject({ ok: true, words: 1 });
  });
});
