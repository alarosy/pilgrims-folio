import { useEffect, useState } from "react";
import { data } from "~/data";
import type { Week } from "~/data/types";
import { locale, type Lang } from "./lang";

const DAY = 864e5;

/** A YYYY-MM-DD string as a local date (no time-zone surprises). */
export const parseDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
};

const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const daysBetween = (a: Date, b: Date) => Math.round((midnight(b).getTime() - midnight(a).getTime()) / DAY);

export const START = parseDate(data.config.startDate);
export const END = parseDate(data.config.endDate);
export const TOTAL_DAYS = daysBetween(START, END) + 1; // 41

/** Hours an even pace would have covered by the end of a given day of the programme. */
export const plannedHoursAtDay = (day: number) => (100 * Math.max(0, Math.min(day, TOTAL_DAYS))) / TOTAL_DAYS;

/** The planned-hours span of each week (used to draw the week regions on the map). */
export function weekSpans() {
  return data.weeks.map((w, i) => {
    const from = plannedHoursAtDay(daysBetween(START, parseDate(w.start)));
    const to = plannedHoursAtDay(daysBetween(START, parseDate(w.end)) + 1);
    return { week: w, index: i + 1, from, to };
  });
}

export type DayInfo =
  | { phase: "before"; daysUntil: number; plannedHours: 0 }
  | { phase: "during"; day: number; week?: Week; weekIndex?: number; plannedHours: number }
  | { phase: "after"; plannedHours: 100 };

export function dayInfo(today: Date): DayInfo {
  const t = midnight(today);
  if (t < START) return { phase: "before", daysUntil: daysBetween(t, START), plannedHours: 0 };
  if (t > END) return { phase: "after", plannedHours: 100 };
  const day = daysBetween(START, t) + 1;
  const i = data.weeks.findIndex((w) => t >= parseDate(w.start) && t <= parseDate(w.end));
  return {
    phase: "during",
    day,
    week: data.weeks[i],
    weekIndex: i >= 0 ? i + 1 : undefined,
    plannedHours: plannedHoursAtDay(day),
  };
}

/**
 * Today's date, known only in the browser. Pages are prerendered at build
 * time, so anything that depends on "today" waits until after the first
 * render instead of baking in the build date.
 */
export function useToday(): Date | null {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  return today;
}

export function formatDate(s: string | Date, lang: Lang, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" }) {
  const d = typeof s === "string" ? parseDate(s) : s;
  return new Intl.DateTimeFormat(locale(lang), opts).format(d);
}

/** "21–27 Nov" style range for a week. */
export function formatRange(start: string, end: string, lang: Lang) {
  const f = (s: string) => formatDate(s, lang, { day: "numeric", month: "short" });
  return `${f(start)} – ${f(end)}`;
}
