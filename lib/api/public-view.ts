import {
  isShortLine,
  samePersonName,
  swapOccasionTitle,
} from "@/lib/api/event-display";
import {
  extractImageUrls,
  pickLocalized,
  resolveCmsImage,
  resolveMedia,
} from "@/lib/api/localized";
import type { WebsiteEventItem, WebsiteNewsItem } from "@/lib/api/website";
import type { Locale } from "@/lib/i18n/config";

export type PublicNewsView = {
  id: number;
  title: string;
  body: string;
  imageUrl: string;
  date: string;
};

export type PublicEventView = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  booker: string;
};

type LooseRecord = {
  title?: string | null;
  body?: string | null;
  description?: string | null;
  full_name?: string | null;
  full_name_ar?: string | null;
  date_from?: string | null;
  location_title?: string | null;
  location_title_ar?: string | null;
  location_title_en?: string | null;
  location_address?: string | null;
  member?: { name?: string | null } | null;
  gallery?: unknown;
  gallery_items?: unknown;
  media_items?: unknown;
};

function newsImage(item: WebsiteNewsItem): string {
  return resolveCmsImage(item.image_url, "");
}

export function toPublicNewsView(
  item: WebsiteNewsItem,
  locale: Locale,
): PublicNewsView {
  const loose = item as WebsiteNewsItem & LooseRecord;
  return {
    id: item.id,
    title: pickLocalized(locale, item.title_ar, item.title_en, loose.title || ""),
    body: pickLocalized(
      locale,
      item.body_ar ?? item.description_ar,
      item.body_en ?? item.description_en,
      loose.body || loose.description || "",
    ),
    imageUrl: newsImage(item),
    date: (item.published_at || "").slice(0, 10),
  };
}

export function toPublicEventView(
  item: WebsiteEventItem,
  locale: Locale,
): PublicEventView {
  const loose = item as WebsiteEventItem & LooseRecord;
  const fullName = pickLocalized(locale, loose.full_name_ar, loose.full_name);
  const memberName = loose.member?.name?.trim() || "";
  const rawTitle = pickLocalized(locale, item.title_ar, item.title_en, fullName);
  const rawDescription = pickLocalized(
    locale,
    item.description_ar ?? item.body_ar,
    item.description_en ?? item.body_en,
    loose.description || "",
  );
  let title = rawTitle;
  let description = rawDescription;
  if (samePersonName(fullName, memberName) && isShortLine(rawDescription)) {
    title = rawDescription;
    description = "";
  } else if (!fullName) {
    const swapped = swapOccasionTitle(rawTitle, rawDescription);
    title = swapped.title;
    description = swapped.description;
  }
  const gallery = extractImageUrls(
    loose.gallery ?? loose.gallery_items ?? loose.media_items,
  );
  const imageUrl = resolveCmsImage(item.image_url || item.icon || gallery[0], "");
  const location =
    item.location?.trim() ||
    pickLocalized(
      locale,
      item.location_ar ?? loose.location_title_ar,
      item.location_en ?? loose.location_title_en,
      loose.location_title || loose.location_address || "",
    );
  return {
    id: item.id,
    title,
    description,
    imageUrl: imageUrl ? resolveMedia(imageUrl, "") : "",
    date: (item.date || item.start_date || item.event_date || loose.date_from || item.published_at || "").slice(0, 10),
    location,
    booker: memberName && memberName !== title ? memberName : "",
  };
}
