import { describe, expect, it } from "vitest";
import { catchwordOf, data, progress } from "~/data";
import { dayInfo, formatDate, parseDate, plannedHoursAtDay, TOTAL_DAYS, weekSpans } from "./dates";
import { arDaysAfter, arHours, arLines, arWords, basePath, langOf, localize, roman, textAttrs } from "./lang";

describe("roman numerals", () => {
  it.each([
    [1, "I"], [4, "IV"], [9, "IX"], [14, "XIV"], [40, "XL"], [41, "XLI"], [90, "XC"], [1999, "MCMXCIX"], [2026, "MMXXVI"],
  ])("%i → %s", (n, r) => expect(roman(n)).toBe(r));

  it("leaves numbers it cannot write as they are", () => {
    expect(roman(0)).toBe("0");
    expect(roman(4000)).toBe("4000");
    expect(roman(2.5)).toBe("2.5");
  });
});

describe("language paths", () => {
  it("knows Arabic pages by /ar", () => {
    expect(langOf("/ar")).toBe("ar");
    expect(langOf("/ar/map")).toBe("ar");
    expect(langOf("/archive")).toBe("en");
    expect(langOf("/map")).toBe("en");
  });

  it("moves a page between languages and back", () => {
    for (const p of ["/", "/map", "/modules/m4", "/sonnets/s18"]) {
      expect(basePath(localize(p, "ar"))).toBe(p);
      expect(localize(basePath(localize(p, "ar")), "en")).toBe(p);
    }
    expect(localize("/", "ar")).toBe("/ar");
  });

  it("counts hours in Arabic with the right noun form", () => {
    expect(arHours(1)).toBe("ساعة واحدة");
    expect(arHours(2)).toBe("ساعتان");
    expect(arHours(7)).toBe("7 ساعات");
    expect(arHours(24)).toBe("24 ساعة");
    expect(arHours(1.5)).toBe("1.5 ساعة");
    expect(arHours(100)).toBe("100 ساعة");
    expect(arHours(103)).toBe("103 ساعات");
  });

  it("tells English from Arabic content by its first letter", () => {
    expect(textAttrs("EXAMPLE — replace.")).toEqual({ lang: "en", dir: "ltr" });
    expect(textAttrs("“Thou art more lovely”")).toEqual({ lang: "en", dir: "ltr" });
    expect(textAttrs("2026: تأمّل في السوناتة")).toEqual({ lang: "ar", dir: "rtl" });
    expect(textAttrs("«أين» ليست wherefore")).toEqual({ lang: "ar", dir: "rtl" });
    expect(textAttrs(undefined)).toEqual({ lang: "en", dir: "ltr" });
  });

  it("uses the dual for two, the plural for 3–10, the singular from 11", () => {
    expect([1, 2, 3, 10, 11, 99].map(arWords)).toEqual(["كلمة واحدة", "كلمتان", "3 كلمات", "10 كلمات", "11 كلمة", "99 كلمة"]);
    expect([2, 5, 14].map(arDaysAfter)).toEqual(["يومين", "5 أيام", "14 يومًا"]);
    expect([2, 12, 14].map(arLines)).toEqual(["سطرين", "12 سطرًا", "14 سطرًا"]);
  });
});

describe("the calendar", () => {
  it("runs 41 days, 21 November to 31 December", () => {
    expect(TOTAL_DAYS).toBe(41);
    expect(plannedHoursAtDay(TOTAL_DAYS)).toBe(100);
    expect(plannedHoursAtDay(99)).toBe(100);
  });

  it("knows the day before, the first and last days, and after", () => {
    expect(dayInfo(parseDate("2026-11-20"))).toEqual({ phase: "before", daysUntil: 1, plannedHours: 0 });
    expect(dayInfo(parseDate("2026-11-21"))).toMatchObject({ phase: "during", day: 1, weekIndex: 1 });
    expect(dayInfo(new Date(2026, 11, 31, 23, 59))).toMatchObject({ phase: "during", day: 41 });
    expect(dayInfo(parseDate("2027-01-01"))).toEqual({ phase: "after", plannedHours: 100 });
  });

  it("splits the 100 hours into weeks with no gap or overlap", () => {
    const spans = weekSpans();
    expect(spans[0]!.from).toBe(0);
    expect(spans.at(-1)!.to).toBeCloseTo(100);
    spans.slice(1).forEach((s, i) => expect(s.from).toBeCloseTo(spans[i]!.to));
  });

  it("writes Arabic dates with Western digits", () => {
    expect(formatDate("2026-11-21", "ar")).toMatch(/^21 /);
    expect(formatDate("2026-11-21", "en")).toBe("21 November");
  });
});

describe("progress", () => {
  it("counts 100 hours and leaves example entries out of every count", () => {
    const p = progress();
    expect(p.totalHours).toBe(100);
    expect(p.completedHours + p.remainingHours).toBe(100);
    // Only real sessions and words count, however many examples are still in program.ts.
    const real = data.modules.flatMap((m) => m.sessions).filter((s) => !s.placeholder);
    expect(p.lessonsCompleted).toBe(real.length);
    expect(p.vocabularyAcquired).toBeLessThanOrEqual(real.flatMap((s) => s.newWords).filter((w) => !w.placeholder).length);
    expect(p.completedHours).toBe(data.modules.reduce((s, m) => s + m.hoursDone, 0));
    expect(p.sonnetsTotal).toBe(5);
  });

  it("takes the catchword from the first word of the next title", () => {
    expect(catchwordOf("Shakespeare’s world")).toBe("Shakespeare’s");
    expect(catchwordOf("Foundations: how to read")).toBe("Foundations");
    expect(catchwordOf("الأسس: كيف تقرأ")).toBe("الأسس");
  });
});
