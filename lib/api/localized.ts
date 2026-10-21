import type { Locale } from "@/lib/i18n/config";

export function pickLocalized(
  locale: Locale,
  ar?: string | null,
  en?: string | null,
  fallback = "",
): string {
  const preferred = locale === "en" ? en : ar;
  const alternate = locale === "en" ? ar : en;
  return (preferred || alternate || fallback).trim();
}

export function parseStatNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }
  if (typeof value !== "string") return 0;
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? Math.round(Number(match[1])) : 0;
}

export function toImageList(value: unknown): string[] {
  if (typeof value === "string" && value.trim()) return [value.trim()];
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0,
  );
}

export function firstImage(value: unknown, fallback: string): string {
  return toImageList(value)[0] ?? fallback;
}

export function splitParagraphs(text: string): string[] {
  const parts = text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text];
}

export function toApiPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("966")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function formatEventDate(value?: string | null): string {
  if (!value) return "";
  const dayFirst = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dayFirst) {
    const [, year, month, day] = dayFirst;
    return `${day}-${month}-${year}`;
  }
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

export function resolveCmsImage(url: string | null | undefined, fallback: string): string {
  if (!url?.trim()) return fallback;
  try {
    const host = new URL(url).hostname;
    if (host === "127.0.0.1" || host === "localhost") return fallback;
  } catch {
    return fallback;
  }
  return url;
}

const STORAGE_ORIGIN = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://family-box.aksapp.com/api/v1"
).replace(/\/api\/v1\/?$/, "");

export function extractImageUrls(value: unknown): string[] {
  if (typeof value === "string" && value.trim()) return [value.trim()];
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string" && item.trim()) return [item.trim()];
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const url = record.url ?? record.image_url ?? record.path ?? record.cover_image;
      return typeof url === "string" && url.trim() ? [url.trim()] : [];
    }
    return [];
  });
}

export function resolveMedia(
  url: string | null | undefined,
  fallback = "/placeholder/user-placeholder-img.svg",
): string {
  if (!url?.trim()) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return resolveCmsImage(url, fallback);
  }
  return resolveCmsImage(
    `${STORAGE_ORIGIN}/storage_link/${url.replace(/^\/+/, "")}`,
    fallback,
  );
}

export function formatDateTimeLabel(value?: string | null, locale: Locale = "ar"): string {
  if (!value) return "";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function mapRequestStatus(value?: string | null): "pending" | "approved" | "rejected" {
  const status = (value || "").toLowerCase();
  if (status.includes("reject") || status.includes("رفض")) return "rejected";
  if (
    status.includes("approv") ||
    status.includes("accept") ||
    status.includes("active") ||
    status.includes("confirm") ||
    status.includes("موافق") ||
    status.includes("مقبول")
  ) {
    return "approved";
  }
  return "pending";
}
