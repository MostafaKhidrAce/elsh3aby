import { apiGet, apiGetPage, apiGetRaw, apiPost, type ApiQuery } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import {
  extractImageUrls,
  formatDateTimeLabel,
  pairLocalized,
  pairNamed,
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
  title_en?: string | null;
  description?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  author_name?: string | null;
  author_name_ar?: string | null;
  author_name_en?: string | null;
  author_image?: string | null;
  cover_image?: string | null;
  cover_image_url?: string | null;
  image_url?: string | null;
  gallery?: unknown;
  book_file_url?: string | null;
  published_date?: string | null;
  created_at?: string | null;
  category_id?: number | null;
  category?: BookCategory | null;
  family_branch?: { name_ar?: string | null; name_en?: string | null } | null;
};

const FALLBACK = "/placeholder/user-placeholder-img.svg";

export function toAchievement(item: ApiBook, _locale: Locale): DummyAchievement {
  const title = pairLocalized(item.title_ar, item.title_en || item.title);
  const description = pairLocalized(item.description_ar, item.description_en || item.description);
  const author = pairLocalized(
    item.author_name_ar,
    item.author_name_en || item.author_name,
  );
  const cover = item.cover_image_url || item.cover_image || item.image_url;
  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  const images = extractImageUrls([cover, ...gallery].filter(Boolean)).map((url) =>
    resolveMedia(url, FALLBACK),
  );
  const badge = pairNamed(item.category);
  const branch = pairNamed(item.family_branch);
  return {
    id: String(item.id),
    category: "scientific",
    categoryId: item.category_id ?? item.category?.id ?? 0,
    badge: badge.ar,
    badgeEn: badge.en,
    badgeTone: "gold",
    title: title.ar,
    titleEn: title.en,
    description: description.ar,
    descriptionEn: description.en,
    dateLabel: formatDateTimeLabel(item.published_date || item.created_at, "ar"),
    dateLabelEn: formatDateTimeLabel(item.published_date || item.created_at, "en"),
    author: author.ar,
    authorEn: author.en,
    authorImage: item.author_image ? resolveMedia(item.author_image, FALLBACK) : FALLBACK,
    branch: branch.ar,
    branchEn: branch.en,
    images: images.length ? images : [FALLBACK],
    fileUrl: item.book_file_url || null,
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
