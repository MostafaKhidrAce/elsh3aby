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
  pickLocalized,
  resolveMedia,
} from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";

export type ApiBranch = {
  id?: number | null;
  name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
};

export type ApiMemberRef = {
  id?: number | null;
  name?: string | null;
  phone?: string | null;
  image?: string | null;
  gender?: number | null;
};

export type ApiEvent = {
  id: number;
  full_name?: string | null;
  full_name_ar?: string | null;
  family_branch_id?: number | null;
  phone?: string | null;
  date_from?: string | null;
  date_from_hijri_formatted?: string | null;
  date_to?: string | null;
  time_from?: string | null;
  time_to?: string | null;
  is_past_event?: boolean;
  can_set_reminder?: boolean;
  is_reminder_set?: boolean;
  can_rate_event?: boolean;
  is_rated?: boolean;
  rating_average?: number | string | null;
  rating_count?: number | null;
  description?: string | null;
  description_ar?: string | null;
  location_title?: string | null;
  location_address?: string | null;
  lat?: number | null;
  lng?: number | null;
  gallery?: unknown;
  gallery_items?: unknown;
  media_items?: unknown;
  type_id?: number | null;
  type?: { id?: number; name_ar?: string | null; name_en?: string | null; icon?: string | null } | null;
  branch?: ApiBranch | null;
  member?: ApiMemberRef | null;
};

export type ApiEventComment = {
  id: number;
  body?: string | null;
  created_at?: string | null;
  member?: ApiMemberRef | null;
  user?: ApiMemberRef | null;
  media?: unknown;
  images?: unknown;
};

export type EventCardView = {
  id: number;
  typeId: number;
  typeName: string;
  typeIcon?: string | null;
  title: string;
  description: string;
  location: string;
  address: string;
  time: string;
  dateKey: string;
  hijriLabel: string;
  publisherName: string;
  publisherAvatar: string | null;
  branch?: string;
  images: string[];
  mapEmbedUrl?: string;
  ratingAverage: number;
  ratingCount: number;
  canRate: boolean;
  isRated: boolean;
  canRemind: boolean;
  isReminderSet: boolean;
};

export type EventCommentView = {
  id: string;
  author: string;
  dateLabel: string;
  text: string;
  images: string[];
  avatarUrl: string | null;
};

const FALLBACK_IMAGE = "/placeholder/user-placeholder-img.svg";

function formatTimeRange(from?: string | null, to?: string | null): string {
  const start = (from || "").slice(0, 5);
  const end = (to || "").slice(0, 5);
  if (start && end && start !== end) return `${start} – ${end}`;
  return start || end || "";
}

function galleryUrls(event: ApiEvent): string[] {
  const urls = extractImageUrls(
    event.gallery ?? event.gallery_items ?? event.media_items,
  );
  return urls.map((url) => resolveMedia(url, FALLBACK_IMAGE));
}

export function toEventCardView(event: ApiEvent, locale: Locale): EventCardView {
  const lat = event.lat;
  const lng = event.lng;
  const mapEmbedUrl =
    typeof lat === "number" && typeof lng === "number"
      ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
      : undefined;
  return {
    id: event.id,
    typeId: event.type_id ?? event.type?.id ?? 0,
    typeName: pickLocalized(locale, event.type?.name_ar, event.type?.name_en),
    typeIcon: event.type?.icon,
    title: pickLocalized(locale, event.full_name_ar, event.full_name),
    description: pickLocalized(locale, event.description_ar, event.description),
    location: event.location_title || event.location_address || "",
    address: event.location_address || event.location_title || "",
    time: formatTimeRange(event.time_from, event.time_to),
    dateKey: (event.date_from || "").slice(0, 10),
    hijriLabel: event.date_from_hijri_formatted || "",
    publisherName: event.member?.name || pickLocalized(locale, event.full_name_ar, event.full_name),
    publisherAvatar: event.member?.image
      ? resolveMedia(event.member.image, FALLBACK_IMAGE)
      : null,
    branch: pickLocalized(
      locale,
      event.branch?.name_ar,
      event.branch?.name_en,
      event.branch?.name || "",
    ),
    images: galleryUrls(event),
    mapEmbedUrl,
    ratingAverage: Number(event.rating_average ?? 0),
    ratingCount: Number(event.rating_count ?? 0),
    canRate: Boolean(event.can_rate_event),
    isRated: Boolean(event.is_rated),
    canRemind: Boolean(event.can_set_reminder),
    isReminderSet: Boolean(event.is_reminder_set),
  };
}

export function toEventCommentView(
  comment: ApiEventComment,
  locale: Locale,
): EventCommentView {
  const member = comment.member ?? comment.user;
  return {
    id: String(comment.id),
    author: member?.name || (locale === "ar" ? "عضو" : "Member"),
    dateLabel: comment.created_at ? comment.created_at.slice(0, 10) : "",
    text: comment.body || "",
    images: extractImageUrls(comment.images ?? comment.media).map((url) =>
      resolveMedia(url, FALLBACK_IMAGE),
    ),
    avatarUrl: member?.image ? resolveMedia(member.image, FALLBACK_IMAGE) : null,
  };
}

export async function getEvents(
  locale: Locale,
  token: string,
  query?: ApiQuery,
) {
  const page = await apiGetPage<ApiEvent[]>("/events", locale, token, {
    per_page: 50,
    ...query,
  });
  return asList<ApiEvent>(page.data).map((event) => toEventCardView(event, locale));
}

export async function getEvent(id: string | number, locale: Locale, token: string) {
  const event = await apiGet<ApiEvent>(`/events/${id}`, locale, token);
  return toEventCardView(event, locale);
}

export async function getEventComments(
  id: string | number,
  locale: Locale,
  token: string,
) {
  const data = await apiGet<ApiEventComment[]>(`/events/${id}/comments`, locale, token);
  return asList<ApiEventComment>(data).map((comment) =>
    toEventCommentView(comment, locale),
  );
}

export async function addEventComment(
  id: string | number,
  payload: { body: string; media?: File | null },
  locale: Locale,
  token: string,
) {
  const body = new FormData();
  body.append("body", payload.body);
  if (payload.media) body.append("media", payload.media);
  return apiPostForm(`/events/${id}/comments`, body, locale, token);
}

export async function rateEvent(
  id: string | number,
  rating: number,
  locale: Locale,
  token: string,
) {
  const body = new FormData();
  body.append("rating", String(rating));
  return apiPostForm(`/events/${id}/rating`, body, locale, token);
}

export async function toggleEventReminder(
  id: string | number,
  locale: Locale,
  token: string,
) {
  return apiPostForm(`/events/${id}/reminder/toggle`, new FormData(), locale, token);
}

export type CreateEventPayload = {
  full_name: string;
  full_name_ar: string;
  family_branch_id: number;
  phone: string;
  event_date_calendar: "gregorian" | "hijri";
  date_from: string;
  date_to: string;
  time_from: string;
  time_to: string;
  description: string;
  description_ar: string;
  location_title: string;
  location_address?: string;
  lat?: string;
  lng?: string;
  type_id: number;
  gallery?: File[];
};

export async function createEvent(
  payload: CreateEventPayload,
  locale: Locale,
  token: string,
) {
  const body = new FormData();
  body.append("full_name", payload.full_name);
  body.append("full_name_ar", payload.full_name_ar);
  body.append("family_branch_id", String(payload.family_branch_id));
  body.append("phone", payload.phone);
  body.append("event_date_calendar", payload.event_date_calendar);
  body.append("date_from", payload.date_from);
  body.append("date_to", payload.date_to);
  body.append("time_from", payload.time_from);
  body.append("time_to", payload.time_to);
  body.append("description", payload.description);
  body.append("description_ar", payload.description_ar);
  body.append("location_title", payload.location_title);
  if (payload.location_address) body.append("location_address", payload.location_address);
  if (payload.lat) body.append("lat", payload.lat);
  if (payload.lng) body.append("lng", payload.lng);
  body.append("type_id", String(payload.type_id));
  payload.gallery?.forEach((file, index) => {
    body.append(`gallery[${index}]`, file);
  });
  return apiPostForm("/events", body, locale, token);
}

export async function deleteEventComment(
  eventId: string | number,
  commentId: string | number,
  locale: Locale,
  token: string,
) {
  return apiDelete(`/events/${eventId}/comments/${commentId}`, locale, token);
}
