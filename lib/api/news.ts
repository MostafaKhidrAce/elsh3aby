import {
  apiDelete,
  apiGet,
  apiGetPage,
  apiPostForm,
  type ApiQuery,
} from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import {
  extractImageUrls,
  formatDateTimeLabel,
  pickLocalized,
  resolveMedia,
} from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";

export type NewsCardView = {
  id: string;
  typeId: number | null;
  typeName: string;
  title: string;
  titleEn: string;
  dateLabel: string;
  dateLabelEn: string;
  author: string;
  authorEn: string;
  coverImage: string;
  images: string[];
  body: string;
  bodyEn: string;
  quote?: string;
  quoteEn?: string;
};

export type NewsCommentView = {
  id: string;
  author: string;
  authorEn: string;
  dateLabel: string;
  dateLabelEn: string;
  text: string;
  textEn: string;
};

type ApiNews = {
  id: number;
  title?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  body?: string | null;
  body_ar?: string | null;
  description?: string | null;
  description_ar?: string | null;
  content?: string | null;
  content_ar?: string | null;
  quote?: string | null;
  quote_ar?: string | null;
  created_at?: string | null;
  published_at?: string | null;
  type_id?: number | null;
  type?: { id?: number; name_ar?: string | null; name_en?: string | null } | null;
  image?: string | null;
  image_url?: string | null;
  cover?: string | null;
  gallery?: unknown;
  images?: unknown;
  member?: { name?: string | null } | null;
  author?: string | null;
};

type ApiNewsComment = {
  id: number;
  body?: string | null;
  created_at?: string | null;
  member?: { name?: string | null } | null;
  user?: { name?: string | null } | null;
};

const FALLBACK = "/placeholder/user-placeholder-img.svg";

export function toNewsCardView(item: ApiNews, locale: Locale): NewsCardView {
  const images = extractImageUrls(
    item.gallery ?? item.images ?? item.image_url ?? item.image ?? item.cover,
  ).map((url) => resolveMedia(url, FALLBACK));
  const titleAr = item.title_ar || item.title || "";
  const titleEn = item.title_en || item.title || titleAr;
  const bodyAr =
    item.body_ar || item.description_ar || item.content_ar || item.body || item.description || "";
  const bodyEn = item.body || item.description || item.content || bodyAr;
  const date = item.published_at || item.created_at;
  return {
    id: String(item.id),
    typeId: item.type_id ?? item.type?.id ?? null,
    typeName: pickLocalized(locale, item.type?.name_ar, item.type?.name_en),
    title: titleAr,
    titleEn,
    dateLabel: formatDateTimeLabel(date, "ar"),
    dateLabelEn: formatDateTimeLabel(date, "en"),
    author: item.member?.name || item.author || (locale === "ar" ? "إدارة الأسرة" : "Family admin"),
    authorEn: item.member?.name || item.author || "Family admin",
    coverImage: images[0] ?? FALLBACK,
    images: images.length ? images : [FALLBACK],
    body: bodyAr,
    bodyEn,
    quote: item.quote_ar || item.quote || undefined,
    quoteEn: item.quote || item.quote_ar || undefined,
  };
}

export async function getNews(locale: Locale, token: string, query?: ApiQuery) {
  const page = await apiGetPage<ApiNews[]>("/news", locale, token, {
    per_page: 15,
    ...query,
  });
  return {
    items: asList<ApiNews>(page.data).map((item) => toNewsCardView(item, locale)),
    meta: page.meta,
  };
}

export async function getNewsItem(id: string | number, locale: Locale, token: string) {
  const item = await apiGet<ApiNews>(`/news/${id}`, locale, token);
  return toNewsCardView(item, locale);
}

export async function getNewsComments(
  id: string | number,
  locale: Locale,
  token: string,
) {
  const data = await apiGet<ApiNewsComment[]>(`/news/${id}/comments`, locale, token);
  return asList<ApiNewsComment>(data).map((comment) => {
    const name = comment.member?.name || comment.user?.name || (locale === "ar" ? "عضو" : "Member");
    return {
      id: String(comment.id),
      author: name,
      authorEn: name,
      dateLabel: formatDateTimeLabel(comment.created_at, "ar"),
      dateLabelEn: formatDateTimeLabel(comment.created_at, "en"),
      text: comment.body || "",
      textEn: comment.body || "",
    } satisfies NewsCommentView;
  });
}

export async function addNewsComment(
  id: string | number,
  payload: { body: string; media?: File | null },
  locale: Locale,
  token: string,
) {
  const body = new FormData();
  body.append("body", payload.body);
  if (payload.media) body.append("media", payload.media);
  return apiPostForm(`/news/${id}/comments`, body, locale, token);
}

export async function deleteNewsComment(
  newsId: string | number,
  commentId: string | number,
  locale: Locale,
  token: string,
) {
  return apiDelete(`/news/${newsId}/comments/${commentId}`, locale, token);
}
