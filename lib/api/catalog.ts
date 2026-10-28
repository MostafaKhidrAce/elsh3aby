import { apiGet, apiGetRaw, type ApiQuery } from "@/lib/api/client";
import type { Locale } from "@/lib/i18n/config";

export type NamedType = {
  id: number;
  name_ar?: string | null;
  name_en?: string | null;
  name?: string | null;
  icon?: string | null;
};

export function asList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of [
      "data",
      "items",
      "event_types",
      "booking_types",
      "categories",
      "family_branches",
      "excellence_types",
      "help_types",
      "consultant_types",
      "publish_types",
      "discount_types",
      "news_types",
      "members",
      "winners",
      "election_candidates",
    ]) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}

export async function getNamedTypes(
  path: string,
  locale?: Locale,
  token?: string | null,
  listKey?: string,
): Promise<NamedType[]> {
  const json = await apiGetRaw<Record<string, unknown>>(path, locale, token);
  if (listKey && Array.isArray(json[listKey])) {
    return json[listKey] as NamedType[];
  }
  return asList<NamedType>(json.data ?? json);
}

export async function getEventTypes(locale?: Locale, token?: string | null) {
  return getNamedTypes("/event-types", locale, token, "event_types");
}

export async function getExcellenceTypes(locale?: Locale, token?: string | null) {
  return getNamedTypes("/excellence-types", locale, token);
}

export async function getHelpTypes(locale?: Locale, token?: string | null) {
  return getNamedTypes("/help-types", locale, token);
}

export async function getConsultantTypes(locale?: Locale, token?: string | null) {
  return getNamedTypes("/consultant-types", locale, token);
}

export async function getPublishTypes(locale?: Locale, token?: string | null) {
  return getNamedTypes("/publish-types", locale, token);
}

export async function getBookingTypes(locale?: Locale, token?: string | null) {
  return getNamedTypes("/booking-types", locale, token, "booking_types");
}

export async function getDiscountTypes(locale?: Locale, token?: string | null) {
  return getNamedTypes("/discount-types", locale, token);
}

export type ListQuery = ApiQuery;
