import { describe, expect, it } from "vitest";
import { program } from "./program";
import type { Program, Session } from "./types";
import { assertValid, check } from "./validate";

/*
 * These tests must keep passing as Ali fills program.ts in: they build their
 * own sessions and cards instead of relying on the examples being there.
 */

/** A fresh copy of the real program to break on purpose. */
const copy = (): Program => structuredClone(program);
const mod = (p: Program, id: string) => p.modules.find((m) => m.id === id)!;
const session = (over: Partial<Session> = {}): Session => ({
  id: "test-session",
  date: "2026-11-22",
  module: "m0",
  hours: 2,
  title: "A test session",
  summary: "Test.",
  newWords: [],
  ...over,
});

describe("program.ts as it stands", () => {
  it("passes every rule", () => {
    expect(check(program).errors).toEqual([]);
  });

  it("has nine modules, M0 to M8, adding up to exactly 100 hours", () => {
    expect(program.modules.map((m) => m.id)).toEqual(["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"]);
    expect(program.modules.map((m) => m.hours)).toEqual([10, 8, 14, 14, 24, 10, 8, 7, 5]);
    expect(program.modules.reduce((s, m) => s + m.hours, 0)).toBe(100);
  });

  it("notes example entries while any are left, and stays quiet once they are gone", () => {
    const p = copy();
    mod(p, "m0").sessions.push(session({ placeholder: true, id: "an-example" }));
    expect(check(p).warnings.join(" ")).toMatch(/example entries/);
    for (const m of p.modules) m.sessions = m.sessions.filter((s) => !s.placeholder);
    p.journal = p.journal.filter((j) => !j.placeholder);
    p.comparisons = p.comparisons.filter((c) => !c.placeholder);
    expect(check(p).warnings.join(" ")).not.toMatch(/example entries/);
  });
});

describe("the build stops on a wrong number", () => {
  it("catches a module with the wrong hours, and the wrong total", () => {
    const p = copy();
    mod(p, "m4").hours = 23;
    const { errors } = check(p);
    expect(errors).toContain("M4 should be 24 hours, but says 23.");
    expect(errors).toContain("The modules add up to 99 hours instead of 100.");
  });

  it("catches a missing module", () => {
    const p = copy();
    p.modules.pop();
    expect(check(p).errors[0]).toMatch(/9 modules/);
  });

  it("catches hoursDone outside 0…hours", () => {
    const p = copy();
    mod(p, "m0").hoursDone = 11;
    expect(check(p).errors.join(" ")).toMatch(/M0: hoursDone is 11, but it must be between 0 and 10/);
  });

  it('catches "done" with hours still to go', () => {
    const p = copy();
    Object.assign(mod(p, "m1"), { status: "done", hoursDone: 4 });
    expect(check(p).errors.join(" ")).toMatch(/M1 is marked "done" but only 4 of 8/);
  });

  it('catches hours logged on a "locked" module', () => {
    const p = copy();
    mod(p, "m2").hoursDone = 3;
    expect(check(p).errors.join(" ")).toMatch(/M2 is "locked" but already has 3 hours/);
  });

  it('allows only one "current" module', () => {
    const p = copy();
    mod(p, "m3").status = "current";
    expect(check(p).errors.join(" ")).toMatch(/2 modules are marked "current"/);
  });

  it("catches a badly written session date", () => {
    const p = copy();
    mod(p, "m0").sessions.push(session({ date: "21/11/2026" }));
    expect(check(p).errors.join(" ")).toMatch(/should look like 2026-11-21/);
  });

  it("only warns when session hours and hoursDone disagree", () => {
    const p = copy();
    Object.assign(mod(p, "m0"), { sessions: [session({ hours: 2 })], hoursDone: 3 });
    const { errors, warnings } = check(p);
    expect(errors).toEqual([]);
    expect(warnings.join(" ")).toMatch(/sessions add up to 2 hours, but hoursDone says 3/);
  });

  it("requires one of the four labels on every comparison", () => {
    const p = copy();
    p.comparisons.push({ id: "test-card", label: "probably-borrowed" as never, en: { title: "", body: "" }, ar: { title: "", body: "" }, sources: [] });
    expect(check(p).errors.join(" ")).toMatch(/needs one of the four labels/);
  });

  it("catches a snippet pasted twice", () => {
    const p = copy();
    mod(p, "m0").sessions.push(session({ id: "m0-2026-11-22" }), session({ id: "m0-2026-11-22" }));
    expect(check(p).errors.join(" ")).toMatch(/Session "m0-2026-11-22" appears twice/);
  });

  it("catches a thou/you entry that names someone not in the cast", () => {
    const p = copy();
    p.macbeth.thouYouLog.push({ ref: "1.5", speaker: "lady-macbth", addressee: "macbeth", form: "thou" });
    expect(check(p).errors.join(" ")).toMatch(/Thou\/you log, 1\.5: "lady-macbth" is not in the cast list/);
    p.macbeth.thouYouLog = [{ ref: "1.5", speaker: "lady-macbeth", addressee: "macbeth", form: "thou" }];
    expect(check(p).errors).toEqual([]);
  });

  it("knows the three scene statuses", () => {
    const p = copy();
    (p.macbeth.scenes[0] as { status: string }).status = "finished";
    expect(check(p).errors.join(" ")).toMatch(/Macbeth 1\.1: status should be/);
  });

  it("keeps memorized lines within the poem", () => {
    const p = copy();
    p.poems[0]!.memorizedLines = 15;
    expect(check(p).errors.join(" ")).toMatch(/memorizedLines is 15, but the text has 14 lines/);
  });
});

describe("meter marks", () => {
  const withMeter = () => {
    const p = copy();
    const poem = p.poems.find((x) => x.meter)!;
    return { p, poem };
  };

  it("are present and consistent for every poem that has them", () => {
    const poems = program.poems.filter((x) => x.meter);
    expect(poems.length).toBeGreaterThan(0);
    for (const poem of poems) expect(poem.meter!.length).toBe(poem.lines.length);
  });

  it("must spell the same words as the line", () => {
    const { p, poem } = withMeter();
    poem.meter![0]![0] = poem.meter![0]![0].replace(/\w/, "Q");
    expect(check(p).errors.join(" ")).toMatch(/line 1: the meter's words don't match the text/);
  });

  it("need one stress mark per syllable", () => {
    const { p, poem } = withMeter();
    poem.meter![0]![1] = poem.meter![0]![1].slice(1);
    expect(check(p).errors.join(" ")).toMatch(/line 1: \d+ syllables but \d+ stress marks/);
  });

  it("allow only x and /", () => {
    const { p, poem } = withMeter();
    const [split, stress] = poem.meter![0]!;
    poem.meter![0] = [split, stress.replace("/", "-")];
    expect(check(p).errors.join(" ")).toMatch(/stress marks/);
  });
});

describe("assertValid", () => {
  it("returns the program when it is valid", () => {
    expect(assertValid(program)).toBe(program);
  });

  it("throws a plain-English list when it is not", () => {
    const p = copy();
    mod(p, "m8").hours = 6;
    expect(() => assertValid(p)).toThrow(/program\.ts needs fixing[\s\S]*M8 should be 5 hours/);
  });
});
