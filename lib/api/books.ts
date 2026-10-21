import { apiGet, apiGetPage, apiGetRaw, apiPost, type ApiQuery } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import {
  extractImageUrls,
  formatDateTimeLabel,
  pickLocalized,
  resolveMedia,
} from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";
import type { DummyAchievement } from "@/lib/dashboard/dummy-achievements";

export type BookCategory = {
  id: number;
  name_ar?: string | null;
  name_en?: string | null;
  active_books_count?: number;
};

type ApiBook = {
  id: number;
  title?: string | null;
  title_ar?: string | null;
  description?: string | null;
  description_ar?: string | null;
  author_name?: string | null;
  cover_image?: string | null;
  image_url?: string | null;
  gallery?: unknown;
  published_date?: string | null;
  created_at?: string | null;
  category_id?: number | null;
  category?: BookCategory | null;
  family_branch?: { name_ar?: string | null; name_en?: string | null } | null;
};

const FALLBACK = "/placeholder/user-placeholder-img.svg";

export function toAchievement(item: ApiBook, locale: Locale): DummyAchievement {
  const titleAr = item.title_ar || item.title || "";
  const titleEn = item.title || titleAr;
  const descriptionAr = item.description_ar || item.description || "";
  const descriptionEn = item.description || descriptionAr;
  const images = extractImageUrls(
    item.gallery ?? item.cover_image ?? item.image_url,
  ).map((url) => resolveMedia(url, FALLBACK));
  const badge = pickLocalized(locale, item.category?.name_ar, item.category?.name_en);
  const branch = pickLocalized(
    locale,
    item.family_branch?.name_ar,
    item.family_branch?.name_en,
  );
  return {
    id: String(item.id),
    category: "scientific",
    categoryId: item.category_id ?? item.category?.id ?? 0,
    badge,
    badgeEn: item.category?.name_en || badge,
    badgeTone: "gold",
    title: titleAr,
    titleEn,
    description: descriptionAr,
    descriptionEn,
    dateLabel: formatDateTimeLabel(item.published_date || item.created_at, "ar"),
    dateLabelEn: formatDateTimeLabel(item.published_date || item.created_at, "en"),
    author: item.author_name || "",
    authorEn: item.author_name || "",
    branch,
    branchEn: branch,
    images: images.length ? images : [FALLBACK],
  };
}

export async function getBookCategories(locale: Locale, token: string) {
  const json = await apiGetRaw<{ categories?: BookCategory[]; data?: BookCategory[] }>(
    "/books/categories",
    locale,
    token,
  );
  return asList<BookCategory>(json.categories ?? json.data ?? json);
}

export async function getBooks(locale: Locale, token: string, query?: ApiQuery) {
  const page = await apiGetPage<ApiBook[]>("/books", locale, token, {
    per_page: 15,
    ...query,
  });
  return {
    items: asList<ApiBook>(page.data).map((item) => toAchievement(item, locale)),
    meta: page.meta,
  };
}

export async function getBook(id: string | number, locale: Locale, token: string) {
  const item = await apiGet<ApiBook>(`/books/${id}`, locale, token);
  return toAchievement(item, locale);
}

export async function downloadBook(
  id: string | number,
  locale: Locale,
  token: string,
) {
  return apiPost(`/books/${id}/download`, {}, locale, token);
}
