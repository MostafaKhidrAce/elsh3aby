import type { Locale } from "@/lib/i18n/config";
import type { WebsiteMenuLink } from "@/lib/api/website";

const PATH_MAP: Record<string, string> = {
  "/contact": "/home/contact-us",
  "/about": "/home/about",
  "/news": "/home/news",
  "/events": "/home/events",
  "/store": "/dashboard/market",
  "/bookings": "/dashboard/booking",
};

const LABEL_MAP: Record<string, string> = {
  "family news": "/home/news",
  events: "/home/events",
  "qaisariya market": "/dashboard/market",
  "family venue booking": "/dashboard/booking",
  "أخبار العائلة": "/home/news",
  "الفعاليات والمناسبات": "/home/events",
  "سوق القيصرية": "/dashboard/market",
  "حجز دار مناسبات العائلة": "/dashboard/booking",
};

function withLocale(locale: Locale, path: string): string {
  if (path.startsWith("#")) return `/${locale}/home${path}`;
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function websiteContactHref(locale: Locale, url?: string | null): string {
  if (!url) return `/${locale}/home/contact-us`;
  if (url.startsWith("http")) return url;
  const mapped = PATH_MAP[url] ?? url;
  return withLocale(locale, mapped);
}

export function websiteMenuHref(
  locale: Locale,
  link: WebsiteMenuLink,
): string {
  const labelEn = link.label_en?.trim().toLowerCase() ?? "";
  const labelAr = link.label_ar?.trim() ?? "";
  const fromLabel = LABEL_MAP[labelEn] ?? LABEL_MAP[labelAr];
  if (fromLabel) return withLocale(locale, fromLabel);

  if (link.url) {
    if (link.url.startsWith("http")) return link.url;
    const mapped = PATH_MAP[link.url] ?? link.url;
    return withLocale(locale, mapped);
  }

  return `/${locale}/home`;
}

export function websiteSignupHref(locale: Locale): string {
  return `/${locale}/signup`;
}

export function websiteAboutHref(locale: Locale): string {
  return `/${locale}/home/about`;
}
