import type { Locale } from "@/lib/i18n/config";
import { toDateKey } from "@/lib/dashboard/dummy-events";

export type HijriParts = {
  year: number;
  month: number;
  day: number;
};

function localeTag(locale: Locale) {
  const lang = locale === "en" ? "en-SA" : "ar-SA";
  return `${lang}-u-ca-islamic-umalqura-nu-latn`;
}

function atNoon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
}

function partNumber(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  const raw = parts.find((part) => part.type === type)?.value ?? "";
  return Number(raw.replace(/[^\d]/g, ""));
}

export function toHijriParts(date: Date): HijriParts {
  const parts = new Intl.DateTimeFormat("en-SA-u-ca-islamic-umalqura-nu-latn", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(atNoon(date));
  return {
    year: partNumber(parts, "year"),
    month: partNumber(parts, "month"),
    day: partNumber(parts, "day"),
  };
}

export function hijriDay(date: Date): number {
  return toHijriParts(date).day;
}

export function formatHijriLabel(date: Date, locale: Locale): string {
  const formatted = new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(atNoon(date));
  const cleaned = formatted.replace(/\s*هـ\.?/g, "").trim();
  return locale === "ar" ? `${cleaned} هـ` : `${cleaned} AH`;
}

export function formatHijriMonthYear(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    month: "long",
    year: "numeric",
  })
    .format(atNoon(date))
    .replace(/\s*هـ\.?/g, "")
    .trim();
}

export function startOfHijriMonth(date: Date): Date {
  const target = toHijriParts(date);
  let cursor = atNoon(date);
  for (let i = 0; i < 32; i += 1) {
    const prev = new Date(cursor);
    prev.setDate(prev.getDate() - 1);
    const parts = toHijriParts(prev);
    if (parts.month !== target.month || parts.year !== target.year) return cursor;
    cursor = prev;
  }
  return cursor;
}

export function shiftHijriMonth(date: Date, delta: number): Date {
  const start = startOfHijriMonth(date);
  if (delta === 0) return start;
  const probe = new Date(start);
  probe.setDate(probe.getDate() + (delta > 0 ? 33 : -1));
  return startOfHijriMonth(probe);
}

export function buildHijriMonthCells(viewDate: Date): (Date | null)[] {
  const start = startOfHijriMonth(viewDate);
  const target = toHijriParts(start);
  const offset = (start.getDay() + 1) % 7;
  const cells: (Date | null)[] = Array.from({ length: offset }, () => null);
  const cursor = new Date(start);
  for (let i = 0; i < 32; i += 1) {
    const parts = toHijriParts(cursor);
    if (parts.month !== target.month || parts.year !== target.year) break;
    cells.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function hijriMonthRange(viewDate: Date): { from: string; to: string } {
  const days = buildHijriMonthCells(viewDate).filter((item): item is Date => Boolean(item));
  return {
    from: toDateKey(days[0] ?? viewDate),
    to: toDateKey(days[days.length - 1] ?? viewDate),
  };
}
