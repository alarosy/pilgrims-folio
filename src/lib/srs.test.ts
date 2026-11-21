import { describe, expect, it } from "vitest";
import type { Word } from "~/data/types";
import type { SrsCard } from "./storage";
import { addDays, allWords, daysFor, dueQueue, NEW_PER_DAY, schedule, wordKey, type LexEntry } from "./srs";

const TODAY = "2026-11-25";

describe("schedule: a word seen for the first time", () => {
  it("comes back tomorrow after “good” and in four days after “easy”", () => {
    expect(schedule(undefined, "good", TODAY)).toMatchObject({ due: "2026-11-26", interval: 1, reps: 1 });
    expect(schedule(undefined, "hard", TODAY)).toMatchObject({ interval: 1 });
    expect(schedule(undefined, "easy", TODAY)).toMatchObject({ due: "2026-11-29", interval: 4 });
  });

  it("stays in today’s session after “again”, and counts the lapse", () => {
    const c = schedule(undefined, "again", TODAY);
    expect(c).toMatchObject({ due: TODAY, interval: 0, reps: 0, lapses: 1 });
    expect(c.ease).toBeCloseTo(2.3);
  });
});

describe("schedule: later reviews", () => {
  const second: SrsCard = { due: TODAY, interval: 1, ease: 2.5, reps: 1, lapses: 0 };

  it("spaces the second review 2, 3 or 6 days", () => {
    expect(schedule(second, "hard", TODAY).interval).toBe(2);
    expect(schedule(second, "good", TODAY).interval).toBe(3);
    expect(schedule(second, "easy", TODAY).interval).toBe(6);
  });

  it("then grows by the card’s ease, always by at least a day", () => {
    const third: SrsCard = { due: TODAY, interval: 3, ease: 2.5, reps: 2, lapses: 0 };
    expect(schedule(third, "good", TODAY).interval).toBe(8); // 3 × 2.5, rounded
    expect(schedule(third, "hard", TODAY).interval).toBe(4); // 3 × 1.2 → 4, at least 3 + 1
    expect(schedule(third, "easy", TODAY).interval).toBe(10); // 3 × 2.5 × 1.3
  });

  it("never lets ease fall below 1.3", () => {
    let c: SrsCard | undefined;
    for (let i = 0; i < 20; i++) c = schedule(c, "hard", TODAY);
    expect(c!.ease).toBeCloseTo(1.3);
    for (let i = 0; i < 20; i++) c = schedule(c, "again", TODAY);
    expect(c!.ease).toBeCloseTo(1.3);
  });

  it("labels “again” as 0 days and the others by their interval", () => {
    expect(daysFor(second, "again", TODAY)).toBe(0);
    expect(daysFor(second, "good", TODAY)).toBe(3);
  });
});

describe("addDays", () => {
  it("crosses the end of a month and of the year", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-12-25", 10)).toBe("2027-01-04");
  });
});

describe("dueQueue", () => {
  const entry = (n: number): LexEntry => ({
    key: `w${n}`,
    word: { term: `w${n}`, meaning: "m" } as Word,
    module: "m0",
    date: TODAY,
    placeholder: false,
  });
  const words = Array.from({ length: 20 }, (_, i) => entry(i));
  const card = (due: string): SrsCard => ({ due, interval: 1, ease: 2.5, reps: 1, lapses: 0 });

  it(`offers at most ${NEW_PER_DAY} new words a day`, () => {
    expect(dueQueue(words, {}, TODAY)).toHaveLength(NEW_PER_DAY);
  });

  it("puts words that are due first, and leaves future ones out", () => {
    const srs = { w5: card("2026-11-24"), w6: card(TODAY), w7: card("2026-11-26") };
    const q = dueQueue(words, srs, TODAY).map((e) => e.key);
    expect(q.slice(0, 2)).toEqual(["w5", "w6"]);
    expect(q).not.toContain("w7");
    expect(q).toHaveLength(2 + NEW_PER_DAY);
  });

  it("does not depend on the date for a device that has reviewed nothing", () => {
    expect(dueQueue(words, {}, "")).toEqual(dueQueue(words, {}, TODAY));
  });
});

describe("the Lexicon’s word list", () => {
  it("keys a word by its id, or by term and source", () => {
    expect(wordKey({ id: "x1", term: "Thee" } as Word)).toBe("x1");
    expect(wordKey({ term: "Temperate", source: "Sonnet 18, line 2" } as Word)).toBe("temperate|sonnet 18, line 2");
  });

  it("is sorted and has no duplicates", () => {
    const list = allWords();
    const keys = list.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect([...list].sort((a, b) => a.word.term.localeCompare(b.word.term))).toEqual(list);
  });
});
