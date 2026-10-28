import {
  apiGet,
  apiGetPage,
  apiPost,
  apiPostForm,
  type ApiQuery,
} from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import {
  formatDateTimeLabel,
  mapRequestStatus,
  pairLocalized,
  pairNamed,
  pickLocalized,
  resolveMedia,
} from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";
import type {
  DummyRequest,
  RequestAttachment,
  RequestStatus,
} from "@/lib/dashboard/dummy-requests";
import type { DummyNewsPublishRequest } from "@/lib/dashboard/dummy-news-publish";
import type { DummyOffer } from "@/lib/dashboard/dummy-offers";
import type { DummyVenueBooking } from "@/lib/dashboard/dummy-venue-bookings";

type Named = { id?: number; name_ar?: string | null; name_en?: string | null; name?: string | null };

function typeName(locale: Locale, type?: Named | null): string {
  return pickLocalized(locale, type?.name_ar, type?.name_en, type?.name || "");
}

function typePair(type?: Named | null, fallback = "") {
  return pairNamed(type, fallback);
}

function attachmentsFrom(value: unknown): RequestAttachment[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string" && value.trim()) {
      return [
        {
          id: "att-1",
          name: "مرفق",
          nameEn: "Attachment",
          kind: value.match(/\.(png|jpe?g|webp|gif)$/i) ? "image" : "pdf",
        },
      ];
    }
    return [];
  }
  return value.map((item, index) => {
    if (typeof item === "string") {
      return {
        id: String(index),
        name: item.split("/").pop() || "مرفق",
        nameEn: item.split("/").pop() || "Attachment",
        kind: item.match(/\.(png|jpe?g|webp|gif)$/i) ? "image" : "pdf",
      };
    }
    const record = (item ?? {}) as Record<string, unknown>;
    const name = String(record.name ?? record.file_name ?? record.title ?? "مرفق");
    const url = String(record.url ?? record.path ?? "");
    return {
      id: String(record.id ?? index),
      name,
      nameEn: name,
      kind: url.match(/\.(png|jpe?g|webp|gif)$/i) ? "image" : "pdf",
    };
  });
}

type ApiHelpOrder = {
  id: number;
  request_title?: string | null;
  title?: string | null;
  request_description?: string | null;
  description?: string | null;
  full_name?: string | null;
  national_id?: string | null;
  mobile_number?: string | null;
  status?: string | null;
  created_at?: string | null;
  type?: Named | null;
  help_type?: Named | null;
  type_id?: number | null;
  attachment?: unknown;
  attachments?: unknown;
};

type ApiConsultation = {
  id: number;
  title?: string | null;
  consultation_text?: string | null;
  status?: string | null;
  created_at?: string | null;
  consultant_type?: Named | null;
  consultant_type_id?: number | null;
  replies?: ApiConsultReply[];
};

type ApiConsultReply = {
  id: number;
  reply_text?: string | null;
  created_at?: string | null;
  member?: { name?: string | null } | null;
};

type ApiPublishRequest = {
  id: number;
  advertiser_name?: string | null;
  description?: string | null;
  region_city?: string | null;
  event_date?: string | null;
  event_time?: string | null;
  status?: string | null;
  request_type_id?: number | null;
  request_type?: Named | null;
  type?: Named | null;
};

type ApiDiscountOffer = {
  id: number;
  offer_title?: string | null;
  title?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  description?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  store_activity_name?: string | null;
  region_city?: string | null;
  region_city_ar?: string | null;
  region_city_en?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  coupon_code?: string | null;
  created_at?: string | null;
  attachment?: string | null;
  image_url?: string | null;
};

type ApiPlaceBooking = {
  id: number;
  full_name?: string | null;
  additional_notes?: string | null;
  description?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  time_from?: string | null;
  time_to?: string | null;
  status?: string | null;
  booking_type?: Named | null;
  family_branch?: Named | null;
  branch?: Named | null;
  member?: { name?: string | null; image?: string | null } | null;
  attachment?: string | null;
  image?: string | null;
};

export function toHelpRequest(item: ApiHelpOrder, locale: Locale): DummyRequest {
  const title = item.request_title || item.title || "";
  const description = item.request_description || item.description || "";
  const type = typePair(item.type ?? item.help_type);
  return {
    id: String(item.id),
    category: "help",
    status: mapRequestStatus(item.status),
    title,
    titleEn: title,
    dateLabel: formatDateTimeLabel(item.created_at, "ar"),
    dateLabelEn: formatDateTimeLabel(item.created_at, "en"),
    description,
    descriptionEn: description,
    typeLabel: type.ar || typeName(locale, item.type ?? item.help_type),
    typeLabelEn: type.en || type.ar,
    requestCode: String(item.id),
    nationalId: item.national_id || "",
    attachments: attachmentsFrom(item.attachments ?? item.attachment),
  };
}

export function toConsultRequest(item: ApiConsultation, locale: Locale): DummyRequest {
  const type = typePair(item.consultant_type);
  return {
    id: String(item.id),
    category: "consult",
    status: mapRequestStatus(item.status),
    title: item.title || "",
    titleEn: item.title || "",
    dateLabel: formatDateTimeLabel(item.created_at, "ar"),
    dateLabelEn: formatDateTimeLabel(item.created_at, "en"),
    description: item.consultation_text || "",
    descriptionEn: item.consultation_text || "",
    consultType: type.ar || typeName(locale, item.consultant_type),
    consultTypeEn: type.en || type.ar,
    replies: (item.replies ?? []).map((reply) => ({
      id: String(reply.id),
      author: reply.member?.name || (locale === "ar" ? "مستشار" : "Consultant"),
      authorEn: reply.member?.name || "Consultant",
      dateLabel: formatDateTimeLabel(reply.created_at, "ar"),
      dateLabelEn: formatDateTimeLabel(reply.created_at, "en"),
      text: reply.reply_text || "",
      textEn: reply.reply_text || "",
    })),
  };
}

export function toPublishRequest(item: ApiPublishRequest): DummyNewsPublishRequest {
  const typeId = item.request_type_id ?? item.request_type?.id ?? item.type?.id ?? 0;
  const status = mapRequestStatus(item.status);
  const type = typePair(item.request_type ?? item.type);
  return {
    id: String(item.id),
    type: typeId === 2 ? "meetings" : "wedding",
    typeId,
    typeName: type.ar,
    typeNameEn: type.en,
    status: status === "approved" ? "accepted" : status === "rejected" ? "rejected" : "review",
    title: item.advertiser_name || "",
    titleEn: item.advertiser_name || "",
    description: item.description || "",
    descriptionEn: item.description || "",
    location: item.region_city || "",
    locationEn: item.region_city || "",
    time: item.event_time || "",
    timeEn: item.event_time || "",
  };
}

export function toOfferCard(item: ApiDiscountOffer): DummyOffer {
  const title = pairLocalized(item.title_ar || item.offer_title, item.title_en || item.title);
  const description = pairLocalized(item.description_ar, item.description_en || item.description);
  const location = pairLocalized(
    item.region_city_ar || item.region_city || item.store_activity_name,
    item.region_city_en || item.region_city || item.store_activity_name,
  );
  const image = resolveMedia(item.image_url || item.attachment, "");
  return {
    id: String(item.id),
    title: title.ar,
    titleEn: title.en,
    description: description.ar,
    descriptionEn: description.en,
    dateLabel: formatDateTimeLabel(item.created_at, "ar"),
    dateLabelEn: formatDateTimeLabel(item.created_at, "en"),
    validityLabel: [item.start_date, item.end_date].filter(Boolean).join(" - "),
    validityLabelEn: [item.start_date, item.end_date].filter(Boolean).join(" - "),
    location: location.ar,
    locationEn: location.en,
    image: image || "/placeholder/user-placeholder-img.svg",
    couponCode: item.coupon_code || "",
  };
}

export function toVenueBooking(item: ApiPlaceBooking, locale: Locale): DummyVenueBooking {
  const title = typePair(item.booking_type, item.additional_notes || "");
  const bookedBy = item.full_name || item.member?.name || "";
  const branch = typePair(item.family_branch ?? item.branch);
  const time = [item.time_from, item.time_to].filter(Boolean).join(" – ");
  const status = mapRequestStatus(item.status);
  const titleAr = title.ar || typeName(locale, item.booking_type) || item.additional_notes || "";
  const titleEn = title.en || titleAr;
  return {
    id: String(item.id),
    title: titleAr,
    titleEn,
    description: item.additional_notes || item.description || "",
    descriptionEn: item.additional_notes || item.description || "",
    dateLabel: formatDateTimeLabel(item.date_from, "ar"),
    dateLabelEn: formatDateTimeLabel(item.date_from, "en"),
    time,
    timeEn: time,
    image: resolveMedia(item.image || item.attachment, "/placeholder/user-placeholder-img.svg"),
    hallLabel: titleAr,
    hallLabelEn: titleEn,
    bookedBy,
    bookedByEn: bookedBy,
    branch: branch.ar,
    branchEn: branch.en,
    status: status === "rejected" ? "pending" : status,
    canCancel: status === "pending",
    dateKey: (item.date_from || "").slice(0, 10),
  };
}

export async function getHelpOrders(locale: Locale, token: string, query?: ApiQuery) {
  const page = await apiGetPage<ApiHelpOrder[]>("/help-orders", locale, token, {
    my_orders_only: true,
    per_page: 50,
    ...query,
  });
  return asList<ApiHelpOrder>(page.data).map((item) => toHelpRequest(item, locale));
}

export async function getHelpOrder(id: string | number, locale: Locale, token: string) {
  try {
    const item = await apiGet<ApiHelpOrder>(`/help-orders/${id}`, locale, token);
    return toHelpRequest(item, locale);
  } catch {
    const items = await getHelpOrders(locale, token);
    const found = items.find((item) => item.id === String(id));
    if (!found) throw new Error("Help order not found");
    return found;
  }
}

export async function createHelpOrder(
  payload: {
    type_id?: number;
    full_name: string;
    national_id: string;
    geographical_location?: string;
    request_title: string;
    mobile_number: string;
    request_description: string;
    attachment?: File | null;
  },
  locale: Locale,
  token: string,
) {
  const body = new FormData();
  if (payload.type_id) body.append("type_id", String(payload.type_id));
  body.append("full_name", payload.full_name);
  body.append("national_id", payload.national_id);
  if (payload.geographical_location) {
    body.append("geographical_location", payload.geographical_location);
  }
  body.append("request_title", payload.request_title);
  body.append("mobile_number", payload.mobile_number);
  body.append("request_description", payload.request_description);
  if (payload.attachment) body.append("attachment", payload.attachment);
  return apiPostForm("/help-orders", body, locale, token);
}

export async function getConsultations(locale: Locale, token: string, query?: ApiQuery) {
  const page = await apiGetPage<ApiConsultation[]>("/consultations", locale, token, {
    my_requests_only: true,
    per_page: 50,
    ...query,
  });
  return asList<ApiConsultation>(page.data).map((item) => toConsultRequest(item, locale));
}

export async function getConsultation(id: string | number, locale: Locale, token: string) {
  const item = await apiGet<ApiConsultation>(`/consultations/${id}`, locale, token);
  let replies = item.replies ?? [];
  try {
    const extra = await apiGet<ApiConsultReply[]>(
      `/consultations/${id}/replies`,
      locale,
      token,
    );
    replies = asList<ApiConsultReply>(extra);
  } catch {
    // Detail payload may already include replies.
  }
  return toConsultRequest({ ...item, replies }, locale);
}

export async function createConsultation(
  payload: { consultant_type_id: number; title: string; consultation_text: string },
  locale: Locale,
  token: string,
) {
  return apiPost("/consultations", payload, locale, token);
}

export async function replyToConsultation(
  id: string | number,
  reply_text: string,
  locale: Locale,
  token: string,
) {
  return apiPost(`/consultations/${id}/reply`, { reply_text }, locale, token);
}

export async function getPublishRequests(locale: Locale, token: string, query?: ApiQuery) {
  const page = await apiGetPage<ApiPublishRequest[]>(
    "/publish-requests",
    locale,
    token,
    { my_requests_only: true, per_page: 50, ...query },
  );
  return asList<ApiPublishRequest>(page.data).map(toPublishRequest);
}

export async function createPublishRequest(
  payload: {
    advertiser_name: string;
    request_type_id: number;
    region_city: string;
    event_date: string;
    event_time: string;
    description: string;
    attachment?: File | null;
  },
  locale: Locale,
  token: string,
) {
  const body = new FormData();
  body.append("advertiser_name", payload.advertiser_name);
  body.append("request_type_id", String(payload.request_type_id));
  body.append("region_city", payload.region_city);
  body.append("event_date", payload.event_date);
  body.append("event_time", payload.event_time);
  body.append("description", payload.description);
  if (payload.attachment) body.append("attachment", payload.attachment);
  return apiPostForm("/publish-requests", body, locale, token);
}

export async function getDiscountOffers(locale: Locale, token: string, query?: ApiQuery) {
  const page = await apiGetPage<ApiDiscountOffer[]>(
    "/discount-offers",
    locale,
    token,
    { per_page: 15, ...query },
  );
  return {
    items: asList<ApiDiscountOffer>(page.data).map(toOfferCard),
    meta: page.meta,
  };
}

export async function getDiscountOffer(id: string | number, locale: Locale, token: string) {
  const item = await apiGet<ApiDiscountOffer>(`/discount-offers/${id}`, locale, token);
  return toOfferCard(item);
}

export async function createDiscountOffer(
  payload: {
    advertiser_name: string;
    store_activity_name: string;
    discount_type_id: number;
    region_city: string;
    start_date: string;
    end_date: string;
    description: string;
    family_branch_id?: number;
    redemption_link?: string;
    offer_title?: string;
    coupon_code?: string;
    attachment?: File | null;
  },
  locale: Locale,
  token: string,
) {
  const body = new FormData();
  body.append("advertiser_name", payload.advertiser_name);
  body.append("store_activity_name", payload.store_activity_name);
  body.append("discount_type_id", String(payload.discount_type_id));
  body.append("region_city", payload.region_city);
  body.append("start_date", payload.start_date);
  body.append("end_date", payload.end_date);
  body.append("description", payload.description);
  if (payload.family_branch_id) {
    body.append("family_branch_id", String(payload.family_branch_id));
  }
  if (payload.redemption_link) body.append("redemption_link", payload.redemption_link);
  if (payload.offer_title) body.append("offer_title", payload.offer_title);
  if (payload.coupon_code) body.append("coupon_code", payload.coupon_code);
  if (payload.attachment) body.append("attachment", payload.attachment);
  return apiPostForm("/discount-offers", body, locale, token);
}

export async function redeemDiscountOffer(
  id: string | number,
  locale: Locale,
  token: string,
) {
  return apiPost(`/discount-offers/${id}/redeem`, {}, locale, token);
}

export async function getPlaceBookings(locale: Locale, token: string, query?: ApiQuery) {
  const page = await apiGetPage<ApiPlaceBooking[]>(
    "/place-bookings",
    locale,
    token,
    { my_requests_only: true, per_page: 50, ...query },
  );
  return asList<ApiPlaceBooking>(page.data).map((item) => toVenueBooking(item, locale));
}

export async function getRequestsCounts(locale: Locale, token: string) {
  try {
    return await apiGet<Record<string, number>>("/requests/counts", locale, token);
  } catch {
    return null;
  }
}

export type { RequestStatus };
